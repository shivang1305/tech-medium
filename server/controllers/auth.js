const User = require("../models/user");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { registerEmailParams } = require("../helpers/email");
const shortId = require("shortid");

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACESS_KEY,
    region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

exports.register = (req, res) => {
    // console.log('REGISTER CONTROLLER', req.body);
    const { name, email, password } = req.body;

    // check if the user already exists in our database
    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: "User already exists",
            });
        }

        // generate token with user name, email id and password
        const token = jwt.sign(
            { name, email, password },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
                expiresIn: "10m",
            }
        );

        // send email
        const params = registerEmailParams(email, token);

        const sendEmailOnRegister = ses.sendEmail(params).promise();

        sendEmailOnRegister
            .then((data) => {
                console.log("email submitted to SES", data);
                res.json({
                    message: `Email has been sent to ${email}, Follow the instructions to complete your registration`,
                });
            })
            .catch((error) => {
                console.log("SES email on register", error);
                res.json({
                    message: `We could not verify your email. Please try again.`,
                });
            });
    });
};

exports.registerActivate = (req, res) => {
    const { token } = req.body;
    console.log(token);

    jwt.verify(
        token,
        process.env.JWT_ACCOUNT_ACTIVATION,
        function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: "Expired link, please try again.",
                });
            }

            const { name, email, password } = jwt.decode(token);
            const username = shortId.generate();

            User.findOne({ email }).exec((err, user) => {
                if (user) {
                    return res.status(401).json({
                        error: "Email is taken, User already exists.",
                    });
                }

                // register the new user
                const newUser = new User({ username, name, email, password });
                newUser.save((er, result) => {
                    if (er) {
                        return res.status(401).json({
                            error: "Error saving the user in the database. Try later.",
                        });
                    }

                    return res.json({
                        message: "Registration success. Please login.",
                    });
                });
            });
        }
    );
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    // console.table({ email, password });

    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with that email does not exists. Please register.",
            });
        }

        // authenticate the user
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: "Email and password does not match.",
            });
        }

        // generate token and send it to the client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        const { _id, name, email, role } = user;

        return res.json({
            token,
            user: { _id, name, email, role },
        });
    });
};

// to check that the current user is signedin or not
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
}); // req.user

// to authenticate that the current logged in user is subscriber or not
exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id;
    User.findOne({ id: authUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found",
            });
        }

        if (user !== "admin") {
            return res.status(400).json({
                error: "Admin resource. Access denied",
            });
        }

        req.profile = user;
        next();
    });
};

// to authenticate that the current logged in user is admin or not
exports.adminMiddleware = (req, res, next) => {
    const authUserId = req.user._id;
    User.findOne({ id: authUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found",
            });
        }

        if (user.role != "admin") {
            return res.status(400).json({
                error: "Admin resource. Access denied.",
            });
        }

        req.profile = user;
        next();
    });
};
