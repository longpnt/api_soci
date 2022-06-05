const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
//REGISTER
router.post("/register", async(req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString(),
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

const generateAccessToken = (user) => {
    const {
        _id,
        isAdmin,
        username,
        email
    } = user
    return jwt.sign({
        userId: _id,
        isAdmin,
        username,
        email
    }, "mySecretKey", {
        expiresIn: "30d",
    });
};

router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        !user && res.status(404).send("Khong tim thay tai khoan")

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        if (OriginalPassword !== req.body.password) {
            res.status(401).json("Sai mat khau");
        }

        const accessToken = generateAccessToken(user);
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            onlineTime: new Date(),
            accessToken,
        });

    } catch (err) {}
});
module.exports = router;