const mongoose = require('mongoose');  // importando mongoose

const UserSchema = new mongoose.Schema({  // criando o esquema do usuário
    name: {
        type: String,   // tipo do nome
        required: true  // nome é obrigatório
    },
    email: {  
        type: String, // tipo do email
        required: true // email é obrigatório
    },
    password: {
        type: String, // tipo da senha
        required: true // senha é obrigatória
    },
    date: {
        type: Date, // tipo da data
        default: Date.now // data padrão é a data atual
    }
});

const User = mongoose.model('User', UserSchema); // criando o modelo do usuário

module.exports = User; // exportando o modelo do usuário