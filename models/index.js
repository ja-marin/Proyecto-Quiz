var path =require('path');

//Cargar modelo ORM
var Sequelize = require('sequelize');
//Usar BBDD SQlite
// DATABASE_URL =sqlite:///
// DATABASE_STORAGE =quiz.squlite
//Usar BDD Postgres:
//	DATABASE_URL0 postgres://user:passwd@host:port/database

var url,storage;
if(!process.env.DATABASE_URL){
	url = "sqlite:///";
	storage = "quiz.sqlite";
}else{
	url = process.env.DATABASE_URL;
	storage = process.env.DATABASE_STORAGE || "";
}
var sequelize = new Sequelize(url,
	{storage: storage,
	omitNull: true	

});
//Importar la definición de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//sequelize.sync() crea e inicializa tabla de preguntas

exports.Quiz = Quiz;