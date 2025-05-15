const localStrategy = require('passport-local').Strategy;  // importando a estratégia local do passport
const mongoose = require('mongoose');  // importando mongoose
const bcrypt = require('bcryptjs');  // importando bcryptjs


// Load User Model
const User = require('../models/User');  // importando o modelo de usuário

module.exports = function(passport) {  // exportando a função que recebe o passport
    passport.use( // usando a estratégia local
        new localStrategy({ usernameField: 'email' }, (email, password, done) => {  // criando uma nova estratégia local
            // Match User
            User.findOne({ email: email }) // procurando o usuário pelo email
                .then(user => {  // se o usuário for encontrado
                    if(!user) { // se o usuário não for encontrado
                        return done(null, false, {message: 'That email is not registered'}); // retorna um erro
                    }

                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => { // comparando a senha
                        if(err) throw err; // se houver erro, lança o erro

                        if(isMatch) { // se a senha estiver correta
                            return done(null, user); // retorna o usuário
                        } else { // se a senha estiver incorreta
                            return done(null, false, { message: 'Password incorrect' }); // retorna um erro
                        }
                    });
                })
                .catch(err => console.log(err)); // se houver erro, lança o erro
        })
    );

    passport.serializeUser((user, done) => { // serializando o usuário
        done(null, user.id); // retorna o id do usuário
    });

    passport.deserializeUser((id, done) => { // desserializando o usuário
       User.findById(id)    // procurando o usuário pelo id
            .then(user => done(null, user)) // retorna o usuário
            .catch(err => done(err, null)); // se houver erro, lança o erro
    });
}