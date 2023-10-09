const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, //because we are running localhost
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    console.log(req.body);
    /*
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    */

    const {name, email, password, passwordConfirm} = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error){
            console.log(error);
        }
        if(results.length>0){
            return res.render('register', {
                message: 'That email is already in use'
            });
        }else if(password!==passwordConfirm){
            return res.render('register', {
                message: 'The password do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
            if(error){
                console.log(error);
            }else{
                console.log(results);
                return res.render('register', {
                    message: 'User registered'
                });
            }
        })

    }); //pour vérifier si il y a déja cette email dans la database

}


exports.login = (req, res) => {

    const {name, email, password, passwordConfirm} = req.body;
    console.log(req.body);

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if(error){
            console.log(error);
        }
        if (results.length === 0) {
            // L'utilisateur n'existe pas.
            return res.render('login', {
                message_login: "User doesn't exist"
            });
          }
        const utilisateur = results[0];
        // Comparaison du mot de passe entré avec le mot de passe haché stocké.
        bcrypt.compare(password, utilisateur.password, (err, result) => {
        if (err) {
          // Une erreur s'est produite lors de la comparaison.
          return res.render('login', {
            message_login: "Email or password incorrect"
        });
        }
        if (result) {
            // Mot de passe correct, vous pouvez créer une session ou un jeton d'authentification ici.
            // Redirigez l'utilisateur ou renvoyez une réponse d'authentification réussie.
            console.log("Authntification réussis !!!!");
            //res.render('welcome');
            return res.render('welcome', {
                message_welcome: "Welcome "+utilisateur.name+" !"
            });
          } else {  
            // Mot de passe incorrect.
            return res.render('login', {
                message_login: "Password incorrect"
            });
          }
        });

    });
}