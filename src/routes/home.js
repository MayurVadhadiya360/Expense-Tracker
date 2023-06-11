const express = require("express");
const bodyparser = require("body-parser");
var jsonparser = bodyparser.json();

const routes = express.Router();

// MongoDB Database Configuration
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.URL);


routes.get('/', async (req, res) => {
    // console.log("home page rendered!");
    res.render('home');
});

module.exports = routes;