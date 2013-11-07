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

function createNewQuizActivity(quizObject){
	createAnotherQuestion(quizObject);
	initializeQuizDialog();
}

function makeNewQuestion(){
	createAnotherQuestion(currentQuestionObject);
}


var currentQuestionObject = new QuizActivity();

function createAnotherQuestion(questionObject){
	currentQuestionObject = questionObject;

	resetFields();

}

function resetFields(){
	if( (!$("#quizQuestion").val().length > 0) || (!$("#alt1").val().length > 0) || (!$("#alt2").val().length > 0) || (!$("#alt3").val().length > 0) 
		|| ( (!$("#checkAlt1").is(":checked")) && (!$("#checkAlt2").is(":checked")) && (!$("#checkAlt3").is(":checked")) ) ){
		alert("fyll inn verdier i alle felt"); 
	}
	else{
		currentQuestionObject.questionsMade++;

		var questionName = $("#quizQuestion").val();
		var alt1 = $("#alt1").val();
		var alt2 = $("#alt2").val();
		var alt3 = $("#alt3").val();
		var checkedAlternative = null;

		if($("#checkAlt1").is(":checked")){
			checkedAlternative = "alternative 1";
		}
		else if($("#checkAlt2").is(":checked")){
			checkedAlternative = "alternative 2";
		}
		else{ checkedAlternative = "alternative 3"; }

		$("input:text").val("");
		$("input:checkbox").attr("checked", false);

		var tempObject = new Question(questionName, alt1, alt2, alt3, checkedAlternative);
		currentQuestionObject.list.push(tempObject);

		console.log("number of questions made : " + currentQuestionObject.questionsMade);
		console.log(tempObject);
		console.log(currentQuestionObject.list);
	}
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
	
}