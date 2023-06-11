const express = require("express");
const hbs = require("hbs");
const app = express();
require("dotenv").config();

const routes = require("./routes/main");
const routes2 = require("./routes/home");

app.use('/static', express.static('public'));
app.use("",routes);
app.use("/home", routes2);

// template engine
app.set('view engine', 'hbs');
app.set("views", "views");
hbs.registerPartials("views/partials");

app.listen(process.env.PORT || 5566, ()=>{
    console.log(`Server Started At localhost:${process.env.PORT || 5566}`);
});