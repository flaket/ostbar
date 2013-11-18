var initialCallsReturned = 0;
var initialCallsShouldReturn = 2;

var currentDialog = null;
var currentObjectList = null;

var currentScene = null;
var sceneList = [];

var sceneTypes = null;

var currentGame = null;
var gameId = 0;

var actionTypes = null;
var elementTypes = null;

function ObjectList(){
	this.objectList = [];
}

jQuery(document).ready(function(){
	gameId = parseInt(window.location.href.split('/').slice(-1)[0]);

	getActionTypes();
	getElementTypes();

	$("#storylineButton").hide();
	$(".elements").hide();
	// $(".draggable").tooltip({disabled: true});
	$(".schoolbagImage").show();
	
	// $(".elements").draggable({
	// 	revert:"invalid",
	// 	helper:"clone",
	// 	cursor:"move",
	// 	containment:"document",
	// 	connectWith: "#mainFrame",
	// });
	
	$(".schoolbagImage").on("click", function(){
		$(".schoolbagDialog").dialog({
			resizable: false,
			show: {
				effect: "blind",
				duration: 500
			},
			hide: {
				effect: "blind",
				duration: 500
			},
			position: {
				my: "center center",
				at: "center center",
				of: "#mainFrame"
		},
			height: $(window).width()*0.3,
			width: $(window).width()*0.5,
		});
	});

	$('#newWorldButton').remove();


/*	$("#mainFrame").droppable({
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
		
		if(currentDialog == null){
			var dia = new Dialog(target);
			currentDialog = dia;
			currentObjectList.objectList.push(dia);
		}
		else if(currentDialog.div != target){
			var index = inList(currentObjectList.objectList,target);
			if(index>=0){
				currentDialog = currentObjectList.objectList[index];
			}
			else{
				var dia = new Dialog(target);
				currentDialog = dia;
				currentObjectList.objectList.push(dia);
				console.log("new object");
			}
		}
		console.log(currentScene);
		console.log(sceneList);
		
		var previousVersionDialog = $.extend(true,{},currentDialog); // copy
		
		saveElements();

		resetCheckBoxes(currentDialog);
		
		var index = inList(currentObjectList.objectList,target);
		
		// a new dialog should me made for each element, and should remember check boxes checked 
		$(".dialog").dialog({
			open: function() { $(".ui-dialog-titlebar-close").hide(); },
			title: name,
			resizable: false,
			appendTo: ".draggable",
			show: {
				effect: "blind",
				duration: 500
			},
			modal: true,
			buttons: {
				"Bekreft": function(){
					
					addScene(target,previousVersionDialog,index);
					addActivity(target,previousVersionDialog,index);
					addDialog(target,previousVersionDialog,index);
					addPickUp(target,previousVersionDialog,index);
					addAnimation(target,previousVersionDialog,index);
					addSound(target,previousVersionDialog,index);
					deleteActionTypesWhereChanged(previousVersionDialog);

					$(this).dialog("close");
				},
				"Avbryt": function(){
					$(this).dialog("close");
					currentObjectList.objectList[index] = previousVersionDialog;
					currentDialog = previousVersionDialog;
				},
				"Slett": function(){
					$('input[type=checkbox]').attr('checked', false);
					$("#effectTypes").attr("disabled", true);
					$("#button").attr("disabled", true);
					currentObjectList.objectList.splice(index,1); //removes from the list
					$(parent).remove();
					$(this).dialog("close");
				}
			}
		});
	});
	
	$( "#animationTestButton" ).click(function() {
		runAnimationEffect(currentDialog);
		return false;
	});
*/
	$.ajax({
		type: "GET",
		url: "/api/scenetype",
		success: function ( response ){
			if ( response.redirect ){
				window.location.href = response.redirect;
			} else {

				sceneTypes = response;

				var newWorldDialog = $("#newWorldDialog"),
					imageGrid = newWorldDialog.find('.img-grid');
				
				var html = '';
				for ( key in response ){
					var scenetype = response[key];
					var div = '<div class="img-wrapper img-wrapper1"><div class="img-container">';
					div += '<img name="' + scenetype.sceneTypeId + '" src="' + scenetype.backgroundAvatar.url + '" width ="200" height="200">';
					div += '</div></div>';

					html += div;
				}
				imageGrid.html(html);
			}

			initialCallsReturned++;
			setupAfterCallsReturns();
		},
		error: function ( jqXHR, textStatus, errorThrown ){
			console.log('get scenetype error:', textStatus, errorThrown);
		},
		dataType: "json"
	});

	$.ajax({
		type: "GET",
		url: '/api/game/' + gameId,
		success: function ( response ){
			if ( response.redirect ){
				window.location.href = response.redirect;
			} else {
				currentGame = response;
				if ( currentGame.scenes.length == 0){
					$("#newWorldButton").show();

				} else {
					$("#newWorldButton").hide();

					if (currentGame.initialSceneId != null){
						for ( key in currentGame.scenes ){
							var scene = currentGame.scenes[key];
							scene.objectList = new ObjectList();
							sceneList.push(scene);
							if ( scene.sceneId == currentGame.initialSceneId ){
								currentScene = scene;
								currentObjectList = currentScene.objectList;
							}
						}
					}
				}

				initialCallsReturned++;
				setupAfterCallsReturns();
			}
		},
		error: function ( jqXHR, textStatus, errorThrown ){
			console.log('get game error:', textStatus, errorThrown);	
		}
	});
});

function setupAfterCallsReturns() {
	console.log(currentScene);
	if ( initialCallsReturned == initialCallsShouldReturn ){
		if ( currentScene != null ){
			currentSceneType = currentScene.sceneType;
			loadElementsByScene(currentScene.elements);
			var imgUrl = currentSceneType.backgroundAvatar.url;
			$("#mainFrame").css({
				"background-image": "url('"+ imgUrl + "')",
				"background-repeat": "no-repeat",
				"background-position": "center",
				"background-size": "cover"
			});

			// $(".elements").show();
			$(".schoolbagImage").show();
			// $(".draggable").tooltip({disabled: false});
			$("#storylineButton").show();
		} else {
			choseSceneFromSceneChooser();
		}
	}
}
/*
function choseSceneFromSceneChooser() {
	$(".img-grid").on("dblclick", "img", initialDoubleClickSceneAddingFunction);
}

function initialDoubleClickSceneAddingFunction(e){
	console.log(e);
	var sceneTypeId = e.target.getAttribute('name');

	var currentSceneType = null;
	for ( key in sceneTypes ){
		var sceneType = sceneTypes[key];

		if ( sceneType.sceneTypeId == sceneTypeId ){
			currentSceneType = sceneType;
			break;
		}
	}

	if ( currentSceneType != null ){
		$.ajax({
			type: "POST",
			url: "/api/scene",
			data: {
				game_id: gameId,
				scenetype_id: currentSceneType.sceneTypeId,
				is_initial_scene: true
			},
			success: function ( response ){
				sceneList.push(response);
				currentScene = response;
				currentScene.ObjectList = new ObjectList();
				currentObjectList = currentScene.ObjectList;
				currentGame.initialSceneId = currentScene.sceneId;

				var imgUrl = currentSceneType.backgroundAvatar.url;
				$("#mainFrame").css({
					"background-image": "url('"+ imgUrl + "')",
					"background-repeat": "no-repeat",
					"background-position": "center",
					"background-size": "cover"
				});
				$("#newWorldButton").hide();
				$(".elements").show();
				$(".schoolbagImage").show();
				$(".draggable").tooltip({disabled: false});
				$("#storylineButton").show();
				$("#newWorldDialog").dialog("close");
				$(".img-grid").off("dblclick", "img", initialDoubleClickSceneAddingFunction);
			},
			error: function ( jqXHR, textStatus, errorThrown ){
				console.log('post scene error:', jqXHR, textStatus, errorThrown);
			},
			dataType: "json" 
		});
	}
}

function addSceneToGame(){
	$(".img-grid").on("dblclick", "img", doubleClickSceneAddingFunction);
}

function doubleClickSceneAddingFunction(e){
	console.log("getting here");
	var sceneTypeId = e.target.getAttribute('name');

	var currentSceneType = null;
	for ( key in sceneTypes ){
		var sceneType = sceneTypes[key];

		if ( sceneType.sceneTypeId == sceneTypeId ){
			currentSceneType = sceneType;
			break;
		}
	}

	if ( currentSceneType != null ){
		$.ajax({
			type: "POST",
			url: "/api/scene",
			data: {
				game_id: gameId,
				scenetype_id: currentSceneType.sceneTypeId,
			},
			success: function ( response ){
				console.log(response);
				sceneList.push(response);
				currentDialog.sceneIndex = response.sceneId;
				addSceneToElement(currentDialog,getActionTypeByName("TO_SCENE"));

				$(".img-grid").off("dblclick", "img", doubleClickSceneAddingFunction);
				$("#newWorldDialog").dialog("close");
			},
			error: function ( jqXHR, textStatus, errorThrown ){
				console.log('post scene error:', jqXHR, textStatus, errorThrown);
			},
			dataType: "json" 
		});
	}
}
*/
function loadSelectedScene(scene){

	currentScene = response;
	currentScene.ObjectList = new ObjectList();
	currentObjectList = currentScene.ObjectList;

	var imgUrl = currentSceneType.backgroundAvatar.url;
	$("#mainFrame").css({
		"background-image": "url('"+ imgUrl + "')",
		"background-repeat": "no-repeat",
		"background-position": "center",
		"background-size": "cover"
	});

	removeElementsFromView();
}
/*
function saveElements(){
	//Save call for database
	for(var i = 0; i < currentObjectList.objectList.length; i++){
		var temp = currentObjectList.objectList[i];
		var elemId = temp.element_id;
		// console.log(temp);
		if (temp.element_id < 0){
			$.ajax({
				type: "POST",
				url: "/api/element/?",
				data: {
					element_type_id: temp.elementType_id,
					frame_x : temp.div.offsetParent.offsetLeft,
					frame_y : temp.div.offsetParent.offsetTop,
					frame_width: temp.div.offsetParent.offsetWidth,
					frame_height : temp.div.offsetParent.offsetHeight,
					scene_id: currentScene.sceneId,	
				},
				success: function (response) {
					if ( response.redirect ){
						window.location.href = response.redirect;
					} else {
						console.log("new element:")
						console.log(response);
						temp.element_id = response.elementId;
					}
				},
				error: function ( jqXHR, textStatus, errorThrown ){
					console.log('post element error:', jqXHR, textStatus, errorThrown);
				},
				dataType: "json"
			});
		}
		else{
			$.ajax({
				type: "POST",
				url: "/api/element/"  +elemId,
				data: {
					element_type_id: temp.elementType_id,
					frame_x : temp.div.offsetParent.offsetLeft,
					frame_y : temp.div.offsetParent.offsetTop,
					frame_width: temp.div.offsetParent.offsetWidth,
					frame_height : temp.div.offsetParent.offsetHeight,
					scene_id: currentScene.sceneId,
				},
				success: function (response) {
					if ( response.redirect ){
						window.location.href = response.redirect;
					} else {
						console.log("updated element:");
						console.log(response);
					}
				},
				error: function ( jqXHR, textStatus, errorThrown ){
					console.log('update element error:', jqXHR, textStatus, errorThrown);
				},
				dataType: "json"
			});
		}
	}
}
*/
function loadElementsByScene(elements){
	console.log("");
	for(element in elements){
		// console.log(elements[element]);
		var elem = elements[element];
		var elementType = getElementTypeById(elem.elementTypeId);
		var url = elementType.avatar.url;
		$("<div></div>").html("<div class =\"elements ui-draggable\" style=\"display:block;\">" + 
								"<img width=\""  + elem.frameWidth + "\" height=\"" + elem.frameHeight + 
								"\" src=\"" + url +"\"" + "name = \"Penguin\">" +
								"</img></div>")
		.css({
			"position": "absolute",
			"top": elem.frameY,
			"left": elem.frameX,
		}).appendTo(".draggable").draggable({
			containment:"parent"
		}).removeClass("ui-draggable").toggleClass("element");
		
	}
	var temp = document.getElementsByClassName("element");
	// console.log(temp);

	if(currentObjectList.objectList.length>0){
		currentObjectList.objectList.length = 0;
	}

	for (var i = 0; i < temp.length ; i++) {
		// console.log(temp[i]);
		// console.log(temp[i].children[0].children[0]);
		var target = temp[i].children[0].children[0];
		// console.log("");
		
		var dia = new Dialog(target);
		dia.element_id = elements[i].elementId;
		dia.elementType_id = elements[i].elementTypeId;

		for (var j = 0; j < elements[i].actionTypes.length; j++) {
			if(elements[i].actionTypes[j].name.localeCompare("TO_ACTIVITY") == 0){
				var activityId = elements[i].actionTypes[j].data;
				addActivityByIdToElement(target,dia,activityId,function(error,success){
					if(error){ console.log("error thrown" + error); return;}
					
					if(success){
						console.log("added existing activity to the element");
					}
					return;
				});
			}
			if(elements[i].actionTypes[j].name.localeCompare("DIALOG") == 0){
				console.log("adding existing dialog to the element");
				dia.dialogData = elements[i].actionTypes[j].data;
				dia.dialogChecked = true;
				$(target).on("click", dialogFunction);
				dia.dialogClickActionMade = true;
			}
			if(elements[i].actionTypes[j].name.localeCompare("ANIMATION") == 0){
				console.log("adding the existing animation to the element");
				dia.animationIndex = parseInt(elements[i].actionTypes[j].data);
				dia.animationChecked = true;
				$(target).on("click", animationFunction);
				dia.animationClickActionMade = true;
			}
			if(elements[i].actionTypes[j].name.localeCompare("TO_SCENE") == 0){
				console.log("adding the existing scene to the element");
				dia.sceneIndex = parseInt(elements[i].actionTypes[j].data);
				dia.sceneChecked = true;
				$(target).on("click", sceneFunction);
				dia.sceneClickActionMade = true;
			}
		};
		currentDialog = dia;
		currentObjectList.objectList.push(dia);
	
	};
	console.log(currentScene);
}
/*
function removeElementsFromView(){
	$(".element").remove();
}


function saveActivityByElementId(activityIndex,activityObject,elementID){
	//Create
	if(activityObject.activity_id<0){
		if(activityIndex == 0){
			$.ajax({
				type: "POST",
				url: "/api/activity/",
				data: {
					activity_type: "MATH",
					element_id: elementID,
					numbers_range_from: activityObject.lowestNumber,
					numbers_range_to: activityObject.highestNumber,
					n_operands: activityObject.operandsCount,
					operators: getActiveOperators(activityObject),
				},
				success: function (response) {
					if ( response.redirect ){
						window.location.href = response.redirect;
					} else {
						console.log(response);
						activityObject.activity_id = response.activityId;
					}
				},
				error: function ( jqXHR, textStatus, errorThrown ){
					console.log('post activity error:', jqXHR, "", textStatus, "", errorThrown);
				},

				dataType: "json"
			});
		}
		else if(activityIndex == 2){
			$.ajax({
				type: "POST",
				url: "/api/activity/",
				data: {
					questions: activityObject.questions,
					activity_type: "QUIZ",
					element_id: elementID,
				},
				success: function (response) {
					if ( response.redirect ){
						window.location.href = response.redirect;
					} else {
						//console.log(response);
						activityObject.activity_id = response.activityId;
					}
				},
				error: function ( jqXHR, textStatus, errorThrown ){
					console.log('post activity error:', jqXHR, textStatus, errorThrown);
				},
				dataType: "json"
			}); 
		}
	}
	//Update
	else{
		if(activityIndex == 0){
			$.ajax({
				type: "POST",
				url: "/api/activity/" + activityObject.activity_id,
				data: {
					activity_type: "MATH",
					element_id: elementID,
					numbers_range_from: activityObject.lowestNumber,
					numbers_range_to: activityObject.highestNumber,
					n_operands: activityObject.operandsCount,
					operators: getActiveOperators(activityObject),
				},
				success: function (response) {
					if ( response.redirect ){
						window.location.href = response.redirect;
					} else {
						console.log(response);
						activityObject.activity_id = response.activityId;
					}
				},
				error: function ( jqXHR, textStatus, errorThrown ){
					console.log('post activity error:', jqXHR, "", textStatus, "", errorThrown);
				},

				dataType: "json"
			});
		}
		else if(activityIndex == 2){
			$.ajax({
				type: "POST",
				url: "/api/activity/" + activityObject.activity_id,
				data: {
					questions: activityObject.questions,
					activity_type: "QUIZ",
					element_id: elementID,
				},
				success: function (response) {
					if ( response.redirect ){
						window.location.href = response.redirect;
					} else {
						//console.log(response);
						activityObject.activity_id = response.activityId;
					}
				},
				error: function ( jqXHR, textStatus, errorThrown ){
					console.log('post activity error:', jqXHR, textStatus, errorThrown);
				},
				dataType: "json"
			}); 
		}	
	}
}
*/
function addActivityByIdToElement(target,dialogObject,activityID,callBack){
	$.ajax({
		type: "GET",
		url: "/api/activity/" + activityID,
		success: function (response) {
			if ( response.redirect ){
				window.location.href = response.redirect;
			} else {
				var error = response.error;
				if(response.activityType.localeCompare("MATH") == 0){
					var mathObject = new MathActivity(response);
					dialogObject.activityObject = mathObject;
					dialogObject.activityIndex = 0;
					dialogObject.activityChecked = true;
					console.log("math load");
					$(target).on("click", mathActivityFunction);
					dialogObject.activityClickActionMade = true;
					return callBack(error,true);}
				//TODO
				if(response.activityType.localeCompare("LANGUAGE") == 0){
					dialogObject.activityObject = null; //create new language object based on database stored object and attach
					dialogObject.activityIndex = 1;
					dialogObject.activityChecked = true;
					console.log("lang load");
					$(target).on("click", languageActivityFunction);
					dialogObject.activityClickActionMade = true;
					return callBack(error,true);
				}
				//TODO
				if(response.activityType.localeCompare("QUIZ") == 0){
					dialogObject.activityObject = new QuizActivity(response); 
					dialogObject.activityIndex = 2;
					dialogObject.activityChecked = true;
					console.log("quiz load");
					$(target).on("click", quizActivityFunction);
					dialogObject.activityClickActionMade = true;
					return callBack(error,true);
				}
				else{
					return callBack(error,false);
				}
			}
		},
		error: function ( jqXHR, textStatus, errorThrown ){
			console.log('get activity error:', jqXHR, "", textStatus, "", errorThrown);
		},
	});
}
/*
function deleteActivityByIdFromElement(elementID,activityID){
	$.ajax({
		type: "DELETE",
		url: "/api/activity/" + activityID,
		data:{
			element_id: elementID,
		},

		success: function (response) {
			if ( response.redirect ){
				window.location.href = response.redirect;
			} else {
				console.log(response);

			}
		},
		error: function ( jqXHR, textStatus, errorThrown ){
			console.log('delete activity error:', jqXHR, "", textStatus, "", errorThrown);
		},
	});	
}

function addDialogDataToElement(dialogObject,actionType){
	$.ajax({
		type: "POST",
		url: "/api/element/" + dialogObject.element_id + "/actiontype/",
		data:{
			actiontype_id: actionType.actionTypeId,
			data: dialogObject.dialogData,
		},
		success: function (response) {
			if ( response.redirect ){
				window.location.href = response.redirect;
			} else {
				console.log(response);

			}
		},
		error: function ( jqXHR, textStatus, errorThrown ){
			console.log('post dialog error:', jqXHR, "", textStatus, "", errorThrown);
		},
	});	
}

function addAnimationToElement(dialogObject,actionType){
	$.ajax({
		type: "POST",
		url: "/api/element/" + dialogObject.element_id + "/actiontype/",
		data:{
			actiontype_id: actionType.actionTypeId,
			data: dialogObject.animationIndex,
		},
		success: function (response) {
			if ( response.redirect ){
				window.location.href = response.redirect;
			} else {
				console.log(response);

			}
		},
		error: function ( jqXHR, textStatus, errorThrown ){
			console.log('post animation error:', jqXHR, "", textStatus, "", errorThrown);
		},
	});
}

function addSceneToElement(dialogObject,actionType){
	$.ajax({
		type: "POST",
		url: "/api/element/" + dialogObject.element_id + "/actiontype/",
		data:{
			actiontype_id: actionType.actionTypeId,
			data: dialogObject.sceneIndex,
		},
		success: function (response) {
			if ( response.redirect ){
				window.location.href = response.redirect;
			} else {
				console.log(response);

			}
		},
		error: function ( jqXHR, textStatus, errorThrown ){
			console.log('post scene error:', jqXHR, "", textStatus, "", errorThrown);
		},
	});	
}

function deleteActionTypeFromElement(dialogObject,actionType){
	$.ajax({
		type: "DELETE",
		url: "/api/element/" + dialogObject.element_id + "/actiontype/",
		data:{
			actiontype_id: actionType.actionTypeId,
		},
		success: function (response) {
			if ( response.redirect ){
				window.location.href = response.redirect;
			} else {
				console.log(response);

			}
		},
		error: function ( jqXHR, textStatus, errorThrown ){
			console.log('Delete actionType error:', jqXHR, "", textStatus, "", errorThrown);
		},
	});	
}
*/
function getActionTypes(){
	$.ajax({
		type: "GET",
		url: "/api/actiontype",
		success: function (response) {
			if ( response.redirect ){
				window.location.href = response.redirect;
			} else {
				console.log(response);
				actionTypes = response;
			}
		},
		error: function ( jqXHR, textStatus, errorThrown ){
			console.log('get activityType error:', jqXHR, "", textStatus, "", errorThrown);
		},
	});
}

function getElementTypes(){
	$.ajax({
		type: "GET",
		url: "/api/elementtype",
		success: function (response) {
			if ( response.redirect ){
				window.location.href = response.redirect;
			} else {
				console.log(response);
				elementTypes = response;
			}
		},
		error: function ( jqXHR, textStatus, errorThrown ){
			console.log('get elementType error:', jqXHR, "", textStatus, "", errorThrown);
		},
	});	
}

function getActionTypeByName(nameString){
	for (var i = 0; i < actionTypes.length; i++) {
		if(actionTypes[i].name.localeCompare(nameString) == 0)
			return actionTypes[i];
	};
}

function getElementTypeById(elementTypeId){
	for (key in elementTypes){
		if(elementTypes[key].elementTypeId == elementTypeId){
			// console.log(elementTypes[key]);
			return elementTypes[key];
		}
	}
}