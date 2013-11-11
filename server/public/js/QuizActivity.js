var currentQuestionObject = null;
var correctQuestionsAnswered = 0;

function QuizActivity(){
	this.questionsMade = 0;
	this.list = [];
	this.questionsAnswered = 0;
}

function Question(name, alt1, alt2, alt3, checkboxChecked){
	this.questionName = name;
	this.questionAlternative1 = alt1;
	this.questionAlternative2 = alt2;
	this.questionAlternative3 = alt3;
	this.questionCorrectAnswer = checkboxChecked;
}

function createNewQuizActivity(questionList, newGame){
	currentQuestionObject = questionList;
	initializeQuizDialog();	
	createAnotherQuestion(questionList, newGame);

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
	createAnotherQuestion(currentQuestionObject,false);
}

function createAnotherQuestion(questionObject, newGame){
	resetFields(newGame);
}

function resetFields(newGame){
	$(".numberOfQuestions").text(currentQuestionObject.questionsMade);
	if(!newGame){
		if( (!$("#quizQuestion").val().length > 0) || (!$("#alt1").val().length > 0) || (!$("#alt2").val().length > 0) || (!$("#alt3").val().length > 0) 
			|| ( (!$("#checkAlt1").is(":checked")) && (!$("#checkAlt2").is(":checked")) && (!$("#checkAlt3").is(":checked")) ) ){
			alert("fyll inn verdier i alle felt"); 
		}
		else{
			var checkedAlternative = null;
			if($("#checkAlt1").is(":checked")){
				checkedAlternative = $("#alt1").val();
			}
			else if($("#checkAlt2").is(":checked")){
				checkedAlternative = $("#alt2").val();
			}
			else{ checkedAlternative = $("#alt3").val(); }

			createNewQuestionObject(checkedAlternative);
			$("input:text").val("");
			$("input:checkbox").attr("checked", false);
		}
	}
	else{
		$("input:text").val("");
		$("input:checkbox").attr("checked", false);
	}
	
}

function createNewQuestionObject(checkedAlternative){
	var questionName = $("#quizQuestion").val();
	var alt1 = $("#alt1").val();
	var alt2 = $("#alt2").val();
	var alt3 = $("#alt3").val();
	
	currentQuestionObject.questionsMade++;
	var tempObject = new Question(questionName, alt1, alt2, alt3, checkedAlternative);
	currentQuestionObject.list.push(tempObject);

	console.log("number of questions made : " + currentQuestionObject.questionsMade);
	console.log(tempObject);
	console.log(currentQuestionObject.list);
	$(".numberOfQuestions").text(currentQuestionObject.questionsMade);
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
	$(".numberOfQuestions").text(currentQuestionObject.questionsMade);

	$("#numberOfQuestionText").text("Antall spørsmål lagd:");
}

function createQuizActivity(questionList){
	console.log("quiz activity");
	currentQuestionObject = questionList;
	if(currentQuestionObject.questionsAnswered!=currentQuestionObject.list.length){
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

var count = 0;
function showQuestions(){
	if(count<currentQuestionObject.list.length){
		for(var i=count; i<currentQuestionObject.list.length; i++){
		console.log("var i er: " + i);
		console.log("lengden på lista er: " + currentQuestionObject.list.length);
		var questionName = currentQuestionObject.list[i].questionName;
		var alternative1 = currentQuestionObject.list[i].questionAlternative1;
		var alternative2 = currentQuestionObject.list[i].questionAlternative2;
		var alternative3 = currentQuestionObject.list[i].questionAlternative3;

		$("#quizQuestion").prop("disabled", true);
		$("#quizQuestion").val(questionName);

		$("#alt1").prop("disabled", true);
		$("#alt1").val(alternative1);

		$("#alt2").prop("disabled", true);
		$("#alt2").val(alternative2);

		$("#alt3").prop("disabled", true);
		$("#alt3").val(alternative3);

		showProperButton();
		currentQuestionObject.questionsAnswered++;
		console.log(currentQuestionObject.questionsAnswered);
		break;
		}
	}
	else{
		resetFields(true);
		$(".quizActivity").dialog("close");
	}
}

function showProperButton(){
	console.log("count er: "+ count);
	console.log("lengden på lista er: " + currentQuestionObject.list.length);
	if(count<currentQuestionObject.list.length-1){
		$("#lastButtonDiv").hide();
		$("#nextButtonDiv").show();
	}
	else{
		$("#nextButtonDiv").hide();
		$("#lastButtonDiv").show();
	}
}

function checkQuizAnswer(){
	console.log("count er nå: "+ count);

	var correctAnswer = currentQuestionObject.list[count].questionCorrectAnswer;
	if($("#checkAlt1").is(":checked")){
		if($("#alt1").val()==correctAnswer){
			console.log("RIKTIG");
			correctQuestionsAnswered++;
			resetAnswer();
			count++;
			showQuestions();
		}
		else{
			console.log("FEIL");
			resetAnswer();
			alert("Feil svar, du må svare riktig for å gå videre");
		}
	}
	else if($("#checkAlt2").is(":checked")){
		if($("#alt2").val()==correctAnswer){
			console.log("RIKTIG");
			correctQuestionsAnswered++;
			resetAnswer();
			count++;
			showQuestions();
		}
		else{
			console.log("FEIL");
			resetAnswer();
			alert("Feil svar, du må svare riktig for å gå videre");
		}
	}
	else if($("#checkAlt3").is(":checked")){
		if($("#alt3").val()==correctAnswer){
			console.log("RIKTIG");
			correctQuestionsAnswered++;
			resetAnswer();
			count++;
			showQuestions();
		}
		else{
			console.log("FEIL");
			resetAnswer();
			alert("Feil svar, du må svare riktig for å gå videre");
		}
	}
}

function resetAnswer(){
	$("#checkAlt1").attr("checked", false);
	$("#checkAlt2").attr("checked", false);
	$("#checkAlt3").attr("checked", false);
}