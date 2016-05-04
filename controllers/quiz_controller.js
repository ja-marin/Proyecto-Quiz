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
	if(req.query.search){
		models.Quiz.findAll({where: {question: {$like: "%"+req.query.search+"%" }}})
		.then(function(quizzes){
			if(quizzes){	
				res.render('quizzes/index.ejs',{quizzes:quizzes});
			}
			else{throw new Error('No existe ese quiz en la BBDD');}
		}).catch(function(error){next(error);});
	}else{
		models.Quiz.findAll()
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

