function MathActivity(){
	this.questionsAnswered = 0;
	this.correctAnswers = 0;
	this.randomNumber1 = 0;
	this.randomNumber2 = 0;
	this.life = 3;
	
	if(currentMathObject !=null){
		$("#life1").css({"display": "inline"});
		$("#life2").css({"display": "inline"});
		$("#life3").css({"display": "inline"});	
		$("#numberOfQuestionsAnswered").val("0");
	}
}

var currentMathObject = null;

function createMathActivity(mathObject){
	$(".chooseActivityDialog").dialog("close");
	console.log("math activity");
	
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
	
	$("#randomNumberButton").click(function createRandomNumber(){
		
		$(".question1").css({"display": "none"});
		$("#lownumber").css({"display": "none"});
		$("#highnumber").css({"display": "none"});
		$("#randomNumberButton").css({"display": "none"});
		
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
			"display" : "inline",
			"float" : "right",
			"margin-top" : "-3%",
		});
		initializeNewMathActivity(mathObject);
	});	
}

function initializeNewMathActivity(mathObject){
	currentMathObject = mathObject;
	setRandomValues();
	createQuestion();
}

function checkAnswer(){
	var operator = $(".operator").text(); 
	var number1 = parseInt($(".randomNumber1").text());
	var number2 = parseInt($(".randomNumber2").text());
	
	var answer = calculateAnswer(number1, number2, operator);
	
	if($(".answerfield").val() == ""){
		alert("Please type in a number");
	}
	else{
		if(!$.isNumeric($(".answerfield").val()) && !$(".answerfield").val()==""){
			alert("The answer must be a number");
		}
		
		if($(".answerfield").val() == answer && !$(".answerfield").val()==""){
			currentMathObject.correctAnswers++;
			$("#correctAnswerSmiley").css({"display": "inline"});
		}
		if($(".answerfield").val()!=answer && $(".answerfield").val()!=""){
			$("#wrongAnswerSmiley").css({"display": "inline"});
			if(currentMathObject.life==1){
				$("#life3").hide("clip");
				currentMathObject.life--;
				
				setTimeout(function(){
					alert("Game over! Restart the activity");
					$(".mathActivity").dialog("close");
				}, 1000);
				
				// setTimeout(function(){
					// var newObject = new MathActivity();
					// console.log("\n");
					// console.log(newObject);
					// console.log("\n");
					// initializeNewMathActivity(newObject);
					// done = true;
				// }, 1000);
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
		
		console.log("you should not be here");
		
		setTimeout(function(){
			if(currentMathObject.questionsAnswered == 9){
				$("#numberOfQuestionsAnswered").val(currentMathObject.questionsAnswered+1);
				alert("Du svarte riktig paa " + currentMathObject.correctAnswers + " sporsmaal av totalt 10 sporsmaal");
				$(".mathActivity").dialog("close");
			}
			if(currentMathObject.questionsAnswered!=9 && $(".answerfield").val()!=""){
				currentMathObject.questionsAnswered++;
				getAnotherQuestion();
			}
		}, 1000);
	}
}

function getAnotherQuestion(){
	$("#correctAnswerSmiley").css({"display": "none"});
	$("#wrongAnswerSmiley").css({"display": "none"});
	
	$(".answerfield").val("");
	
	setRandomValues();
	createQuestion();
}

function setRandomValues(){
	var numLow = $("#lownumber").val();
    var numHigh = $("#highnumber").val();
	
	if(numLow>numHigh){
		var temp = numLow;
		numLow = numHigh;
		numHigh = temp;
	}
	
	var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;
	
    currentMathObject.randomNumber1 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
    currentMathObject.randomNumber2 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
    
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
	$("#numberOfQuestionsAnswered").val(currentMathObject.questionsAnswered);
	
	console.log(currentMathObject);
	
	var numberOfOperators = 1;
	var operator = chooseRandomOperator(numberOfOperators);
	
	if(operator=='/'){
		if(currentMathObject.randomNumber1 > currentMathObject.randomNumber2 || currentMathObject.randomNumber1==currentMathObject.randomNumber2 || currentMathObject.randomNumber2 > currentMathObject.randomNumber1 || currentMathObject.randomNumber1 != 0 || currentMathObject.randomNumber2 != 0){
			if(currentMathObject.randomNumber2 > currentMathObject.randomNumber1){
				var temp = currentMathObject.randomNumber1;
				currentMathObject.randomNumber1 = currentMathObject.randomNumber2;
				currentMathObject.randomNumber2 = temp;
			}
			
			if(currentMathObject.randomNumber1 % currentMathObject.randomNumber2 != 0){
				while(currentMathObject.randomNumber1 % currentMathObject.randomNumber2 != 0 || (currentMathObject.randomNumber1 == 0 || currentMathObject.randomNumber2 == 0)){
					var numLow = $("#lownumber").val();
					var numHigh = $("#highnumber").val();
					
					var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;
					currentMathObject.randomNumber1 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
					currentMathObject.randomNumber2 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
				}
				$(".randomNumber1").text(currentMathObject.randomNumber1);
				$(".randomNumber2").text(currentMathObject.randomNumber2);
			}
		}
		$(".operator").text(operator);
	}
	else{
		$(".operator").text(operator);
	}
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
