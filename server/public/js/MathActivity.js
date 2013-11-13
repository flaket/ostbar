function MathActivity(){
	this.questionsAnswered = 0;
	this.correctAnswers = 0;
	
	this.lowestNumber = 0;
	this.highestNumber = 0;
	
	this.operators = [];
	this.operandsCount = 1;

	this.randomNumber1 = 0;
	this.randomNumber2 = 0;
	
	this.life = 3;
	
	// resetScore();
}

var currentMathObject = null;

function createNewMathActivity(mathObject){
	
	currentMathObject = mathObject;
	
	beforeParametersAreSetView();
	initializeMathDialog();

	$("#all").prop('checked', true).change();
	
	$("#inputValueButton").click(function createRandomNumber(){
		if($("#lownumber").val()=="" || $("#highnumber").val() == ""){
			alert("Du må skrive inn i alle feltene");
		}
		else{
			afterParametersAreSetView();
			// $(".mathActivity").dialog("close");
			
			var numLow = $("#lownumber").val();
			var numHigh = $("#highnumber").val();
			
			if(numLow>numHigh){
				var temp = numLow;
				numLow = numHigh;
				numHigh = temp;
			}
			
			currentMathObject.lowestNumber = numLow;
			currentMathObject.highestNumber = numHigh;
			
			$(".mathActivity").dialog("close");
			// initializeNewMathActivity();
		}
	});
	
}

function submitAnswer(e){
	if(e.keyCode == 13)
		$("#answerButton").click();
}

function submitInputNumbers(e){
	if(e.keyCode == 13){
		$("#inputValueButton").click();
	}
}

function submitFormFunction(){
	$("#inputValueButton").click();
	return false;
}

function resetScoreAndFields(){
	if(currentMathObject !=null){
		$("#life1").css({"display": "inline"});
		$("#life2").css({"display": "inline"});
		$("#life3").css({"display": "inline"});
	}
	$(".numberOfQuestionsAnswered").text("0");

	$("#correctAnswerSmiley").css({"display": "none"});
	$("#wrongAnswerSmiley").css({"display": "none"});
	
	$(".answerField").val("");
}

function createMathActivity(mathObject){
	console.log("math activity");
	currentMathObject = mathObject;
	
	currentMathObject.questionsAnswered = 0;
	currentMathObject.correctAnswers = 0;
	currentMathObject.life = 3;
	
	resetScoreAndFields();
	
	initializeMathDialog();
	initializeNewMathActivity();
}

function initializeMathDialog(){
	$(".chooseActivityDialog").dialog("close");
	
	var Wwidth = $(window).width();
	var Wheight = $(window).height();
	
	$(".mathActivity").dialog({
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

function beforeParametersAreSetView(){
	$(".question1").css({"display": "block"});
	$("#lownumber").val("").css({"display": "block"});
	$("#highnumber").val("").css({"display": "block"});
	$("#inputValueButton").css({"display": "block"});
	
	$("#life1").css({"display": "none"});
	$("#life2").css({"display": "none"});
	$("#life3").css({"display": "none"});
	$(".question2").css({"display": "none"});
	$(".randomNumber1").css({"display": "none"});
	$(".randomNumber2").css({"display": "none"});
	$(".operator").css({"display": "none"});
	$(".equals").css({"display": "none"});
	$(".answer").css({"display": "none"});
	$(".score").css({"display" : "none"});
}

function afterParametersAreSetView(){
	$(".question1").css({"display": "none"});
	$("#lownumber").css({"display": "none"});
	$("#highnumber").css({"display": "none"});
	$("#inputValueButton").css({"display": "none"});
	
	$("#life1").css({"display": "inline"});
	$("#life2").css({"display": "inline"});
	$("#life3").css({"display": "inline"});
	$(".question2").css({"display": "inline"});
	$(".randomNumber1").css({"display": "inline"});
	$(".randomNumber2").css({"display": "inline"});
	$(".operator").css({"display": "inline"});
	$(".equals").css({"display": "inline"});
	$(".answer").css({"display": "inline"});
	$(".score").css({
		"display" : "block",
		"float" : "right",
		"margin-top" : "-5%",
	});
	$(".questionsAnsweredText").text("Spørsmål besvart: (");
	$(".totalNumberOfQuestions").text(") / 10");
}

function initializeNewMathActivity(){
	setRandomValues();
	createQuestion();
}

function checkAnswer(){
	var operator = $(".operator").text(); 
	var number1 = parseInt($(".randomNumber1").text());
	var number2 = parseInt($(".randomNumber2").text());
	
	var answer = calculateAnswer(number1, number2, operator);
	
	if($(".answerField").val() == ""){
		alert("Please type in a number");
	}
	else{
		if(!$.isNumeric($(".answerField").val()) && !$(".answerField").val()==""){
			alert("The answer must be a number");
		}
		
		if($(".answerField").val() == answer && !$(".answerField").val()==""){
			currentMathObject.correctAnswers++;
			$("#correctAnswerSmiley").css({"display": "inline"});
		}
		if($(".answerField").val()!=answer && $(".answerField").val()!=""){
			$("#wrongAnswerSmiley").css({"display": "inline"});
			if(currentMathObject.life==1){
				$("#life3").hide("clip");
				currentMathObject.life--;
				
				setTimeout(function(){
					alert("Du klarte ikke svare riktig på nok regnestykker. Prøv igjen!");
					$(".numberOfQuestionsAnswered").text(currentMathObject.questionsAnswered+1);
					alert("Du svarte riktig på " + currentMathObject.correctAnswers + " sporsmål av totalt 10 sporsmål");
					$(".mathActivity").dialog("close");
				}, 1000);
				
			}
			else if(currentMathObject.life==2){
				$("#life2").hide("clip");
				currentMathObject.life--;
			}
			else if(currentMathObject.life==3){
				$("#life1").hide("clip");
				currentMathObject.life--;
			}
		}
		
		setTimeout(function(){
			if(currentMathObject.questionsAnswered == 9){
				$(".numberOfQuestionsAnswered").text(currentMathObject.questionsAnswered+1);
				alert("Du svarte riktig på " + currentMathObject.correctAnswers + " sporsmål av totalt 10 sporsmål");
				$(".mathActivity").dialog("close");
			}
			if(currentMathObject.questionsAnswered!=9 && $(".answerField").val()!=""){
				currentMathObject.questionsAnswered++;
				getAnotherQuestion();
			}
		}, 1000);
	}
}

function getAnotherQuestion(){
	$("#correctAnswerSmiley").css({"display": "none"});
	$("#wrongAnswerSmiley").css({"display": "none"});
	
	$(".answerField").val("");
	
	setRandomValues();
	createQuestion();
}

function setRandomValues(){
	
	var numLow = currentMathObject.lowestNumber;
	var numHigh = currentMathObject.highestNumber;
	
	var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;
	
    currentMathObject.randomNumber1 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
    currentMathObject.randomNumber2 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
    
	console.log(currentMathObject);
	
	if(currentMathObject.randomNumber1>currentMathObject.randomNumber2){
		$(".randomNumber1").text(currentMathObject.randomNumber1);
	}
	else{
		$(".randomNumber1").text(currentMathObject.randomNumber2);
	}
	if(currentMathObject.randomNumber2>currentMathObject.randomNumber1){
		$(".randomNumber2").text(currentMathObject.randomNumber1);
	}
	else{
		$(".randomNumber2").text(currentMathObject.randomNumber2);
	}
}


function createQuestion(){
	// $("#answerField").focus();
	$(".numberOfQuestionsAnswered").text(currentMathObject.questionsAnswered);
	
	
	var numberOfOperators = 1;
	var operator = chooseRandomOperator(numberOfOperators);
	
	if(operator=='/'){
		if(currentMathObject.randomNumber1 != 0 || currentMathObject.randomNumber2 != 0){
			if(currentMathObject.randomNumber2 > currentMathObject.randomNumber1){
				var temp = currentMathObject.randomNumber1;
				currentMathObject.randomNumber1 = currentMathObject.randomNumber2;
				currentMathObject.randomNumber2 = temp;
			}
			
			if(currentMathObject.randomNumber1 % currentMathObject.randomNumber2 != 0){
				while(currentMathObject.randomNumber1 % currentMathObject.randomNumber2 != 0 || (currentMathObject.randomNumber1 == 0 || currentMathObject.randomNumber2 == 0)){
					var numLow = currentMathObject.lowestNumber;
					var numHigh = currentMathObject.highestNumber;
					
					var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;
					currentMathObject.randomNumber1 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
					currentMathObject.randomNumber2 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
				}
				$(".randomNumber1").text(currentMathObject.randomNumber1);
				$(".randomNumber2").text(currentMathObject.randomNumber2);
			}
		}
	}
	$(".operator").text(operator);
	$(".equals").text("=");
}

function calculateAnswer(param1, param2, operator){
	if(operator == "+"){
		return param1 + param2;
	}
	if(operator == "-"){
		return param1 - param2;
	}
	if(operator == "*"){
		return param1 * param2;
	}
	if(operator == "/"){
		return param1 / param2;
	}
}

function chooseRandomOperator(possibleNumbersOfOperators){
	
	var chosenOperator = '';
	var choosableOperators = '+-*/';
	
	if(!possibleNumbersOfOperators){
		possibleNumbersOfOperators = 1;
	}
	
	for(var i=0; i<possibleNumbersOfOperators; i++){
		chosenOperator += choosableOperators.charAt(Math.floor(Math.random() * choosableOperators.length));
	}
	console.log("chosen operator is : " + chosenOperator);
	return chosenOperator;
}
