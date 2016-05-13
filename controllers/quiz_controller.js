var models =require('../models');
var Sequelize = require('sequelize');

exports.load = function(req,res,next,quizId){
	models.Quiz.findById(quizId)
	.then(function(quiz){
		if(quiz){
			req.quiz = quiz;
			next();
		} else {
			next(new Error('No existe quizId='+quizId));
		}
	}).catch(function(error){next(error);});
};

exports.index=function(req,res,next){
	if(req.query.search){
		models.Quiz.findAll({where: {question: {$like: "%"+req.query.search+"%" }},order: [['question', 'ASC']] })
		.then(function(quizzes){
			if(quizzes){	
				res.render('quizzes/index.ejs',{quizzes:quizzes});
			}
			else{throw new Error('No existe ese quiz en la BBDD');}
		}).catch(function(error){next(error);});
	}else{
		models.Quiz.findAll({order: [['question', 'ASC']]})
		.then(function(quizzzes){
				res.render('quizzes/index.ejs', {quizzes: quizzzes});
			}).catch(function(error){next(error);});
	}
	
};
exports.show=function(req,res,next){
	models
	.Quiz
	.findById(req.params.quizId)
	.then(function(quiz){
		if(quiz){
			var answer=req.query.answer || '';
			res.render('quizzes/show', {quiz: req.quiz, answer: answer});
		}
		else{
			throw new Error('No existe ese quiz en la BBDD');
		}
	}).catch(function(error){
		next(error);
	});
	
};
//GET /check

exports.check=function(req,res,next){
	models
	.Quiz
	.findById(req.params.quizId)
	.then(function(quiz){
		if(quiz){
			var answer = req.query.answer || "";
			var result= answer === req.quiz.answer ? 'Correcta' : 'Incorrecta';
			res.render('quizzes/result', {quiz: req.quiz, result:result, answer: answer});
		}
		else{
			throw new Error('No existe ese quiz en la BBDD');
		}
	}).catch(function(error){next(error);});
	
};
exports.new=function(req,res,next){
	var quiz = models.Quiz.build({question: "", answer: ""});
	res.render('quizzes/new', {quiz: quiz});
};

exports.create=function(req,res,next){
	var quiz= models.Quiz.build({question: req.body.quiz.question,
								answer: req.body.quiz.answer	});

	quiz.save({fields: ["question", "answer"]})
	.then(function(quiz){
		req.flash('success', 'Quiz creado con éxito.');
		res.redirect('/quizzes');
	}).catch(Sequelize.ValidationError, function(error){
		req.flash('error','Errores en el formulario: ');
		for( var i in error.errors){
			req.flash('error', error.errors[i].value);
		};
		res.render('quizzes/new', {quiz:quiz});
	}).catch(function(error){
		req.flash('error','Error al crear un Quiz: '+error.message);
		next(error);
	});
};

exports.edit=function(req,res,next){
	var quiz=req.quiz;
	res.render('quizzes/edit', {quiz:quiz});
};

exports.update=function(req,res,next){
	req.quiz.question = req.body.quiz.question;
	req.quiz.answer = req.body.quiz.answer;

	req.quiz.save({fields: ["question", "answer"]})
	.then(function(quiz){
		req.flash('success', 'Quiz editado con éxito.');
		res.redirect('/quizzes');
	}).catch(Sequelize.ValidationError,function(error){
		req.flash('error', 'Errores en el formulario');
		for (var i in error.errors){
			req.flash('error', error.errors[i].value);
		};
		res.render('quizzes/edit', {quiz: req.quiz});
	}).catch(function(error){
		req.flash('error', 'Error al editar el Quiz: '+error.message);
		next(error);
	});
};

exports.destroy = function(req,res,next){
	req.quiz.destroy()
	.then(function(){
		req.flash('success', 'Quiz borrado con éxito.');
		res.redirect('/quizzes');
	}).catch(function(error){
		req.flash('error', 'Error al editar el Quiz: '+error.message);
		next(error);
	});
};