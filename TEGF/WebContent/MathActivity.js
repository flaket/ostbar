var questionsAnswered = 0;
var correctAnswers = 0;
var randomNumber1 = 0;
var randomNumber2 = 0;

function createMathActivity(){
	$("#numberOfQuestionsAnswered").val(questionsAnswered);
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
		var numLow = $("#lownumber").val();
        var numHigh = $("#highnumber").val();
        
        var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;
        randomNumber1 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
        randomNumber2 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
        
    	if(randomNumber1>randomNumber2){
    		$(".randomNumber1").text(randomNumber1);
    	}
    	else{
    		$(".randomNumber1").text(randomNumber2);
    	}
    	if(randomNumber2>randomNumber1){
    		$(".randomNumber2").text(randomNumber1);
    	}
    	else{
    		$(".randomNumber2").text(randomNumber2);
    	}
    	
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
    	
	});

	var numberOfOperators = 1;
	var operator = chooseRandomOperator(numberOfOperators);
	
	if(operator=='/'){
		if(randomNumber1 > randomNumber2 || randomNumber1==randomNumber2 || randomNumber2 > randomNumber1 || randomNumber1 != 0 || randomNumber2 != 0){
			if(randomNumber2 > randomNumber2){
				randomNumber1 = randomNumber2;
				randomNumber2 = randomNumber1;
			}
			
			if(randomNumber1 % randomNumber2 == 0){
				$(".operator").text(operator);
			}
			else{
				while(randomNumber1 % randomNumber2 != 0 || (randomNumber1 == 0 || randomNumber2 == 0)){
					var numLow = $("#lownumber").val();
					var numHigh = $("#highnumber").val();
					
					var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;
					randomNumber1 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
					randomNumber2 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
				}
				$(".randomNumber1").text(randomNumber1);
				$(".randomNumber2").text(randomNumber2);
			}
		}
		$(".operator").text(operator);
	}
	else{
		$(".operator").text(operator);
	}
	$(".equals").text("=");
}

var life = 3;
function checkAnswer(){
	var operator = $(".operator").text(); 
	var number1 = parseInt($(".randomNumber1").text());
	var number2 = parseInt($(".randomNumber2").text());
	
	var answer = calculateAnswer(number1, number2, operator);
	
	if($(".answerfield").val() == ""){
		alert("Please type in a number");
	}
	
	if(!$.isNumeric($(".answerfield").val()) && !$(".answerfield").val()==""){
		alert("The answer must be a number");
	}
	
	if($(".answerfield").val() == answer && !$(".answerfield").val()==""){
		correctAnswers++;
		$("#correctAnswerSmiley").css({"display": "inline"});
	}
	
	if($(".answerfield").val()!=answer && $(".answerfield").val()!=""){
		$("#wrongAnswerSmiley").css({"display": "inline"});
		if(life==1){
			$("#life3").hide("clip");
			life--;
			
			setTimeout(function(){
				alert("Game over! Restart the activity");
			}, 1000);
			
			setTimeout(function(){
				
				questionsAnswered = 0;
				correctAnswers = 0;
				life=3;
				$("#life1").css({"display": "inline"});
				$("#life2").css({"display": "inline"});
				$("#life3").css({"display": "inline"});
				createMathActivity();
			}, 1000);
		}
		else if(life==2){
			$("#life2").hide("clip");
			life--;
		}
		else if(life==3){
			$("#life1").hide("clip");
			life--;
		}
		
	}
	
	setTimeout(function(){
		
		if(questionsAnswered == 9){
			$("#numberOfQuestionsAnswered").val(questionsAnswered+1);
			alert("Du svarte riktig paa " + correctAnswers + " sporsmaal av totalt 10 sporsmaal");
			$(".mathActivity").dialog("close");
		}
		if(questionsAnswered!=9 && $(".answerfield").val()!=""){
			questionsAnswered++;
			getAnotherQuestion();
		}
	}, 1000);
}

function getAnotherQuestion(){
	$("#correctAnswerSmiley").css({"display": "none"});
	$("#wrongAnswerSmiley").css({"display": "none"});
	
	$(".answerfield").val("");
	var numLow = $("#lownumber").val();
    var numHigh = $("#highnumber").val();
    
    var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;
    randomNumber1 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
    randomNumber2 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
    
	if(randomNumber1>randomNumber2){
		$(".randomNumber1").text(randomNumber1);
	}
	else{
		$(".randomNumber1").text(randomNumber2);
	}
	if(randomNumber2>randomNumber1){
		$(".randomNumber2").text(randomNumber1);
	}
	else{
		$(".randomNumber2").text(randomNumber2);
	}
	createMathActivity();
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
