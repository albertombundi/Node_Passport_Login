const express = require('express'); // importando express
const router = express.Router(); // criando o roteador
const bcrypt = require('bcryptjs'); // importando bcryptjs
const passport = require('passport'); // importando passport

// User model
const User = require('../models/User') // importando o modelo de usuário

// Login Page
router.get('/login',(req, res) => res.render('login')); // renderizando a página de login

// Register Page
router.get('/register',(req, res) => res.render('register')); // renderizando a página de registro

// Register Handle
router.post('/register',(req, res) => {
    const { name, email, password, password2 } = req.body; // pegando os dados do formulário
    let errors = []; // criando um array de erros

    // Check required fields
    if (!name || !email || !password || !password2) { // se algum campo estiver vazio
        errors.push({ msg: 'Please fill in all fields' }); // retorna um erro
    }

    // Check passwords match
    if (password !== password2) { // se as senhas não coincidirem
        errors.push({ msg: 'Passwords do not match' }); // retorna um erro
    }

    // Check password length
    if (password.length < 6) { // se a senha for menor que 6 caracteres
        errors.push({ msg: 'Password should be at least 6 characters' }); // retorna um erro
    }

    if (errors.length > 0) { // se houver erros
        res.render('register', { // renderiza a página de registro
            errors, // passa os erros
            name,   // nome
            email,  // email
            password, // senha
            password2 // confirma senha
        });
    } else { // se não houver erros
        // Validation passed
        User.findOne({ email: email })  // procura o usuário pelo email
        .then(user => {  // se o usuário for encontrado
            if(user) { // se o usuário já existir
                // user exists
                errors.push({ msg: 'Email is already registered'}); // retorna um erro
                res.render('register', { // renderiza a página de registro
                    errors,     // passa os erros
                    name,     // nome
                    email,   // email
                    password, // senha
                    password2 // confirma senha
                });

            } else { // se o usuário não existir
                const newUser = new User({ // cria um novo usuário
                    name, // adiciona o nome
                    email, // adiciona o email
                    password    // adiciona a senha
                });

                // Hash password
                bcrypt.genSalt(10, (err, salt) =>  
                    bcrypt.hash(newUser.password, salt, (err, hash) => {  // faz o hash da senha
                    if(err) throw err; // se houver erro, retorna o erro
                    // Set password to hashed
                    newUser.password = hash; // adiciona a senha hasheada
                    //Save user
                    newUser.save().then(() => { // salva o usuário
                        req.flash('success_msg', 'You are now registered and can log in'); // exibe uma mensagem de sucesso
                        res.redirect('/users/login');   // redireciona para a página de login
                    }).catch(err => console.log(err)); // se houver erro, retorna o erro.
                }))
            }
        });
    }
});

// Login Handle
router.post('/login', (req, res, next) => { // pega os dados do formulário
    passport.authenticate('local', { // autentica o usuário
        successRedirect: '/dashboard', // se o usuário for autenticado, redireciona para o dashboard
        failureRedirect: '/users/login', // se o usuário não for autenticado, redireciona para a página de login
        failureFlash: true // exibe uma mensagem de erro
    })(req, res, next); // chama a próxima função
});

// Logout Handle 
router.get('/logout', (req, res) => { // pega os dados do formulário
    req.logout((err) => { // faz o logout do usuário
        if (err) { return next(err); } // se houver erro, retorna o erro
        req.flash('success_msg', 'You are logged out'); // exibe uma mensagem de sucesso
        res.redirect('/users/login'); // redireciona para a página de login
    });
});

module.exports = router; // exportando o roteador