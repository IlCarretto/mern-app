import bcrypt from "bcrypt"; // encrypt password
import jwt from "jsonwebtoken"; // serve web token to send to user
import User from "../models/User.js";

// REGISTER USER
// when calling mongodb is async like an api; req is request from the frontend and res is response coming from backend
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewiedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); // send back a 201 status when sending the json version of the user (usable for frontend)
    } catch (err) {
        res.status(500).json({ error: err.message }); // if err, status code of 500 and db error message
    }
}

// LOGIN IN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User is not registered" });

        const isMatch = await bcrypt.compare(password, user.password); // if same hash -> permission confirmed
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({token, user});

    } catch (err) {
        res.status(500).json({ error: err.message }); // customizable message
    }
}