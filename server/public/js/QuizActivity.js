var currentQuestion = [];
var correctQuestionsAnswered = 0;

function QuizActivity(){
	this.questionsMade = 0;
	this.questionsAnswered = 0;
	this.questions = [];
}

function createQuizActivity(listOfQuestions){

}

function createNewQuizActivity(listOfQuestions, isNewGame){
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
	$(".chooseActivityDialog").dialog("close");
	
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
	console.log(currentQuestion.questions.question.alternatives);
	$(".numberOfQuestions").text(currentQuestion.questionsMade);
	if(!isNewGame){
		if( (!$("#quizQuestion").val().length > 0) || (!$("#alt1").val().length > 0) || (!$("#alt2").val().length > 0) || (!$("#alt3").val().length > 0) 
			|| ( (!$("#checkAlt1").is(":checked")) && (!$("#checkAlt2").is(":checked")) && (!$("#checkAlt3").is(":checked")) ) ){
			alert("fyll inn verdier i alle felt"); 
		}
		else{
			var alternatives = [];
			if($("#checkAlt1").is(":checked") && $("#checkAlt2").is(":checked") && $("#checkAlt3").is(":checked")){
				alternatives.push(createAlternativeObject($("#alt1").val(), true));
				alternatives.push(createAlternativeObject($("#alt2").val(), true));
				alternatives.push(createAlternativeObject($("#alt3").val(), true));
			}
			else if($("#checkAlt1").is(":checked") && $("#checkAlt2").is(":checked")){
				alternatives.push(createAlternativeObject($("#alt1").val(), true));
				alternatives.push(createAlternativeObject($("#alt2").val(), true));
			}
			else if($("#checkAlt1").is(":checked") && $("#checkAlt3").is(":checked")){
				alternatives.push(createAlternativeObject($("#alt1").val(), true));
				alternatives.push(createAlternativeObject($("#alt3").val(), true));
			}
			else if($("#checkAlt2").is(":checked") && $("#checkAlt3").is(":checked")){
				alternatives.push(createAlternativeObject($("#alt2").val(), true));
				alternatives.push(createAlternativeObject($("#alt3").val(), true));
			}	

			else if($("#checkAlt1").is(":checked")){
				alternatives.push(createAlternativeObject($("#alt1").val(), true));
			}
			else if($("#checkAlt2").is(":checked")){
				alternatives.push(createAlternativeObject($("#alt2").val(), true));
			}
			else{ 
				alternatives.push(createAlternativeObject($("#alt3").val(), true)); 
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
	this.isCorrect = isCorrect;
}

function Question(question, alternatives){
	this.question = question;
	this.alternatives = alternatives;
}

function createNewQuestionObject(questionName, alternatives){

	var questionName = $("#quizQuestion").val();
	var alt1 = $("#alt1").val();
	var alt2 = $("#alt2").val();
	var alt3 = $("#alt3").val();

	var questionAlternatives = [];
	questionAlternatives.push(alt1);
	questionAlternatives.push(alt2);
	questionAlternatives.push(alt3);
	
	currentQuestion.questionsMade++;

	var tempQuestionObject = new Question(questionName, questionAlternatives);
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
}

function createQuizActivity(listOfQuestions){
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
			console.log("var i er: " + i);
			console.log("lengden på lista er: " + currentQuestion.questions.length);
			var questionName = currentQuestion.questions[i].question;
			var alternative1 = currentQuestion.questions[i].alternatives[1];
			var alternative2 = currentQuestion.questions[i].alternatives[2];
			var alternative3 = currentQuestion.questions[i].alternatives[3];

			$("#quizQuestion").prop("disabled", true);
			$("#quizQuestion").val(questionName);

			$("#alt1").prop("disabled", true);
			$("#alt1").val(alternative1);

			$("#alt2").prop("disabled", true);
			$("#alt2").val(alternative2);

			$("#alt3").prop("disabled", true);
			$("#alt3").val(alternative3);

			showProperButton();
			console.log(currentQuestion.questionsAnswered);
			break;
		}
	}
	else{
		resetFields(true);
		$(".quizActivity").dialog("close");
	}
}

function showProperButton(){
	console.log("lengden på lista er: " + currentQuestion.questions.length);
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

	var correctAnswer = currentQuestion.questions[currentQuestion.questionsAnswered].questionCorrectAnswer;
	if($("#checkAlt1").is(":checked")){
		console.log("lengden av riktige svar: " + correctAnswer.length);
		for(var i=0; i<correctAnswer.length; i++){
			if($("#alt1").val()==correctAnswer[i]){
				console.log("RIKTIG");
				correctQuestionsAnswered++;
				resetAnswer();
				currentQuestion.questionsAnswered++;
				showQuestions();
			}
			else{
				if(correctAnswer.length==1){
					console.log("FEIL");
					resetAnswer();
					alert("Feil svar, du må svare riktig for å gå videre");
				}
				else{
					console.log("FEIL");
					resetAnswer();
					//alert("Feil svar, du må svare riktig for å gå videre");
				}
			}
		}
	}
	else if($("#checkAlt2").is(":checked")){
		for(var i=0; i<correctAnswer.length; i++){
			if($("#alt2").val()==correctAnswer[i]){
				console.log("RIKTIG");
				correctQuestionsAnswered++;
				resetAnswer();
				currentQuestion.questionsAnswered++;
				showQuestions();
			}
			else{
				if(correctAnswer.length==1){
					console.log("FEIL");
					resetAnswer();
					alert("Feil svar, du må svare riktig for å gå videre");
				}
				else{
					console.log("FEIL");
					resetAnswer();
					//alert("Feil svar, du må svare riktig for å gå videre");
				}
			}
		}
	}
	else if($("#checkAlt3").is(":checked")){
		for(var i=0; i<correctAnswer.length; i++){
			if($("#alt3").val()==correctAnswer[i]){
				console.log("RIKTIG");
				correctQuestionsAnswered++;
				resetAnswer();
				currentQuestion.questionsAnswered++;
				showQuestions();
			}
			else{
				if(correctAnswer.length==1){
					console.log("FEIL");
					resetAnswer();
					alert("Feil svar, du må svare riktig for å gå videre");
				}
				else{
					console.log("FEIL");
					resetAnswer();
					//alert("Feil svar, du må svare riktig for å gå videre");
				}
			}
		}
	}
}