jQuery(document).ready(function(){
	
	$("#storylineButton").hide();
	$(".elements").hide();
	$(".draggable").tooltip({disabled: true});
	
	$(".elements").draggable({
		revert:"invalid",
		helper:"clone",
		cursor:"move",
		containment:"document",
		connectWith: "#mainFrame",
	});
	
	$("#mainFrame").droppable({
		accept: ".elements",
		drop: function(event, ui){
			$("<div></div>").html(ui.draggable.clone()).css({
				"position": "absolute",
				"top": ui.offset.top,
				"left": ui.offset.left
			}).appendTo(".draggable").draggable({
				containment:"parent"
			}).removeClass("ui-draggable").toggleClass("element");
		}
	});
	
	$(".draggable").on("contextmenu rightclick",".element",function(e){
		e.preventDefault();
		var target = e.target;
		var name = e.target.name;
		var parent = target.parentNode.parentNode;
		// console.log(target);
		// console.log(parent);
		// console.log(this);
		
		if(currentDialog == null){
			var dia = new Dialog(target);
			currentDialog = dia;
			objectList.push(dia);
		}
		else if(currentDialog.div != target){
			var index = inList(objectList,target);
			if(index>=0){
				currentDialog = objectList[index];
			}
			else{
				var dia = new Dialog(target);
				currentDialog = dia;
				objectList.push(dia);
				console.log("new object");
			}
		}
		console.log(currentDialog);
		console.log(objectList);
		
		var previousVersionDialog = $.extend(true,{},currentDialog); // copy
		
		resetCheckBoxes(currentDialog);
		
		var index = inList(objectList,target);
		
		// a new dialog should me made for each element, and should remember check boxes checked 
		$(".dialog").dialog({
			title: name,
			resizable: false,
			appendTo: ".draggable",
			show: {
				effect: "blind",
				duration: 500
			},
			modal: true,
			buttons: {
				"Confirm": function(){
					if(currentDialog.sceneChecked==true){
						$(this).dialog("close");
						
						var option = {
								to: "#storylineButton",
								className: "ui-effects-transfer"
						};
						$(target).effect("transfer", option, 500);

						saveContentFromMainFrame();
						
					};
					
					
					
					if(currentDialog.activityChecked==true){
						//make a new activity
//						$(target).on("click", function(){
//							if(name=="Cow"){
//								createCowActivity();
//							}
//							if(name=="Chicken"){
//								createChickenActivity();
//							}
//							
//						});
						
						$(".chooseActivityDialog").dialog({
							position: {
								my: "center top",
								at: "center top",
								of: "#mainFrame"
							},
							title: "choose activity type",
							buttons:{
								"Math Activity": function(){
									createMathActivity();
								},
								"Language Activity": function(){
									createLanguageActivity();
								},
								"Quiz Activity": function(){
									
								},
						
							},
							
						});
						
					};
					
					
					
					if(currentDialog.dialogChecked==true){
						//make a new dialog
						$(".userInputDialog").dialog({
							title: "type in dialog",
							buttons:{
								"Confirm": function(){
									if(!$("#dialogText").val()){
										alert("please type in a dialog");
									}
									else{
										if(!currentDialog.dialogClickActionMade){
											$(target).on("click", dialogFunction);
											currentDialog.dialogClickActionMade = true;
										}
										currentDialog.dialogData = $('#dialogText').val();
										$(this).dialog("close");
									}
								},
								Cancel: function(){
									$(this).dialog("close");
									objectList[index] = previousVersionDialog;
									currentDialog = previousVersionDialog;
								}
							}
						});
					};
					if(!currentDialog.dialogChecked){
						$(target).off("click", dialogFunction);
						currentDialog.dialogClickActionMade = false;
					}
					
					
					
					if(currentDialog.pickUpChecked){
						//make an element pickable
						
					};
					
					
					if(currentDialog.animationChecked){
						//append animation on target
						if(!currentDialog.animationClickActionMade){
							$(target).on("click", animationFunction);
							currentDialog.animationClickActionMade = true;
						}
					}
					if(!currentDialog.animationChecked){
						$(target).off("click", animationFunction);
						currentDialog.animationClickActionMade = false;
					}
					
					
					
					if(currentDialog.soundChecked){
						//append sound on target
					}
					
					
					
					$(this).dialog("close");
				},
				Cancel: function(){
					$(this).dialog("close");
					objectList[index] = previousVersionDialog;
					currentDialog = previousVersionDialog;
				},
				"Delete": function(){
					$('input[type=checkbox]').attr('checked', false);
					$("#effectTypes").attr("disabled", true);
					$("#button").attr("disabled", true);
					objectList.splice(index,1); //removes from the list
					$(parent).remove();
					$(this).dialog("close");
				}
			}
		});
	});
	
	$( "#button" ).click(function() {
		runAnimationEffect(currentDialog);
		return false;
	});
});

// function for running animation
function runAnimationEffect(e) {
	var selectedEffect = $("#effectTypes").prop("selectedIndex",e.animationIndex).val(); 
	$(e.div).effect( selectedEffect, 500, animationCallback(e.div));
};
function animationCallback(e) {
	setTimeout(function() {
		$(e).fadeIn();
	}, 1000 );
};

function dialogFunction(e){
	console.log(objectList[inList(objectList,e.target)].dialogData);
	// $(e.target).tipsy({
		// gravity: 's',
		// html: true,
		// title: function(){
				// return convertToHtml(objectList[inList(objectList,e.target)].dialogData)
			// }
	// });
	$("#writtenText").val(objectList[inList(objectList,e.target)].dialogData);
	$(".writtenDialog").dialog({
		modal: true,
		buttons: {
			Ok: function(){
					$(this).dialog("close");
			}
		}
	}).siblings(".ui-dialog-titlebar").hide();
	// $("#writtenDialog");
}

function convertToHtml(e){
	var temp = e.split('\n');
	console.log(temp);
	var output = "";
	
	for (var i = 0; i<temp.length; i++){
		output += temp[i]+"<br>";
	}
	console.log(output);
	return output;
}

function animationFunction(e){
	runAnimationEffect(objectList[inList(objectList,e.target)]);
}

var currentDialog = null;
var objectList = [];

function Dialog(object){
	this.sceneChecked = false;
	this.activityChecked = false;
	this.dialogChecked = false;
	this.pickUpChecked = false;
	this.animationChecked = false;
	this.animationIndex = 0;
	this.soundChecked = false;
	
	this.dialogData = "";
	this.div = object;
	
	this.animationClickActionMade = false;
	this.dialogClickActionMade = false;
}

function inList(arr,obj){
	for(var i = 0; i <arr.length; i++){
		if(arr[i].div == obj) return i;
	}
	return -1;
}

function resetCheckBoxes(dialogObject){
	if(dialogObject.activityChecked){ $("#activity").prop("checked",true);}
	else{ $("#activity").prop("checked",false);}
	
	if(dialogObject.sceneChecked){ $("#scene").prop("checked",true);}
	else{ $("#scene").prop("checked",false);}
	
	if(dialogObject.pickUpChecked){ $("#pickUp").prop("checked",true);}
	else{ $("#pickUp").prop("checked",false);}
	
	if(dialogObject.dialogChecked){ $("#dialog").prop("checked",true);}
	else{ $("#dialog").prop("checked",false);}
	
	if(dialogObject.animationChecked){ $("#animation").prop("checked",true);}
	else{ $("#animation").prop("checked",false);}
	
	if(dialogObject.soundChecked){ $("#sound").prop("checked",true);}
	else{ $("#sound").prop("checked",false);}
	
	OnChangeCheckBoxScene();
	OnChangeCheckBoxActivity();
	OnChangeCheckBoxDialog();
	OnChangeCheckBoxPickUp();
	OnChangeCheckBoxAnimation();
	OnChangeCheckBoxSound();
	
	$("#dialogText").val(dialogObject.dialogData);
	$("#effectTypes").prop("selectedIndex",dialogObject.animationIndex);
}

function OnChangeCheckBoxScene(){
	if(document.getElementById("scene").checked){
		$("#activity").attr("disabled", true);
		$("#pickUp").attr("disabled", true);
		currentDialog.sceneChecked = true;
	}
	else{
		currentDialog.sceneChecked = false;
		if(!currentDialog.pickUpChecked)
			$("#activity").attr("disabled", false);
		if(!currentDialog.activityChecked)
			$("#pickUp").attr("disabled", false);
	}
}

function OnChangeCheckBoxActivity(){
	if(document.getElementById("activity").checked){
		$("#scene").attr("disabled", true);
		$("#pickUp").attr("disabled", true);
		currentDialog.activityChecked = true;
	}
	else{
		currentDialog.activityChecked = false;
		
		if(!currentDialog.pickUpChecked)
			$("#scene").attr("disabled", false);
		if(!currentDialog.sceneChecked)
			$("#pickUp").attr("disabled", false);
	}
}

function OnChangeCheckBoxDialog(){
	if(document.getElementById("dialog").checked){
		$("#pickUp").attr("disabled", true);
		currentDialog.dialogChecked = true;
	}
	else{
		currentDialog.dialogChecked = false;
		if(!currentDialog.sceneChecked && !currentDialog.activityChecked)
			$("#pickUp").attr("disabled", false);
	}
}

function OnChangeCheckBoxPickUp(){
	if(document.getElementById("pickUp").checked){
		$("#scene").attr("disabled", true);
		$("#activity").attr("disabled", true);
		$("#dialog").attr("disabled", true);
		currentDialog.pickUpChecked = true;
	}
	else{
		currentDialog.pickUpChecked = false;
		
		if(!currentDialog.activityChecked)
			$("#scene").attr("disabled", false);
		if(!currentDialog.sceneChecked)
			$("#activity").attr("disabled", false);
		
		$("#dialog").attr("disabled", false);
	}
}

function OnChangeCheckBoxAnimation(){
	if(document.getElementById("animation").checked){
		currentDialog.animationChecked = true;
		$("#effectTypes").attr("disabled", false);
		$("#button").attr("disabled", false);
	}
	else{
		currentDialog.animationChecked = false;
		$("#effectTypes").attr("disabled", true);
		$("#button").attr("disabled", true);
	}
}

function OnChangeAnimationList(){
	currentDialog.animationIndex = document.getElementById("effectTypes").selectedIndex;
}

function OnChangeCheckBoxSound(){
	if(document.getElementById("sound").checked){
		currentDialog.soundChecked = true;
	}
	else{
		currentDialog.soundChecked = false;
	}
}

$(function createNewWorldView(){
	$("#newWorldDialog").dialog({
		autoOpen: false,
		width: 900,
		modal: true,
		show: {
			effect: "blind",
			duration: 500
		}
	});
	
	$("#newWorldButton").click(function(){
		$("#newWorldDialog").dialog("open");
	});
});

$(function createStorylineView(){
	
	$("#storylineDialog").dialog({
		autoOpen: false,
		width: 900,
		height: 500,
		show: {
	        effect: "clip",
	        duration: 300
		},
		hide: {
	      effect: "clip",
	      duration: 300
    	}
	});
	
	$("#storylineButton").on("click", function(){
		$("#storylineDialog").dialog("open");
	});
});


function saveContentFromMainFrame(){
	$(".textarea").hide();
	var cloneOfMainFrame = $("#mainFrame").clone();
	cloneOfMainFrame.css({"position": "relative"}).addClass("inStoryline").appendTo("#storylineDialog");
	$("#mainFrame").empty();
	
	
	//trying to make an element inside storyline clickable, when clicked it should be placed on mainframe
	/*
	 * problem:
	 * 		elements are not interactive anymore
	 * 		elements not placable in mainframe, they are placed in storyline
	 */
	$(".inStoryline").on("click", function(e){
		var target = e.target;
		$(target).appendTo("#mainFrame");
		target.removeClass("inStoryline");
		$("#storylineDialog").dialog("close");
	});
}

var questionsAnswered = 0;
var correctAnswers = 0;

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
	
	var randomNumber1 = 0;
	var randomNumber2 = 0;
	
	$("#randomNumberButton").click(function createRandomNumber(){
		var numLow = $("#lownumber").val();
        var numHigh = $("#highnumber").val();
        
        var adjustedHigh = (parseFloat(numHigh) - parseFloat(numLow)) + 1;
        randomNumber1 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
        randomNumber2 = Math.floor(Math.random()*adjustedHigh) + parseFloat(numLow);
        
        console.log("randomNumber1 : " + randomNumber1);
    	console.log("randomNumber2 : " + randomNumber2);
    	
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
	
	$(".operator").text(operator);
	
	$(".equals").text("=");
	
}

var life = 3;
function checkAnswer(){
	if($(".answerfield").val() == ""){
		alert("Please type in a number");
	}
	if(!$.isNumeric($(".answerfield").val())){
		alert("The answer must be a number");
	};
	
	var operator = $(".operator").text(); 
	var number1 = parseInt($(".randomNumber1").text());
	var number2 = parseInt($(".randomNumber2").text());
	
	var answer = calculateAnswer(number1, number2, operator);
	console.log("answer is: " + answer);
	
	if($(".answerfield").val() == answer){
		correctAnswers++;
		$("#correctAnswerSmiley").css({"display": "inline"});
		
	}
	
	
	else{
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
			}, 2000);
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
		else{
			questionsAnswered++;
			getAnotherQuestion();
			console.log("number of questions: " + questionsAnswered);
		}
	}, 800);
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
    
    console.log("randomNumber1 : " + randomNumber1);
	console.log("randomNumber2 : " + randomNumber2);
    
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
	return chosenOperator;
}

function createLanguageActivity(){
	$(".chooseActivityDialog").dialog("close");

	console.log("language activity");
}


$(document).ready(function(){
	$(".img-grid").on("dblclick", "img", function(e){
		var imgUrl = e.target.getAttribute('src');
		$("#mainFrame").css({
			"background-image": "url('"+ imgUrl + "')",
			"background-repeat": "no-repeat",
			"background-position": "center",
			"background-size": "cover"
		});
		$("#newWorldButton").hide();
		$(".elements").show();
		$(".draggable").tooltip({disabled: false});
		$("#storylineButton").show();
		$("#newWorldDialog").dialog("close");
	});
});

