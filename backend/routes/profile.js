const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const secretKey = "secret key";

// Function to return all data of an account (except password)
function getAccountData(req, res) {
    req.db.from("accounts")
        .select("*")
        .where("email", req.params.email)
        .then(([existAccount]) => {
            if (existAccount) {
                const { email, firstname, lastname, dob, address } = existAccount;
                res.status(200).json({ email, firstName: firstname, lastName: lastname, dob, address });
            } else {
                res.status(404).json({ error: true, message: "User not found" });
            }
        })
        .catch(() => res.status(500).json({ error: true, message: "Internal Server Error" }));
}

// Middleware to check valid date format
function isValidDateFormat(date) {
    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    return date.match(dateFormat);
}

// Middleware to check if date is in the past
function isDateInPast(date) {
    return new Date(date) < new Date();
}

// Profile endpoint - Get profile
router.get("/user/:email/profile", async (req, res) => {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ error: true, message: "Authorization header ('Bearer token') not found" });

    const token = authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, secretKey);
        if (req.params.email !== decoded.email) return res.status(403).json({ error: true, message: "Forbidden" });

        const exists = await req.db.schema.hasTable("accounts");
        if (exists) return getAccountData(req, res);
        return res.status(404).json({ error: true, message: "User not found" });
    } catch (error) {
        return res.status(401).json({ error: true, message: "Invalid or expired JWT token" });
    }
});

// Update profile
router.put("/user/:email/profile", async (req, res) => {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ error: true, message: "Authorization header ('Bearer token') not found" });

    const token = authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, secretKey);
        if (req.params.email !== decoded.email) return res.status(403).json({ error: true, message: "Forbidden" });

        const { firstName, lastName, dob, address } = req.body;
        if (!firstName || !lastName || !dob || !address) return res.status(400).json({ error: true, message: "Request body incomplete: firstName, lastName, dob, and address are required." });
        if (typeof firstName !== "string" || typeof lastName !== "string" || typeof address !== "string") return res.status(400).json({ error: true, message: "Request body invalid: firstName, lastName, and address must be strings only." });
        if (!isValidDateFormat(dob)) return res.status(400).json({ error: true, message: "Invalid input: dob must be a real date in format YYYY-MM-DD." });
        if (!isDateInPast(dob)) return res.status(400).json({ error: true, message: "Invalid input: dob must be a date in the past." });

        await req.db.from("accounts")
            .where("email", req.params.email)
            .update({ firstName, lastName, dob, address });
        return getAccountData(req, res);
    } catch (error) {
        return res.status(401).json({ error: true, message: "Invalid or expired JWT token" });
    }
});

module.exports = router;
