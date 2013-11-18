var currentQuestion = [];
var correctQuestionsAnswered = 0;
var alternative = "";
var correct = "";

function QuizActivity(response){
	this.questionsAnswered = 0;
	this.questions = [];
	this.questionsMade = 0;
	this.activity_id = -1;

	if(response==null){
		this.questions = [];
		this.activity_id = -1;
		this.questionsMade = 0;
	}
	else{
		var sub = response.subclass;

		this.questions = sub.questions;
		this.questionsMade = sub.questions.length;


		this.activity_id = response.activityId;
	}
}

function createNewQuizActivity(listOfQuestions, isNewGame){
	$(".chooseActivityDialog").dialog("close");
	currentQuestion = listOfQuestions;
	initializeQuizDialog();
	createAnotherQuestion(listOfQuestions, isNewGame);

	$(".numberOfQuestions").show();
	$("#numberOfQuestionText").show();
	$("#quizButton").show();
	$("#finishQuiz").show();

	$("#nextButtonDiv").hide();
	$("#lastButtonDiv").hide();

	$("#quizQuestion").prop("disabled", false);
	$("#alt1").prop("disabled", false);
	$("#alt2").prop("disabled", false);
	$("#alt3").prop("disabled", false);
}

function makeNewQuestion(){
	createAnotherQuestion(currentQuestion, false);
}

function initializeQuizDialog(){
	
	
	var Wwidth = $(window).width();
	var Wheight = $(window).height();
	
	$(".quizActivity").dialog({
		rezisable: false,
		height: Wheight*0.8,
		width: Wwidth*0.7,
		position: {
			my: "center top",
			at: "center top",
			of: "#mainFrame"
		},
		show: {
			effect: "clip",
			duration: 500
		},
		hide: {
			effect: "clip",
			duration: 500
		}
	});
	$(".numberOfQuestions").text(currentQuestion.questionsMade);

	$("#numberOfQuestionText").text("Antall spørsmål lagd:");
}

function createAnotherQuestion(questionObject, isNewGame){
	resetFields(isNewGame);
}

function resetFields(isNewGame){
	console.log("Question object is: ");
	console.log(currentQuestion);


	$(".numberOfQuestions").text(currentQuestion.questionsMade);
	if(!isNewGame){

		if( (!$("#quizQuestion").val().length > 0) || (!$("#alt1").val().length > 0) || (!$("#alt2").val().length > 0) || (!$("#alt3").val().length > 0) 
			|| ( (!$("#checkAlt1").is(":checked")) && (!$("#checkAlt2").is(":checked")) && (!$("#checkAlt3").is(":checked")) ) ){
			alert("fyll inn verdier i alle felt"); 
		}
		else{
			var alternatives = [];
			if($("#checkAlt1").is(":checked") && $("#checkAlt2").is(":checked") && $("#checkAlt3").is(":checked")){
				alternatives.push(new createAlternativeObject($("#alt1").val(), "true"));
				alternatives.push(new createAlternativeObject($("#alt2").val(), "true"));
				alternatives.push(new createAlternativeObject($("#alt3").val(), "true"));
			}
			else if($("#checkAlt1").is(":checked") && $("#checkAlt2").is(":checked")){
				alternatives.push(new createAlternativeObject($("#alt1").val(), "true"));
				alternatives.push(new createAlternativeObject($("#alt2").val(), "true"));
				alternatives.push(new createAlternativeObject($("#alt3").val(), "false"));
			}
			else if($("#checkAlt1").is(":checked") && $("#checkAlt3").is(":checked")){
				alternatives.push(new createAlternativeObject($("#alt1").val(), "true"));
				alternatives.push(new createAlternativeObject($("#alt2").val(), "false"));
				alternatives.push(new createAlternativeObject($("#alt3").val(), "true"));
			}
			else if($("#checkAlt2").is(":checked") && $("#checkAlt3").is(":checked")){
				alternatives.push(new createAlternativeObject($("#alt1").val(), "false"));
				alternatives.push(new createAlternativeObject($("#alt2").val(), "true"));
				alternatives.push(new createAlternativeObject($("#alt3").val(), "true"));
			}	

			else if($("#checkAlt1").is(":checked")){
				alternatives.push(new createAlternativeObject($("#alt1").val(), "true"));
				alternatives.push(new createAlternativeObject($("#alt2").val(), "false"));
				alternatives.push(new createAlternativeObject($("#alt3").val(), "false"));
			}
			else if($("#checkAlt2").is(":checked")){
				alternatives.push(new createAlternativeObject($("#alt1").val(), "false"));
				alternatives.push(new createAlternativeObject($("#alt2").val(), "true"));
				alternatives.push(new createAlternativeObject($("#alt3").val(), "false"));
			}
			else { 
				alternatives.push(new createAlternativeObject($("#alt1").val(), "false"));
				alternatives.push(new createAlternativeObject($("#alt2").val(), "false"));
				alternatives.push(new createAlternativeObject($("#alt3").val(), "true"));
			}

			var questionName = $("#quizQuestion").val();
			createNewQuestionObject(questionName, alternatives);
			$("input:text").val("");
			$("input:checkbox").attr("checked", false);
		}
	}
	else{
		$("input:text").val("");
		$("input:checkbox").attr("checked", false);
	}
}

function createAlternativeObject(object, isCorrect){
	this.alternative = object;
	this.correct = isCorrect;
}

function Question(question, alternatives, correctAlternatives){
	this.question = question;
	this.alternatives = alternatives;
	this.correctAlternatives = correctAlternatives;
}

function createNewQuestionObject(questionName, alternatives){

	var questionName = $("#quizQuestion").val();

	var alt1 = alternatives[0];
	var alt2 = alternatives[1];
	var alt3 = alternatives[2];

	var questionAlternatives = [];
	questionAlternatives.push(alt1);
	questionAlternatives.push(alt2);
	questionAlternatives.push(alt3);

	var correctAlternatives = [];
	

	for(var i=0; i<questionAlternatives.length; i++){
		if(questionAlternatives[i].correct == "true"){
			correctAlternatives.push(questionAlternatives[i].alternative);
		}
		else{
			console.log(questionAlternatives[i]);
		}
	}
	
	currentQuestion.questionsMade++;

	var tempQuestionObject = new Question(questionName, questionAlternatives, correctAlternatives);
	currentQuestion.questions.push(tempQuestionObject);

	$(".numberOfQuestions").text(currentQuestion.questionsMade);
}	

function finalizeQuiz(){

	if( (!$("#quizQuestion").val().length > 0) || (!$("#alt1").val().length > 0) || (!$("#alt2").val().length > 0) || (!$("#alt3").val().length > 0) 
		|| ( (!$("#checkAlt1").is(":checked")) && (!$("#checkAlt2").is(":checked")) && (!$("#checkAlt3").is(":checked")) ) ){
		$(".quizActivity").dialog("close");
	}
	else{
		resetFields(false);
		$(".quizActivity").dialog("close");
	}

	console.log(currentQuestion);

	for(var i=0; i<currentDialog.activityObject.questions.length; i++){
		console.log(currentDialog.activityObject.questions[i].constructor.name == "Object")
		if(currentDialog.activityObject.questions[i].constructor.name == "Object"){
			var objectAlternatives = currentDialog.activityObject.questions[i].alternatives;
			var correctAlternativeId = currentDialog.activityObject.questions[i].correctAlternatives;
			for(var j=0; j<objectAlternatives.length; j++){
				for(var n=0; n<correctAlternativeId.length; n++){
					if(objectAlternatives[j].quizQuestionAlternativeId == correctAlternativeId[n]){
						currentDialog.activityObject.questions[i].alternatives[j].correct = "true";
					}
					else{
						currentDialog.activityObject.questions[i].alternatives[j].correct = "false";
					}
					
				}
			}
		}
		else{
			console.log("heisann...");
		}
	}
	
	saveActivityByElementId(currentDialog.activityIndex, currentDialog.activityObject, currentDialog.element_id);
	console.log("lagrer...");

}

function createQuizActivity(listOfQuestions){
	console.log(listOfQuestions.questions);

	console.log("quiz activity");
	currentQuestion = listOfQuestions;
	if(currentQuestion.questionsAnswered<currentQuestion.questions.length){
		initializeQuizDialog();
	}
	else{
		alert("Du er ferdig med alle spørsmål");
	}

	$(".numberOfQuestions").hide();
	$("#numberOfQuestionText").hide();
	$("#quizButton").hide();
	$("#finishQuiz").hide();

	showQuestions();
}

function showQuestions(){
	if(currentQuestion.questionsAnswered<currentQuestion.questions.length){
		for(var i=currentQuestion.questionsAnswered; i<currentQuestion.questions.length; i++){
			var questionName = currentQuestion.questions[i].question;
			var alternative1 = currentQuestion.questions[i].alternatives[0].alternative;
			var alternative2 = currentQuestion.questions[i].alternatives[1].alternative;
			var alternative3 = currentQuestion.questions[i].alternatives[2].alternative;

			$("#quizQuestion").prop("disabled", true);
			$("#quizQuestion").val(questionName);

			$("#alt1").prop("disabled", true);
			$("#alt1").val(alternative1);

			$("#alt2").prop("disabled", true);
			$("#alt2").val(alternative2);

			$("#alt3").prop("disabled", true);
			$("#alt3").val(alternative3);

			showProperButton();
			
			break;
		}
	}
	else{
		resetFields(true);
		$(".quizActivity").dialog("close");
	}
}

function showProperButton(){
	
	if(currentQuestion.questionsAnswered<currentQuestion.questions.length-1){
		$("#lastButtonDiv").hide();
		$("#nextButtonDiv").show();
	}
	else{
		$("#nextButtonDiv").hide();
		$("#lastButtonDiv").show();
	}
}

function resetAnswer(){
	$("#checkAlt1").attr("checked", false);
	$("#checkAlt2").attr("checked", false);
	$("#checkAlt3").attr("checked", false);
}

function checkQuizAnswer(){

	var correctAnswer = currentQuestion.questions[currentQuestion.questionsAnswered];
	if($("#checkAlt1").is(":checked")){
		if(correctAnswer.alternatives[0].quizQuestionAlternativeId == correctAnswer.correctAlternatives){
			console.log("RIKTIG");
			correctQuestionsAnswered++;
			resetAnswer();
			currentQuestion.questionsAnswered++;
			showQuestions();
		}
		else{
			console.log("FEIL");
			resetAnswer();
			alert("Feil svar, du må svare riktig for å gå videre");
		}
	}
	else if($("#checkAlt2").is(":checked")){
		if(correctAnswer.alternatives[1].quizQuestionAlternativeId == correctAnswer.correctAlternatives){
			console.log("RIKTIG");
			correctQuestionsAnswered++;
			resetAnswer();
			currentQuestion.questionsAnswered++;
			showQuestions();
		}
		else{
			console.log("FEIL");
			resetAnswer();
			alert("Feil svar, du må svare riktig for å gå videre");
		}
	}
	else if($("#checkAlt3").is(":checked")){
		if(correctAnswer.alternatives[2].quizQuestionAlternativeId == correctAnswer.correctAlternatives){
			console.log("RIKTIG");
			correctQuestionsAnswered++;
			resetAnswer();
			currentQuestion.questionsAnswered++;
			showQuestions();
		}
		else{
			console.log("FEIL");
			resetAnswer();
			alert("Feil svar, du må svare riktig for å gå videre");
		}
	}
}