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

function MathActivity(response){
	this.questionsAnswered = 0;
	this.correctAnswers = 0;
	
	this.question = [];
	this.life = 3;

	this.lowestNumber = "";
	this.highestNumber = "";
	
	this.operators = ["+","-","*","/"];
	this.activeOperators = [-1,-1,-1,-1];
		
	if(response==null){
		this.operandsCount = 2;

		this.activity_id = -1;
	}
	else{
		var sub = response.subclass;
		this.lowestNumber = sub.numbersRangeFrom;
		this.highestNumber = sub.numbersRangeTo;
	
		if(sub.operators!=null){
			for (var i = 0; i < sub.operators.length; i++) {
				var inArray = jQuery.inArray(sub.operators[i].operator,this.operators);
				var operatorValue = sub.operators[i].mathOperatorId;
				if(inArray>-1)
					this.activeOperators[inArray] = operatorValue;
			};
		}

		this.operandsCount = sub.operandsCount;
		
		this.activity_id = response.activityId;
	}	
}

function saveFields(){
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

			
		var numLow = $("#lownumber").val();
		var numHigh = $("#highnumber").val();
		
		if(numLow>numHigh){
			var temp = numLow;
			numLow = numHigh;
			numHigh = temp;
		}
		
		if($(".allOperatorCheckboxes:checked").length == $(".allOperatorCheckboxes").length){
			currentMathObject.activeOperators[0] = 1;
			currentMathObject.activeOperators[1] = 2;
			currentMathObject.activeOperators[2] = 3;
			currentMathObject.activeOperators[3] = 4;
		}	
		else{
			if($("#plus").prop('checked'))
				currentMathObject.activeOperators[0] = 1;
			else
				currentMathObject.activeOperators[0] = -1;
			if($("#minus").prop('checked'))
				currentMathObject.activeOperators[1] = 2;
			else
				currentMathObject.activeOperators[1] = -1;
			if($("#multiply").prop('checked'))
				currentMathObject.activeOperators[2] = 3;
			else
				currentMathObject.activeOperators[2] = -1;
			if($("#divide").prop('checked'))
				currentMathObject.activeOperators[3] = 4;
			else
				currentMathObject.activeOperators[3] = -1;
		}
		
		currentMathObject.operandsCount = $("#operands").val();

		currentMathObject.lowestNumber = numLow;
		currentMathObject.highestNumber = numHigh;
		
		afterParametersAreSetView();
		$(".mathActivity").dialog("close");
		// initializeNewMathActivity();
		saveActivityByElementId(currentDialog.activityIndex, currentDialog.activityObject, currentDialog.element_id);
	}
}

function createNewMathActivity(mathObject){
	
	currentMathObject = mathObject;
	
	beforeParametersAreSetView();
	initializeMathDialog();

	$("#inputValueButton").on("click",saveFields);
	// $("#inputValueButton").on(click,function createRandomNumber(){
		// if($("#lownumber").val()=="" || $("#highnumber").val() == ""){
		// 	alert("Du må skrive inn i alle feltene");
		// }
		// else if($(".operatorCheckboxes:checked").length == 0)
		// 	alert("Du må huke av på minst en mulig operator");
		// else if($("#operands").val() <= 1)
		// 	alert("Du må ha med minst 2 operander");
		// else if($("#operands").val() >= 3  && $("#divide").prop("checked")){
		// 	alert("Med deling kan du ikke ha mer enn 2 operander");
		// 	console.log($("#operands").val());
		// }
		// else{
		// 	// $(".mathActivity").dialog("close");
			
		// 	var numLow = $("#lownumber").val();
		// 	var numHigh = $("#highnumber").val();
			
		// 	if(numLow>numHigh){
		// 		var temp = numLow;
		// 		numLow = numHigh;
		// 		numHigh = temp;
		// 	}
			
		// 	if($(".allOperatorCheckboxes:checked").length == $(".allOperatorCheckboxes").length){
		// 		currentMathObject.activeOperators[0] = 1;
		// 		currentMathObject.activeOperators[1] = 2;
		// 		currentMathObject.activeOperators[2] = 3;
		// 		currentMathObject.activeOperators[3] = 4;
		// 	}	
		// 	else{
		// 		if($("#plus").prop('checked'))
		// 			currentMathObject.activeOperators[0] = 1;
		// 		else
		// 			currentMathObject.activeOperators[0] = -1;
		// 		if($("#minus").prop('checked'))
		// 			currentMathObject.activeOperators[1] = 2;
		// 		else
		// 			currentMathObject.activeOperators[1] = -1;
		// 		if($("#multiply").prop('checked'))
		// 			currentMathObject.activeOperators[2] = 3;
		// 		else
		// 			currentMathObject.activeOperators[2] = -1;
		// 		if($("#divide").prop('checked'))
		// 			currentMathObject.activeOperators[3] = 4;
		// 		else
		// 			currentMathObject.activeOperators[3] = -1;
		// 	}
			
		// 	currentMathObject.operandsCount = $("#operands").val();

		// 	currentMathObject.lowestNumber = numLow;
		// 	currentMathObject.highestNumber = numHigh;
			
		// 	afterParametersAreSetView();
		// 	$(".mathActivity").dialog("close");
		// 	// initializeNewMathActivity();
		// 	saveActivityByElementId(currentDialog.activityIndex, currentDialog.activityObject, currentDialog.element_id);
		// }
	// });
	
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
	
	$("#plus").prop('checked',arr[0]==1).change();
	$("#minus").prop('checked',arr[1]==2).change();
	$("#multiply").prop('checked',arr[2]==3).change();
	$("#divide").prop('checked',arr[3]==4).change();
	
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
	$("#questionHeader").text("Hva er svaret, (husk at * har presedens):");
	
	$(".equals").text("=").css({"display": "inline"});
	$(".answer").css({"display": "inline"});

	$(".lives").css({"display": "inline", "float": "left" ,"width": "50%" });
	$(".score").css({
		"display" : "inline",
		"float": "right",
		"width": "50%",
	});
	$(".questionsAnsweredText").text("Spørsmål besvart: (");
	$(".totalNumberOfQuestions").text(") / 10");

	$("#inputValueButton").off("click",saveFields);
}

function initializeNewMathActivity(){
	// setRandomValues();
	createQuestion();
}

function checkAnswer(){
	// var operator = $(".operator").text(); 
	// var number1 = parseInt($(".randomNumber1").text());
	// var number2 = parseInt($(".randomNumber2").text());
	
	var answer = combineAnswer(currentMathObject.question);

	// var answer = calculateAnswer(number1, number2, operator);
	
	console.log(answer);

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
	
	// setRandomValues();
	createQuestion();
}

// function setRandomValues(){
	
// 	var numLow = currentMathObject.lowestNumber;
// 	var numHigh = currentMathObject.highestNumber;
	
// 	var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;
	
//     currentMathObject.randomNumber1 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
//     currentMathObject.randomNumber2 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
    
// 	console.log(currentMathObject);
	
// 	if(currentMathObject.randomNumber1>currentMathObject.randomNumber2){
// 		$(".randomNumber1").text(currentMathObject.randomNumber1);
// 	}
// 	else{
// 		$(".randomNumber1").text(currentMathObject.randomNumber2);
// 	}
// 	if(currentMathObject.randomNumber2>currentMathObject.randomNumber1){
// 		$(".randomNumber2").text(currentMathObject.randomNumber1);
// 	}
// 	else{
// 		$(".randomNumber2").text(currentMathObject.randomNumber2);
// 	}
// }


function pushRandomValue(){
	var numLow = currentMathObject.lowestNumber;
	var numHigh = currentMathObject.highestNumber;
	
	var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;
	var randNumber = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);

	currentMathObject.question.push(randNumber);
}

function updateRandomValueAtPositions(arr,indexes){
	var numLow = currentMathObject.lowestNumber;
	var numHigh = currentMathObject.highestNumber;
	
	var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;
	var randNumber = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
	for (var i = 0; i < indexes.length; i++) {
		arr[indexes[i]] = randNumber;
	};
}

function createQuestionString(operators){
	for (var i = 0; i < operators.length; i++) {
		pushRandomValue();
		currentMathObject.question.push(operators[i]);
	};
	pushRandomValue();
}

function createQuestion(){
	// $("#answerField").focus();
	$(".numberOfQuestionsAnswered").text(currentMathObject.questionsAnswered);
	
	
	var numberOfOperators = currentMathObject.operandsCount-1;
	var operators = chooseRandomOperators(numberOfOperators);
	
	currentMathObject.question = [];

	createQuestionString(operators);	

	console.log(currentMathObject.question.toString());

	for (var i = 0; i < operators.length; i++) {
		var arr = currentMathObject.question;
		if(operators[i]=="/"){
			while(arr[i*2]==0){
				updateRandomValueAtPositions(arr,[i*2]);
			}
			while(arr[i*2+2]==0){
				updateRandomValueAtPositions(arr,[i*2+2]);	
			}
			console.log(currentMathObject.question.toString());

			if(arr[i*2] < arr[i*2+2]){
				console.log("swap")
				var temp1 = arr[i*2];
				var temp2 = arr[i*2+2];
				arr[i*2] = temp2;
				arr[i*2+2] = temp1;
			}

			if(arr[i*2] % arr[i*2+2] != 0){
				while(arr[i*2] % arr[i*2+2] != 0 || arr[i*2] == 0 || arr[i*2+2] == 0){
					console.log("changing values");
					updateRandomValueAtPositions(arr,[i*2,i*2+2]);
				}
			}
		}
	};

	console.log(currentMathObject.question.toString());
	$(".questionText").text(currentMathObject.question.join(" "));

	// if(operators=='/'){
	// 	if(currentMathObject.randomNumber1 != 0 || currentMathObject.randomNumber2 != 0){
	// 		if(currentMathObject.randomNumber2 > currentMathObject.randomNumber1){
	// 			var temp = currentMathObject.randomNumber1;
	// 			currentMathObject.randomNumber1 = currentMathObject.randomNumber2;
	// 			currentMathObject.randomNumber2 = temp;
	// 		}
			
	// 		if(currentMathObject.randomNumber1 % currentMathObject.randomNumber2 != 0){
	// 			while(currentMathObject.randomNumber1 % currentMathObject.randomNumber2 != 0 || (currentMathObject.randomNumber1 == 0 || currentMathObject.randomNumber2 == 0)){
	// 				var numLow = currentMathObject.lowestNumber;
	// 				var numHigh = currentMathObject.highestNumber;
					
	// 				var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;
	// 				currentMathObject.randomNumber1 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
	// 				currentMathObject.randomNumber2 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
	// 			}
	// 			$(".randomNumber1").text(currentMathObject.randomNumber1);
	// 			$(".randomNumber2").text(currentMathObject.randomNumber2);
	// 		}
	// 	}
	// }
	// $(".operator").text(operators);
}

function combineAnswer(list){
	var tempList = list.slice(0); //copy

	var index = 0;
	console.log(tempList.toString());
	while(index<tempList.length){
		if(tempList[index] == "*"){
			var num1 = tempList[index-1];
			var op = tempList[index];
			var num2 = tempList[index+1];
			var answer = calculateAnswer(num1,num2,op);
			tempList.splice(index-1,3,answer); //remove the 3 affected fields and insert the answer on that position.
			console.log(tempList.toString());
			index = index-2;
		}
		index++;
	}

	while(tempList.length>=2){
		var num1 = parseFloat(tempList.shift());
		var op = tempList.shift();
		var num2 = parseFloat(tempList.shift());
		var answer = calculateAnswer(num1,num2,op);
		tempList.unshift(answer);
		console.log(tempList.toString());
	}
	return tempList[0];
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

function getActiveOperators(mathObject){
	var arr = mathObject.activeOperators.slice(0);
	var index = 0;
	while(index < arr.length){
		if(arr[index]<=-1){
			arr.splice(index,1);
		}
		index++;
	}
	return arr;
}