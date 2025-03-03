const { Router } = require("express");
const jwt = require("jsonwebtoken");
const secretKey = "secret key";

const router = Router();

// Countries
router.get("/countries", (req, res) => {
  const countries = [];
  const queryParams = Object.keys(req.query);

  // checking for invalid query parameters
  if (queryParams.length > 0) {
    return res.status(400).json({
      error: true,
      message: `Invalid query parameters: ${queryParams}. Query parameters are not permitted.`,
    });
  }

  // fetching distinct countries from the database
  req.db
      .from("data")
      .distinct("country")
      .then((rows) => {
        rows.map((data) => countries.push(data.country));
        countries.sort();
        res.status(200).json(countries);
      });
});

// Volcanoes
router.get("/volcanoes", async (req, res) => {
  const validPopulatedWithin = ["5km", "10km", "30km", "100km"];
  const validParams = ["country", "populatedWithin"];
  const queryParams = Object.keys(req.query);

  try {
    if (!req.query.country) {
      throw new Error("Country is a required query parameter.");
    }
    if (queryParams.some(param => !validParams.includes(param))) {
      throw new Error("Invalid query parameters. Only country and populatedWithin are permitted.");
    }
    if (req.query.populatedWithin && !validPopulatedWithin.includes(req.query.populatedWithin)) {
      throw new Error(`Invalid value for populatedWithin: ${req.query.populatedWithin}. Only: 5km, 10km, 30km, 100km are permitted.`);
    }

    const query = req.db.from("data").select("id", "name", "country", "region", "subregion").where({ country: req.query.country });

    if (req.query.populatedWithin) {
      query.andWhere(`population_${req.query.populatedWithin}`, ">", 0);
    }

    const volcanoes = await query;
    res.status(200).json(volcanoes);
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
});

// Volcano (with ID) endpoint
router.get("/volcano/:id", async (req, res) => {
  const volId = parseFloat(req.params.id);
  const queryParams = Object.keys(req.query);
  const authorization = req.headers.authorization;

  try {
    // Check for invalid query parameters
    if (queryParams.length > 0) {
      return res.status(400).json({
        error: true,
        message: `Invalid query parameters: ${queryParams.join(', ')}. Query parameters are not permitted.`
      });
    }

    // Validate volcano ID
    if (!(0 < volId && volId <= 1000 && Number.isInteger(volId))) {
      throw new Error(`Volcano with ID: ${req.params.id} not found.`);
    }

    let isAuthorized = false;

    // Handle authorization
    if (authorization) {
      const [authType, token] = authorization.split(" ");
      if (authType !== "Bearer" || !token) {
        return res.status(401).json({
          error: true,
          message: "Authorization header is malformed"
        });
      }

      const decoded = jwt.verify(token, secretKey);
      if (decoded.exp < Date.now() / 1000) { // JWT exp is in seconds
        return res.status(401).json({
          error: true,
          message: "JWT token has expired"
        });
      }

      isAuthorized = true;
    }

    // Fetch volcano data from the database
    const volcano = await req.db.from("data").select(
        "id", "name", "country", "region", "subregion",
        "last_eruption", "summit", "elevation",
        "latitude", "longitude",
        "population_5km", "population_10km", "population_30km", "population_100km"
    ).where({ id: volId }).first();

    if (!volcano) {
      throw new Error(`Volcano with ID: ${req.params.id} not found.`);
    }

    // Filter out population data if not authorized
    if (!isAuthorized) {
      delete volcano.population_5km;
      delete volcano.population_10km;
      delete volcano.population_30km;
      delete volcano.population_100km;
    }

    res.status(200).json(volcano);

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: true, message: "Invalid JWT token" });
    } else if (error.message === "JWT token has expired") {
      res.status(401).json({ error: true, message: "JWT token has expired" });
    } else if (error.message === "Authorization header is malformed") {
      res.status(401).json({ error: true, message: "Authorization header is malformed" });
    } else {
      res.status(404).json({ error: true, message: error.message });
    }
  }
});

module.exports = router;
