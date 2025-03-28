require("dotenv").config();
const userModel = require('../models/user.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const getUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const users = await userModel.getAll(page, limit, req.query);
        if (users.data.length === 0) {
            return res.status(200).json({ message: "No users were found!" });
        }
        return res.status(200).json(users);
    } catch (error) {
        console.error("An error occurred while retrieving users:", error);
        return res.status(500).json({ message: "An error occurred while retrieving users!" });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.getById(userId);
        if (!user) {
            return res.status(200).json({ message: "No user with that ID was found!" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("An error occurred while retrieving the user:", error);
        return res.status(500).json({ message: "An error occurred while retrieving the user!" });
    }
};

const register = async (req, res) => {
    try {
        const {name, email, password } = req.body;
        const existingUser = await userModel.checkExistingUser(email);
        if (existingUser) {
            return res.status(400).json({ message: "A user with these credentials already exists!" });
        }

        const results = await userModel.create(req.body);
        if (!results.insertId) {
            return res.status(400).json({ message: "Registration failed!" });
        }
        return res.status(200).json({ message: "Successfully registered!" });
    } catch (error) {
        console.error("An error occurred during registration:", error);
        return res.status(500).json({ message: "An error occurred during registration!" });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const results = await userModel.update(userId, req.body);
        if (results.affectedRows === 0) {
            return res.status(400).json({ message: "User update failed!" });
        }
        return res.status(200).json({ message: "User updated successfully!" });
    } catch (error) {
        console.error("An error occurred while updating the user:", error);
        return res.status(500).json({ message: "An error occurred while updating the user!" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const results = await userModel.remove(userId);
        if (results.affectedRows === 0) {
            return res.status(400).json({ message: "User deletion failed!" });
        }
        return res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        console.error("An error occurred while deleting the user:", error);
        return res.status(500).json({ message: "An error occurred while deleting the user!" });
    }
};

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const existingUser = await userModel.checkExistingUser(email);
      if (!existingUser) {
        return res
          .status(400)
          .json({ message: "The email or the password are not correct!" });
      }
  
      if (!bcrypt.compareSync(password, existingUser.password)) {
        return res
          .status(400)
          .json({ message: "The email or the password are not correct!" });
      }
  
      const access_token = jwt.sign(
        {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          password: existingUser.password
        },
        process.env.SECRETORKEY,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
      );
      return res.status(200).json({ access_token });
    } catch (error) {
      console.error("An error occurred during registration:", error);
      return res
        .status(500)
        .json({ message: "An error occurred during registration!" });
    }
  };
module.exports = { 
    getUsers, 
    getUser, 
    register, 
    updateUser, 
    deleteUser,
    login
};
