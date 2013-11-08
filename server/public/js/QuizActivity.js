function QuizActivity(){
	this.questionsMade = 0;
	this.list = [];
}

function Question(name, alt1, alt2, alt3, checkboxChecked){
	this.questionName = name;
	this.questionAlternative1 = alt1;
	this.questionAlternative2 = alt2;
	this.questionAlternative3 = alt3;
	this.questionCorrectAnswer = checkboxChecked;
}

function createNewQuizActivity(quizObject, newGame){
	createAnotherQuestion(quizObject, newGame);
	initializeQuizDialog();
}

function makeNewQuestion(){
	createAnotherQuestion(currentQuestionObject);
}

var currentQuestionObject = new QuizActivity();

function createAnotherQuestion(questionObject, newGame){
	currentQuestionObject = questionObject;

	if(!newGame){
		createNewQuestionObject();
	}
	resetFields(newGame);
	
}

function resetFields(newGame){
	$(".numberOfQuestions").text(currentQuestionObject.questionsMade);
	if(!newGame && (!$("#quizQuestion").val().length > 0) || (!$("#alt1").val().length > 0) || (!$("#alt2").val().length > 0) || (!$("#alt3").val().length > 0) 
		|| ( (!$("#checkAlt1").is(":checked")) && (!$("#checkAlt2").is(":checked")) && (!$("#checkAlt3").is(":checked")) ) ){
		alert("fyll inn verdier i alle felt"); 
	}
	else{
		if($("#checkAlt1").is(":checked")){
			checkedAlternative = "alternative 1";
		}
		else if($("#checkAlt2").is(":checked")){
			checkedAlternative = "alternative 2";
		}
		else{ checkedAlternative = "alternative 3"; }

		$("input:text").val("");
		$("input:checkbox").attr("checked", false);

	}
	
}

function createNewQuestionObject(){
	var questionName = $("#quizQuestion").val();
	var alt1 = $("#alt1").val();
	var alt2 = $("#alt2").val();
	var alt3 = $("#alt3").val();
	var checkedAlternative = null;

	currentQuestionObject.questionsMade++;
	var tempObject = new Question(questionName, alt1, alt2, alt3, checkedAlternative);
	currentQuestionObject.list.push(tempObject);

	console.log("number of questions made : " + currentQuestionObject.questionsMade);
	console.log(tempObject);
	console.log(currentQuestionObject.list);
	$(".numberOfQuestions").text(currentQuestionObject.questionsMade);
}

function finalizeQuiz(){
	$(".quizActivity").dialog("close");
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
		}
	});
	$(".numberOfQuestions").text(0);
	currentQuestionObject.questionsMade = 0;

	$("#numberOfQuestionText").text("Antall spørsmål lagd:");
}