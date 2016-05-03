var path =require('path');

//Cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
var sequelize= new Sequelize(null,null,null,
	{dialect: "sqlite",storage: "public/quiz.sqlite"});

//Importar la definición de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//sequelize.sync() crea e inicializa tabla de preguntas
sequelize
.sync()
.then(function(){
	return Quiz.count()
		.then(function (c) {
			if(c === 0){
				return Quiz.create({question: 'Capital de Italia', answer: 'Roma'})
					.then(function(){
						console.log('Base de datos inicializada con datos');
					});
			}
			else{console.log('No esta vacia');}
		});
}).catch(function(error){
	console.log("Error Sincronizando las tablas de la BBDD:",error);
	process.exit(1);
});
exports.Quiz = Quiz;