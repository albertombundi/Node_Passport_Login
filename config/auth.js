module.exports = { // Middleware para verificar se o usuário está autenticado
    ensureAuthenticated: function(req, res, next) {  // função para garantir que o usuário está autenticado
        if(req.isAuthenticated()) { // se o usuário estiver autenticado
            return next(); // chama a próxima função
        }
        req.flash('error_msg', 'Please log in to view this resource' ); // nao está autenticado, exibe uma mensagem de erro
        res.redirect('/users/login'); // redireciona para a página de login
    }
}