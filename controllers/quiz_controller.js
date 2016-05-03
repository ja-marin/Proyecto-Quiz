var models =require('../models');

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
	models.Quiz.findAll()
	.then(function(quizzes){
		res.render('quizzes/index.ejs', {quizzes: quizzes});
	}).catch(function(error){next(error);});
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
