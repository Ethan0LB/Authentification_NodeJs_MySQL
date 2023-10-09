const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');

dotenv.config({path: './.env'});

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, //because we are running localhost
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public'); //__dirname donne le directory actuel, ici C:\node_mysql
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'hbs');


db.connect( (error) =>{
    if(error){
        console.log(error)
    }
    else{
        console.log("MYSQL Connected...")
    }
})

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(5000, () => {
    console.log("Server started on Port 5000");
}) //port 5000