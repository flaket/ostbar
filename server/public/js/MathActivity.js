var currentMathObject = null;

$(document).ready(function(){

	$("#all").change(function(){
		console.log("checking all the boxes!");
		$(".operatorCheckboxes").prop('checked', $("#all").is(':checked'));
	});

	$(".operatorCheckboxes").change(function(){
		var allChecked = $(".operatorCheckboxes:checked").length == $(".operatorCheckboxes").length;
		if(allChecked)
			console.log("all checked");
		$(".allOperatorCheckboxes").prop('checked', allChecked);
	});
});

function MathActivity(){
	this.questionsAnswered = 0;
	this.correctAnswers = 0;
	
	this.lowestNumber = "";
	this.highestNumber = "";
	
	this.operators = ["+","-","*","/"];
	this.activeOperators = [-1,-1,-1,-1];
	this.operandsCount = 2;

	this.randomNumber1 = 0;
	this.randomNumber2 = 0;

	this.question = [];
	
	this.life = 3;
	
	// resetScore();
}

function createNewMathActivity(mathObject){
	
	currentMathObject = mathObject;
	
	beforeParametersAreSetView();
	initializeMathDialog();

	$("#inputValueButton").click(function createRandomNumber(){
		if($("#lownumber").val()=="" || $("#highnumber").val() == ""){
			alert("Du må skrive inn i alle feltene");
		}
		else if($(".operatorCheckboxes:checked").length == 0)
			alert("Du må huke av på minst en mulig operator");
		else if($("#operands").val() <= 1)
			alert("Du må ha med minst 2 operander");
		else if($("#operands").val() >= 3  && $("#divide").prop("checked")){
			alert("Med deling kan du ikke ha mer enn 2 operander");
			console.log($("#operands").val());
		}
		else{
			// $(".mathActivity").dialog("close");
			
			var numLow = $("#lownumber").val();
			var numHigh = $("#highnumber").val();
			
			if(numLow>numHigh){
				var temp = numLow;
				numLow = numHigh;
				numHigh = temp;
			}
			
			if($(".allOperatorCheckboxes:checked").length == $(".allOperatorCheckboxes").length){
				currentMathObject.activeOperators[0] = 0;
				currentMathObject.activeOperators[1] = 1;
				currentMathObject.activeOperators[2] = 2;
				currentMathObject.activeOperators[3] = 3;
			}	
			else{
				if($("#plus").prop('checked'))
					currentMathObject.activeOperators[0] = 0;
				else
					currentMathObject.activeOperators[0] = -1;
				if($("#minus").prop('checked'))
					currentMathObject.activeOperators[1] = 1;
				else
					currentMathObject.activeOperators[1] = -1;
				if($("#multiply").prop('checked'))
					currentMathObject.activeOperators[2] = 2;
				else
					currentMathObject.activeOperators[2] = -1;
				if($("#divide").prop('checked'))
					currentMathObject.activeOperators[3] = 3;
				else
					currentMathObject.activeOperators[3] = -1;
			}
			
			currentMathObject.operandsCount = $("#operands").val();

			currentMathObject.lowestNumber = numLow;
			currentMathObject.highestNumber = numHigh;
			
			afterParametersAreSetView();
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
	console.log(currentMathObject);
	$(".question1").css({"display": "block"});
	$("#lownumber").val(currentMathObject.lowestNumber).css({"display": "block"});
	$("#highnumber").val(currentMathObject.highestNumber).css({"display": "block"});
	$("#inputValueButton").css({"display": "block"});	
	$(".operatorsAndOperands").css({"display": "block"})

	var arr = currentMathObject.activeOperators;
	
	$("#plus").prop('checked',arr[0]==0).change();
	$("#minus").prop('checked',arr[1]==1).change();
	$("#multiply").prop('checked',arr[2]==2).change();
	$("#divide").prop('checked',arr[3]==3).change();
	
	if($(".operatorCheckboxes:checked").length == 0)
		$("#all").prop('checked', true).change();
	
	$("#operands").val(currentMathObject.operandsCount);

	$(".question").css({"display": "none"});
	
	$(".equals").css({"display": "none"});
	$(".answer").css({"display": "none"});

	$(".lives").css({"display": "none"});
	$(".score").css({"display" : "none"});
}

function afterParametersAreSetView(){
	$(".question1").css({"display": "none"});
	$("#lownumber").css({"display": "none"});
	$("#highnumber").css({"display": "none"});
	$("#inputValueButton").css({"display": "none"});
	$(".operatorsAndOperands").css({"display": "none"})
	
	$(".question").css({"display": "block"});
	$("#questionHeader").text("Hva er:");
	
	$(".equals").css({"display": "inline"});
	$(".answer").css({"display": "inline"});

	$(".lives").css({"display": "inline", "float": "left" ,"width": "50%" });
	$(".score").css({
		"display" : "inline",
		"float": "right",
		"width": "50%",
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
	
	var answer1 = combineAnswer(currentMathObject.question);

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


function pushRandomValue(){
	var numLow = currentMathObject.lowestNumber;
	var numHigh = currentMathObject.highestNumber;
	
	var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;
	var randNumber = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);

	currentMathObject.question.push(randNumber);
}

function createQuestion(){
	// $("#answerField").focus();
	$(".numberOfQuestionsAnswered").text(currentMathObject.questionsAnswered);
	
	
	var numberOfOperators = currentMathObject.operandsCount-1;
	var operators = chooseRandomOperators(numberOfOperators);
	
	currentMathObject.question = [];

	for (var i = 0; i < operators.length; i++) {
		pushRandomValue();
		currentMathObject.question.push(operators[i]);
	};
	pushRandomValue();

	console.log(currentMathObject.question.toString());

	for (var i = 0; i < operators.length; i++) {
		var arr = currentMathObject.question;
		if(operators[i]=="/"){
			if(arr[i*2] < arr[i*2+2]){
				console.log("swap")
				var temp1 = arr[i*2];
				var temp2 = arr[i*2+2];
				arr[i*2] = temp2;
				arr[i*2+2] = temp1;
			}
		}
	};

	console.log(currentMathObject.question.toString());

	if(operators=='/'){
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
	$(".operator").text(operators);
	$(".equals").text("=");
}

function combineAnswer(list){
	var tempList = list.slice(0);
	while(tempList.length>=2){
		var num2 = parseFloat(tempList.pop());
		var op = tempList.pop();
		var num1 = parseFloat(tempList.pop());
		var answer = calculateAnswer(num1,num2,op);
		tempList.push(answer);
		console.log(answer);
	}
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

function chooseRandomOperators(possibleNumbersOfOperators){
	
	var chosenOperator = '';
	var choosableOperators = '';
	for (var i = 0; i < currentMathObject.activeOperators.length; i++) {
		if(currentMathObject.activeOperators[i]>-1)
			choosableOperators+=currentMathObject.operators[i];
	};
	
	if(!possibleNumbersOfOperators){
		possibleNumbersOfOperators = 1;
	}
	
	for(var i=0; i<possibleNumbersOfOperators; i++){
		chosenOperator += choosableOperators.charAt(Math.floor(Math.random() * choosableOperators.length));
	}
	console.log("chosen operators are : " + chosenOperator);
	return chosenOperator;
}
