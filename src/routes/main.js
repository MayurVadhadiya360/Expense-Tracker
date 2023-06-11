const express = require("express");
const bodyparser = require("body-parser");
var jsonparser = bodyparser.json();

const routes = express.Router();

// MongoDB Database Configuration
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.URL);

// Email Configuration
const nodemailer = require('nodemailer');
// Create a transporter object with your email service provider settings
const transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: "smtp.gmail.com",
    secureConnection: false,
    port: 587,
    requiresAuth: true,
    domains: ["gmail.com", "googlemail.com"],
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD
    }
});


routes.get("/", async (req, res) => {
    res.render("login");
});

routes.get('/signup', async (req, res) => {
    // console.log("signup page rendered!");
    res.render('signup');
});

routes.get('/forget_password', async (req, res) => {
    // console.log("forget_password page rendered!");
    res.render('forget_password');
});

// routes.get('/home', async (req, res) => {
//     // console.log("home page rendered!");
//     res.render('home');
// });

routes.get('/reset_password', async (req, res) => {
    // console.log("reset_password page rendered!");
    res.render('reset_password');
});

routes.post('/login_check', jsonparser, async (req, res) => {
    // console.log(req.body.msg);
    var login_success = false;
    success_data = {
        name: null,
        email: null,
        password: null
    };

    // MongoDB Connect
    try {
        await client.connect();
        if (req.body.email) {
            item = await client.db("Auth").collection("Email_Password").findOne({ _id: req.body.email });
            // console.log(item);
            if (req.body.password === item.password) {
                login_success = true;
                success_data.email = item._id;
                success_data.password = item.password;
                success_data.name = item.name;
                // console.log("login_success :", login_success);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    data = {
        message: "msg from Login check",
        success: login_success,
        email: success_data.email,
        password: success_data.password,
        name: success_data.name
    };
    res.send(data);
});

routes.post('/signup_check', jsonparser, async (req, res) => {
    // console.log(req.body.msg);
    var signup_success = false;

    for_insert = {
        name: req.body.name,
        _id: req.body.email,
        password: req.body.password
    };

    // MongoDb connection
    try {
        await client.connect();
        if (req.body.email) {
            var item = await client.db("Auth").collection("Email_Password").insertOne(for_insert);
            signup_success = item.acknowledged;
            // console.log(item);
        }
    } catch (e) {
        // console.log(item);
        console.error(e);
    } finally {
        await client.close();
    }

    data = {
        message: "msg from signup check",
        success: signup_success,
        email: for_insert._id,
        password: for_insert.password,
        name: for_insert.name
    };
    res.send(data);
});

routes.post('/forget_password_verification', jsonparser, async (req, res) => {
    // console.log(req.body.msg);
    var verification_success = false;
    var otp_success = false;
    // MongoDB Connect
    try {
        await client.connect();
        if (req.body.email) {
            const item = await client.db("Auth").collection("Email_Password").findOne({ _id: req.body.email });
            // console.log("req.body.email", item);

            // Generate OTP and send it to the database and user
            var otp = Math.floor(1000 + Math.random() * 9000);

            const filter = { _id: item._id };
            const updateDoc = {
                $set: {
                    otp: otp
                }
            };
            const options = { upsert: true };
            const result = await client.db("Auth").collection("Email_Password").updateOne(filter, updateDoc, options);

            // Define the email options
            const mailOptions = {
                from: process.env.ADMIN_EMAIL,
                to: item._id,
                subject: 'noreply@ reset password',
                text: 'Your OTP to reset password is :' + otp
            };

            // Send the email using the transporter
            const info = await transporter.sendMail(mailOptions);
            // console.log('Email sent:', info.response);
            verification_success = true;
        } else if (req.body.otp) {
            // Retrieve the OTP that was sent to database and 
            // validate it with the OTP from user
            const item = await client.db("Auth").collection("Email_Password").findOne({ _id: req.body.email_ });
            // console.log(item);
            if (Number(req.body.otp) == Number(item.otp)) {
                otp_success = true;
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    data = {
        message: "msg from forget_password_verification",
        email_success: verification_success,
        otp_success: otp_success
    };
    res.send(data);
});

routes.post("/reset_password", jsonparser, async (req, res) => {
    // console.log(req.body.msg);
    // console.log(req.body.email);
    var reset_success = false;
    var null_otp = false;
    try {
        await client.connect();
        if (req.body.email) {
            const item = await client.db("Auth").collection("Email_Password").findOne({ _id: req.body.email });
            // console.log("req.body.email", item);
            if(Number(item.otp) == 0){
                null_otp = true;
            }
            if(Number(req.body.otp) == Number(item.otp)) {
                const filter = { _id: item._id };
                const updateDoc = {
                    $set: {
                        otp: null,
                        password: req.body.password
                    }
                };
                const options = { upsert: true };
                const result = await client.db("Auth").collection("Email_Password").updateOne(filter, updateDoc, options);
                // console.log(result);
                reset_success = true;
            }
        }
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
    data = {
        message: "msg from reset_password",
        reset_success: reset_success,
        null_otp: null_otp
    };
    res.send(data);
});


module.exports = routes;