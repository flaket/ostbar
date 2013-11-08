function addScene(target){
	if(currentDialog.sceneChecked==true){
		$(this).dialog("close");
		
		var option = {
				to: "#storylineButton",
				className: "ui-effects-transfer"
		};
		$(target).effect("transfer", option, 1000);

		saveContentFromMainFrame();
		
	};
}

function addActivity(target){
	//make a new activity
	if(currentDialog.activityChecked==true){
		$(".chooseActivityDialog").dialog({
			position: {
				my: "center top",
				at: "center top",
				of: "#mainFrame"
			},
			title: "choose activity type",
			buttons:{
				"Matte aktivitet": function(){
					if(currentDialog.activityObject == null || currentDialog.activityIndex != 0){
						if(currentDialog.activityIndex > -1){
							if(currentDialog.activityIndex == 1)
								$(target).off("click", languageActivityFunction);
							if(currentDialog.activityIndex == 2)
								$(target).off("click", quizActivityFunction);
							currentDialog.activityClickActionMade = false;
						}
						currentDialog.activityIndex = 0;
						var mathObject = new MathActivity();
						console.log(currentObjectList.objectList);
						currentDialog.activityObject = mathObject;
						console.log("new mathobject");
						console.log(currentDialog);
						console.log("\n");
						createNewMathActivity(mathObject);
					}
					else if(currentDialog.activityObject!=null && currentDialog.activityIndex == 0){
						console.log("refresh math object");
						console.log(currentDialog);
						console.log("\n");
						createNewMathActivity(currentDialog.activityObject);
					}
					if(!currentDialog.activityClickActionMade && currentDialog.activityIndex == 0){
						$(target).on("click", mathActivityFunction);
						currentDialog.activityClickActionMade = true;
					}
				},
				"Språk aktivitet": function(){
					createLanguageActivity();
				},
				"Quiz aktivitet": function(){
					if(currentDialog.activityObject == null || currentDialog.activityIndex != 2){
						if(currentDialog.activityIndex > -1){
							if(currentDialog.activityIndex == 1)
								$(target).off("click", languageActivityFunction);
							if(currentDialog.activityIndex == 0)
								$(target).off("click", mathActivityFunction);
							currentDialog.activityClickActionMade = false;
						}
						currentDialog.activityIndex = 2;
						var quizObject = new QuizActivity();
						console.log(currentObjectList.objectList);
						currentDialog.activityObject = quizObject;
						console.log("new quizObject");
						console.log(currentDialog);
						console.log("\n");
						createNewQuizActivity(quizObject,true);
					}
					else if(currentDialog.activityObject!=null && currentDialog.activityIndex == 2){
						console.log("refresh quiz object");
						console.log(currentDialog);
						console.log("\n");
						createNewQuizActivity(currentDialog.activityObject,true);
					}
					if(!currentDialog.activityClickActionMade && currentDialog.activityIndex == 2){
						$(target).on("click", quizActivityFunction);
						currentDialog.activityClickActionMade = true;
					}
				},
			},
		});
	};
	if(!currentDialog.activityChecked){
		if(currentDialog.activityIndex == 0)
			$(target).off("click", mathActivityFunction);
		if(currentDialog.activityIndex == 1)
			$(target).off("click", languageActivityFunction);
		if(currentDialog.activityIndex == 2)
			$(target).off("click", quizActivityFunction);
		currentDialog.activityClickActionMade = false;
	}
}

function addDialog(target){
	if(currentDialog.dialogChecked){
		//make a new dialog
		$(".userInputDialog").dialog({
			title: "type in dialog",
			buttons:{
				"Bekreft": function(){
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
				"Avbryt": function(){
					$(this).dialog("close");
					currentObjectList.objectList[index] = previousVersionDialog;
					currentDialog = previousVersionDialog;
				}
			}
		});
	};
	if(!currentDialog.dialogChecked){
		$(target).off("click", dialogFunction);
		currentDialog.dialogClickActionMade = false;
	}
}

function addPickUp(target){
	if(currentDialog.pickUpChecked){
		//make an element pickable
		$(this).dialog("close");
		var option = {
				to: ".schoolbagImage",
				className: "ui-effects-transfer"
		};
		$(target).effect("transfer", option, 1000);
	};
}


function addAnimation(target){
	// append animation on target
	if(currentDialog.animationChecked){
		if(!currentDialog.animationClickActionMade){
			$(target).on("click", animationFunction);
			currentDialog.animationClickActionMade = true;
		}
	}
	if(!currentDialog.animationChecked){
		$(target).off("click", animationFunction);
		currentDialog.animationClickActionMade = false;
	}
}

function addSound(target){
	//append sound on target
	if(currentDialog.soundChecked){
	}
}