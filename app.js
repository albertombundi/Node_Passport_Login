const express = require('express');  // importando express
const expressLayouts = require('express-ejs-layouts'); // importando express-ejs-layouts
const mongoose = require('mongoose'); // importando mongoose
const flash = require('connect-flash'); // importando connect-flash
const session =  require('express-session'); // importando express-session
const passport = require('passport'); // importando passport

const app = express(); // instanciando express

// Passport config
require('./config/passport')(passport); // configurando passport

// DB Config
const db = require('./config/keys').MongoURI; // importando a chave do banco de dados

// Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true}) // conectando ao banco de dados
    .then(() => console.log('MongoDB Connected...')) // se conectar ao banco de dados
    .catch(err => console.log(err));  // se não conectar ao banco de dados

// EJS
app.use(expressLayouts); // usando express-ejs-layouts
app.set('view engine', 'ejs'); // definindo o motor de visualização como ejs

// Body parser
app.use(express.urlencoded({ extended: false })); // usando o body-parser para analisar o corpo da requisição

// Express Session
app.use(session({ // usando express-session
  secret: 'secret', // chave secreta
  resave: true, // resalvar a sessão
  saveUninitialized: true // salvar a sessão não inicializada
}));




// Passport middleware
app.use(passport.initialize()); // inicializando passport
app.use(passport.session()); // inicializando a sessão do passport

//connect flash
app.use(flash()); // usando connect-flash

// Global vars
app.use((req, res, next) => { // usando variáveis globais
  res.locals.success_msg = req.flash('success_msg'); // mensagem de sucesso
  res.locals.error_msg = req.flash('error_msg'); // mensagem de erro 
  res.locals.error = req.flash('error'); // mensagem de erro  
  next(); // chamando a próxima função

});

// Routes
app.use('/', require('./routes/index')); // usando as rotas do index
app.use('/users', require('./routes/users')); // usando as rotas do users

const PORT = process.env.PORT || 5000; // definindo a porta 

app.listen(PORT, console.log(`Server running on port ${PORT}`)); // escutando a porta