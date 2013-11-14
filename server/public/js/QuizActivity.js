var currentQuestion = [];
var correctQuestionsAnswered = 0;

function QuizActivity(){
	this.questionsMade = 0;
	this.questionsAnswered = 0;
	this.questions = [];
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
			}
			else if($("#checkAlt1").is(":checked") && $("#checkAlt3").is(":checked")){
				alternatives.push(new createAlternativeObject($("#alt1").val(), "true"));
				alternatives.push(new createAlternativeObject($("#alt3").val(), "true"));
			}
			else if($("#checkAlt2").is(":checked") && $("#checkAlt3").is(":checked")){
				alternatives.push(new createAlternativeObject($("#alt2").val(), "true"));
				alternatives.push(new createAlternativeObject($("#alt3").val(), "true"));
			}	

			else if($("#checkAlt1").is(":checked")){
				alternatives.push(new createAlternativeObject($("#alt1").val(), "true"));
			}
			else if($("#checkAlt2").is(":checked")){
				alternatives.push(new createAlternativeObject($("#alt2").val(), "true"));
			}
			else{ 
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

function Question(question, alternatives){
	this.question = question;
	this.alternatives = alternatives;
}

function createNewQuestionObject(questionName, alternatives){

	var questionName = $("#quizQuestion").val();

	console.log($("#checkAlt1").attr("checked")?true:false);
	console.log($("#checkAlt2").attr("checked")?true:false);
	console.log($("#checkAlt3").attr("checked")?true:false);

	var alt1 = new createAlternativeObject($("#alt1").val(), "true");
	var alt2 = new createAlternativeObject($("#alt2").val(), "false");
	var alt3 = new createAlternativeObject($("#alt3").val(), "true");

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
	console.log(currentQuestion.questions);

	$.ajax({
		type: "POST",
		url: "/api/activity/",
		data: {
			questions: currentQuestion.questions,
			activity_type: "QUIZ",
			element_id: 1,
		},
		success: function (response) {
			if ( response.redirect ){
				window.location.href = response.redirect;
			} else {
				console.log(response);
			}
		},
		error: function ( jqXHR, textStatus, errorThrown ){
			console.log('post element error:', jqXHR, textStatus, errorThrown);
		},
		dataType: "json"
	}); 

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

	var correctAnswer = currentQuestion.questions[currentQuestion.questionsAnswered].alternatives;
	console.log(correctAnswer);
	if($("#checkAlt1").is(":checked")){
		for(var i=0; i<correctAnswer.length; i++){
			console.log(correctAnswer.length);
			if($("#alt1").val()==correctAnswer[i].alternative){
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
			if($("#alt2").val()==correctAnswer[i].alternative){
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
			if($("#alt3").val()==correctAnswer[i].alternative){
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