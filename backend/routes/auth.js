const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = Router();
const secretKey = "secret key";
const expiresIn = 60 * 60 * 24; // 24 hours

// helper function to handle errors
function handleError(res, status, message) {
    res.status(status).json({ error: true, message });
}

// function to insert a new registered account to the database
async function insertAccount(req, res) {
    try {
        const { email, password } = req.body;
        const existingEmails = await req.db.from("accounts").select("email").where("email", email);
        if (existingEmails.length > 0) {
            return handleError(res, 409, "User already exists");
        }
        await req.db.from("accounts").insert({ email, password: bcrypt.hashSync(password, 10) });
        res.status(201).json({ message: "User created" });
    } catch (err) {
        console.error(err);
        handleError(res, 500, "Server error");
    }
}

// function to create an Account table if it doesn't exist
async function createAccountTable(req, res) {
    try {
        await req.db.schema.createTable("accounts", (table) => {
            table.string("email");
            table.string("password");
            table.string("firstname");
            table.string("lastname");
            table.string("dob");
            table.string("address");
        });
        await insertAccount(req, res);
    } catch (err) {
        console.error(err);
        handleError(res, 500, "Server error");
    }
}

// user register post
router.post("/user/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return handleError(res, 400, "Request body incomplete, both email and password are required");
    }

    try {
        const tableExists = await req.db.schema.hasTable("accounts");
        if (tableExists) {
            await insertAccount(req, res);
        } else {
            await createAccountTable(req, res);
        }
    } catch (err) {
        console.error(err);
        handleError(res, 500, "Server error");
    }
});

// user login post
router.post("/user/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return handleError(res, 400, "Request body incomplete, both email and password are required");
    }

    try {
        const accounts = await req.db.from("accounts").select("email", "password").where("email", email);
        if (accounts.length === 0) {
            return handleError(res, 401, "Incorrect email or password");
        }

        const match = await bcrypt.compare(password, accounts[0].password);
        if (!match) {
            return handleError(res, 401, "Incorrect email or password");
        }

        const exp = Date.now() + expiresIn * 1000;
        const token = jwt.sign({ email, exp }, secretKey);
        res.json({ token, token_type: "Bearer", expires_in: expiresIn });
    } catch (err) {
        console.error(err);
        handleError(res, 500, "Server error");
    }
});

module.exports = router;
