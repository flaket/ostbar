var ActionType              = require('./entities/actiontype').ActionType;
module.exports.ActionType   = ActionType;

var Activity            = require('./entities/activity').Activity;
module.exports.Activity = Activity;

var ActivityLanguage            = require('./entities/activitylanguage').ActivityLanguage;
module.exports.ActivityLanguage = ActivityLanguage;

var ActivityMath            = require('./entities/activitymath').ActivityMath;
module.exports.ActivityMath = ActivityMath;

var ActivityQuiz            = require('./entities/activityquiz').ActivityQuiz;
module.exports.ActivityQuiz = ActivityQuiz;

var Avatar              = require('./entities/avatar').Avatar;
module.exports.Avatar   = Avatar;

var Element             = require('./entities/element').Element;
module.exports.Element  = Element;

var ElementType             = require('./entities/elementtype').ElementType;
module.exports.ElementType  = ElementType;

var Game                = require('./entities/game').Game;
module.exports.Game     = Game;

var Goal                = require('./entities/goal').Goal;
module.exports.Goal     = Goal;

var LanguageQuestion            = require('./entities/languagequestion').LanguageQuestion;
module.exports.LanguageQuestion = LanguageQuestion;

var LanguageQuestionAlternative             = require('./entities/languagequestionalternative').LanguageQuestionAlternative;
module.exports.LanguageQuestionAlternative  = LanguageQuestionAlternative;

var MathOperator            = require('./entities/mathoperator').MathOperator;
module.exports.MathOperator = MathOperator;

var QuizQuestion            = require('./entities/quizquestion').QuizQuestion;
module.exports.QuizQuestion = QuizQuestion;

var QuizQuestionAlternative             = require('./entities/quizquestionalternative').QuizQuestionAlternative;
module.exports.QuizQuestionAlternative  = QuizQuestionAlternative;

var Reward              = require('./entities/reward').Reward;
module.exports.Reward   = Reward;

var Scene               = require('./entities/scene').Scene;
module.exports.Scene    = Scene;

var Sound               = require('./entities/sound').Sound;
module.exports.Sound    = Sound;

var SubjectType             = require('./entities/subjecttype').SubjectType;
module.exports.SubjectType = SubjectType;

var User                = require('./entities/user').User;
module.exports.User     = User;

var World 		        = require('./entities/world').World;
module.exports.World    = World;

var DB                  = require('./db');
var db                  = DB.instance;

var util 		        = require('util');

// Scene.loadById(function(scene)
// {
// 	var myScene = scene;
// 	console.log('found data', util.inspect(myScene, false, null));
// }, 1);

// Game.loadById(function(game)
// {
//     var firstGame = game;
//     // console.log('found game ', util.inspect(firstGame, false, null));

//     var initialScene = game.initialScene;
//     var element = initialScene.elements[0];
    
//     // console.log('found element'); 
//     // console.log(util.inspect(element, false, null));

//     var actionType = element.actionTypes[0];
//     Activity.loadById(function (activity)
//     {
//     	// console.log('activity', util.inspect(activity, false, null));
//     }, actionType.data);
// }, 1);

