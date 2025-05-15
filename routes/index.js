const express = require('express'); // importando express
const router = express.Router(); // criando o roteador
const { ensureAuthenticated } = require('../config/auth'); // importando o middleware de autenticação

// Welcome Page
router.get('/',(req, res) => res.render('welcome')); // renderizando a página de boas-vindas
// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', { // renderizando a página do dashboard
        name: req.user.name // passando o nome do usuário autenticado
    }));

module.exports = router; // exportando o roteador
