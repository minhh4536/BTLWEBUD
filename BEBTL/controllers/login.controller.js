const loginModel = require("../models/login.model");

async function login(req, res) {
    try {
        const { username, password } = req.body;
        if (username === "" || password === "") {
            return res.status(400).json({ message: "Username and password are required" });
        }
        const user = await loginModel.login(username, password);
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        res.json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    login,
};