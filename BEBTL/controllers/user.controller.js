const userModel = require("../models/user.model");

async function getAllUsers(req, res) {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUserById(req, res) {
  try {
    const id = req.params.id;
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUserByName(req, res) {
  try {
    const username = req.query.username;
    const user = await userModel.getUserByName(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createUser(req, res) {
  try {
    const { username, password } = req.body;
    if (username === "" || password === "") {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }
    const result = await userModel.createUser(username, password);
    res.status(201).json({ message: "User created successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const id = req.params.id;
    const result = await userModel.deleteUser(id);
    res.json({ message: "User deleted successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const id = req.params.id;
    const { username, password } = req.body;
    const result = await userModel.updateUser(id, username, password);
    res.json({ message: "User updated successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
};
