function addScene(target,previousVersionDialog,index){
	if(currentDialog.sceneChecked==true){
		$(".dialog").dialog("close");
		
		var option = {
				to: "#storylineButton",
				className: "ui-effects-transfer"
		};
		$(target).effect("transfer", option, 1000);

		var chooseScene = $(".chooseSceneDialog");

		var html = '';
		for (key in sceneList){
			var scenetype = sceneList[key].sceneType;
			var sceneId = sceneList[key].sceneId;
			var div = '<div class="img-wrapper img-wrapper1" id="'+sceneId+'"><div class="img-container">';
			div += '<img name="' + scenetype.sceneTypeId + '" src="' + scenetype.backgroundAvatar.url + '" width ="200" height="200">';
			div += '</div></div>';

			html += div;
		}
		chooseScene.html(html);

		$(".img-wrapper").on("dblclick", target , selectSceneInDialog);
		$(".chooseSceneDialog").dialog({
			height: $(window).height()*0.8,
			width: $(window).width()*0.7,
			position: {
				my: "center top",
				at: "center top",
				of: "#mainFrame"
			},
			title: "Velg blandt eksisterende scener, eller lag en ny",
			buttons:{
				"Ny Scene": function(){
					$(".chooseSceneDialog").dialog("close");
					$("#newWorldDialog").dialog("open");
					$(".img-wrapper").off("dblclick", selectSceneInDialog);
					addSceneToGame();
					if(!currentDialog.sceneClickActionMade){
						$(target).on("click", sceneFunction);
						currentDialog.sceneClickActionMade = true;
					}
				},
				"Avbryt": function(){
					$(this).dialog("close");
					currentObjectList.objectList[index] = previousVersionDialog;
					currentDialog = previousVersionDialog;
				},
			}
		});
	};
	if(!currentDialog.sceneChecked){
		$(target).off("click", sceneFunction);
		currentDialog.sceneClickActionMade = false;
	}
}

function selectSceneInDialog(e){
	var sceneId = e.target.parentNode.parentNode.getAttribute('id');
	currentDialog.sceneIndex = sceneId;
	addSceneToElement(currentDialog,getActionTypeByName("TO_SCENE"));
	if(!currentDialog.sceneClickActionMade){
		$(e.data).on("click", sceneFunction);
		currentDialog.sceneClickActionMade = true;
	}
	$(".img-wrapper").off("dblclick", selectSceneInDialog);
	$(".chooseSceneDialog").dialog("close");
}


function addActivity(target,previousVersionDialog,index){
	//make a new activity
	if(currentDialog.activityChecked==true){
		$(".chooseActivityDialog").dialog({
			position: {
				my: "center top",
				at: "center top",
				of: "#mainFrame"
			},
			title: "Velg aktivitetstype",
			buttons:{
				"Matte aktivitet": function(){
					if(currentDialog.activityObject == null || currentDialog.activityIndex != 0){
						if(currentDialog.activityIndex > -1){
							if(currentDialog.activityIndex == 1)
								$(target).off("click", languageActivityFunction);
							if(currentDialog.activityIndex == 2)
								$(target).off("click", quizActivityFunction);
							currentDialog.activityClickActionMade = false;
							if(currentDialog.activityIndex != 0){
								if(currentDialog.activityObject.activity_id >-1){
									deleteActivityByIdFromElement(currentDialog.element_id,currentDialog.activityObject.activity_id);
									currentDialog.activityObject.activity_id = -1;
								}
							}
						}
						currentDialog.activityIndex = 0;
						var mathObject = new MathActivity();						
						// console.log(currentObjectList.objectList);
						currentDialog.activityObject = mathObject;
						// console.log("new mathobject");
						// console.log(currentDialog);
						// console.log("\n");
						createNewMathActivity(mathObject);
					}
					else if(currentDialog.activityObject!=null && currentDialog.activityIndex == 0){
						// console.log("refresh math object");
						// console.log(currentDialog);
						// console.log("\n");
						createNewMathActivity(currentDialog.activityObject);
					}
					if(!currentDialog.activityClickActionMade && currentDialog.activityIndex == 0){
						// console.log("added the click");
						$(target).on("click", mathActivityFunction);
						currentDialog.activityClickActionMade = true;
					}
				},
				// "Språk aktivitet": function(){
				// 	if(currentDialog.activityObject == null || currentDialog.activityIndex != 1){
				// 		if(currentDialog.activityIndex > -1){
				// 			if(currentDialog.activityIndex == 0)
				// 				$(target).off("click", mathActivityFunction);
				// 			if(currentDialog.activityIndex == 2)
				// 				$(target).off("click", quizActivityFunction);
				// 			if(currentDialog.activityIndex != 1){
				// 				if(currentDialog.activityObject.activity_id >-1){
				// 					deleteActivityByIdFromElement(currentDialog.element_id,currentDialog.activityObject.activity_id);
				// 					currentDialog.activityObject.activity_id = -1;
				// 				}
				// 			}
				// 			currentDialog.activityClickActionMade = false;
				// 		}
				// 		currentDialog.activityIndex = 1;
				// 		var languageObject = new LanguageActivity();
				// 		console.log(currentObjectList.objectList);
				// 		currentDialog.activityObject = languageObject;
				// 		console.log("new languageObject");
				// 		console.log(currentDialog);
				// 		console.log("\n");
				// 		createNewLanguageActivity(languageObject,true);
				// 	}
				// 	else if(currentDialog.activityObject!=null && currentDialog.activityIndex == 1){
				// 		console.log("refresh language object");
				// 		console.log(currentDialog);
				// 		console.log("\n");
				// 		createNewLanguageActivity(currentDialog.activityObject,true);
				// 	}
				// 	if(!currentDialog.activityClickActionMade && currentDialog.activityIndex == 1){
				// 		$(target).on("click", languageActivityFunction);
				// 		currentDialog.activityClickActionMade = true;
				// 	}
				// },
				"Quiz aktivitet": function(){
					if(currentDialog.activityObject == null || currentDialog.activityIndex != 2){
						if(currentDialog.activityIndex > -1){
							if(currentDialog.activityIndex == 0)
								$(target).off("click", mathActivityFunction);
							if(currentDialog.activityIndex == 1)
								$(target).off("click", languageActivityFunction);
							if(currentDialog.activityIndex != 2){
								if(currentDialog.activityObject.activity_id >-1){
									deleteActivityByIdFromElement(currentDialog.element_id,currentDialog.activityObject.activity_id);
									currentDialog.activityObject.activity_id = -1;
								}
							}
							currentDialog.activityClickActionMade = false;
						}
						currentDialog.activityIndex = 2;
						var questionList = new QuizActivity();
						// console.log(currentObjectList.objectList);
						currentDialog.activityObject = questionList;
						// console.log("new questionList");
						// console.log(currentDialog);
						// console.log("\n");
						createNewQuizActivity(questionList,true);
					}
					else if(currentDialog.activityObject!=null && currentDialog.activityIndex == 2){
						// console.log("refresh quiz object");
						// console.log(currentDialog);
						// console.log("\n");
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
		if(currentDialog.activityObject != null){
			if(currentDialog.activityObject.activity_id >-1){
				deleteActivityByIdFromElement(currentDialog.element_id,currentDialog.activityObject.activity_id);
				currentDialog.activityObject.activity_id = -1;
			}
		}
	}
}

function addDialog(target,previousVersionDialog,index){
	if(currentDialog.dialogChecked){
		//make a new dialog
		$(".userInputDialog").dialog({
			title: "Skriv en dialog",
			height: $(window).height()*0.5,
			buttons:{
				"Bekreft": function(){
					if(!$("#dialogText").val()){
						alert("Skriv inn en dialog");
					}
					else{
						if(!currentDialog.dialogClickActionMade){
							$(target).on("click", dialogFunction);
							currentDialog.dialogClickActionMade = true;
						}
						currentDialog.dialogData = $('#dialogText').val();
						addDialogDataToElement(currentDialog,getActionTypeByName("DIALOG"));
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

function addPickUp(target,previousVersionDialog,index){
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


function addAnimation(target,previousVersionDialog,index){
	// append animation on target
	if(currentDialog.animationChecked){
		if(!currentDialog.animationClickActionMade){
			$(target).on("click", animationFunction);
			currentDialog.animationClickActionMade = true;
		}
		addAnimationToElement(currentDialog,getActionTypeByName("ANIMATION"));
	}
	if(!currentDialog.animationChecked){
		$(target).off("click", animationFunction);
		currentDialog.animationClickActionMade = false;
	}
}

function addSound(target,previousVersionDialog,index){
	//append sound on target
	if(currentDialog.soundChecked){
	}
}

function deleteActionTypesWhereChanged(previousVersionDialog){
	if(!currentDialog.animationChecked && previousVersionDialog.animationChecked)
		deleteActionTypeFromElement(currentDialog,getActionTypeByName("ANIMATION"));
	if(!currentDialog.dialogChecked && previousVersionDialog.dialogChecked)
		deleteActionTypeFromElement(currentDialog,getActionTypeByName("DIALOG"));
	if(!currentDialog.sceneChecked && previousVersionDialog.sceneChecked)
		deleteActionTypeFromElement(currentDialog,getActionTypeByName("TO_SCENE"));
}
