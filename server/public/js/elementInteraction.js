var initialCallsReturned = 0;
var initialCallsShouldReturn = 2;

var currentDialog = null;
var currentObjectList = null;

var currentScene = null;
var sceneList = [];

var sceneTypes = null;

var currentGame = null;
var gameId = 0;

function ObjectList(){
	this.objectList = [];
}

jQuery(document).ready(function(){
	gameId = parseInt(window.location.href.split('/').slice(-1)[0]);

	$("#storylineButton").hide();
	$(".elements").hide();
	$(".draggable").tooltip({disabled: true});
	$(".schoolbagImage").hide();
	
	$(".elements").draggable({
		revert:"invalid",
		helper:"clone",
		cursor:"move",
		containment:"document",
		connectWith: "#mainFrame",
	});
	
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
		console.log(currentDialog);
		console.log(currentObjectList);
		console.log(currentScene);
		console.log(sceneList);
		console.log(currentScene.sceneId);
		
		var previousVersionDialog = $.extend(true,{},currentDialog); // copy
		
		saveElements();

		resetCheckBoxes(currentDialog);
		
		var index = inList(currentObjectList.objectList,target);
		
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
				"Bekreft": function(){
					
					addScene(target,previousVersionDialog,index);
					addActivity(target,previousVersionDialog,index);
					addDialog(target,previousVersionDialog,index);
					addPickUp(target,previousVersionDialog,index);
					addAnimation(target,previousVersionDialog,index);
					addSound(target,previousVersionDialog,index);

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

			$(".elements").show();
			$(".schoolbagImage").show();
			$(".draggable").tooltip({disabled: false});
			$("#storylineButton").show();
		} else {
			choseSceneFromSceneChooser();
		}
	}
}

function choseSceneFromSceneChooser() {
	$(".img-grid").on("dblclick", "img", function(e){
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
				},
				error: function ( jqXHR, textStatus, errorThrown ){
					console.log('post scene error:', jqXHR, textStatus, errorThrown);
				},
				dataType: "json" 
			});
		}
	});	
}

//Broken!!!
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


function saveElements(){
	//May need more stuff here

	//Save call for database
	for(var i = 0; i < currentObjectList.objectList.length; i++){
		var temp = currentObjectList.objectList[i];
		console.log(temp);
		if (temp.element_id < 0){
			$.ajax({
				type: "POST",
				url: "/api/element/?",
				data: {
					element_type_id: "1",
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
				url: "/api/element/"  +temp.element_id,
				data: {
					element_type_id: "1",
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


function loadElementsByScene(elements){
	console.log("");
	for(element in elements){
		// console.log(elements[element]);
		var elem = elements[element];

		//TODO, get the actual avatar (as in gfx)

		$("<div></div>").html("<div class =\"elements ui-draggable\" style=\"display:block;\">" + 
								"<img width=\""  + elem.frameWidth + "\" height=\"" + elem.frameHeight + 
								"\" src=\"/gfx/Penguins.jpg\"" + "name = \"Penguin\">" +
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
	for (var i = 0; i < temp.length ; i++) {
		// console.log(temp[i]);
		// console.log(temp[i].children[0].children[0]);
		var target = temp[i].children[0].children[0];
		// console.log("");
		var dia = new Dialog(target);
		dia.element_id = elements[i].elementId;

		for (var j = 0; j < elements[i].actionTypes.length; j++) {
			if(elements[i].actionTypes[j].name == "TO_ACTIVITY"){
				var activityId = elements[i].actionTypes[j].data;
				addActivityByIdToElement(dia,activityId,function(error,success){
					if(error){ console.log("error thrown" + error); return;}
					
					console.log(success);
					
					if(success){
						console.log("yay");
					}
					return;
				});
			}
		};
		

		currentDialog = dia;
		currentObjectList.objectList.push(dia);
	};
	console.log(currentScene);

	//TODO, update the internal properties and "pointers" of the dialog object based on the element action types
}

function saveActivityByElementId(activityIndex,activityObject,elementID){
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
}

function addActivityByIdToElement(dialogObject,activityID,callBack){
	$.ajax({
		type: "GET",
		url: "/api/activity/" + activityID,
		success: function (response) {
			if ( response.redirect ){
				window.location.href = response.redirect;
			} else {
				console.log(response);
				var error = response.error;
				if(response.activityType == "MATH")
					var mathObject = new MathActivity(response);
					dialogObject.activityObject = mathObject;
					dialogObject.activityIndex = 0;
					return callBack(error,true);
				//TODO
				if(response.activityType == "LANGUAGE"){
					dialogObject.activityObject = null; //create new language object based on database stored object and attach
					dialogObject.activityIndex = 1;
					return callBack(error,true);
				}
				//TODO
				if(response.activityType == "QUIZ"){
					dialogObject.activityObject = null; //create new quiz object based on database stored object and attach
					dialogObject.activityIndex = 2;
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

// function deleteActivityByIdFromElement(dialogObject,activityID){
// 	$.ajax({
// 		type: "DELETE",
// 		url: "/api/activity/" + activityID,
// 		success: function (response) {
// 			if ( response.redirect ){
// 				window.location.href = response.redirect;
// 			} else {
// 				console.log(response);

// 			}
// 		},
// 		error: function ( jqXHR, textStatus, errorThrown ){
// 			console.log('get activity error:', jqXHR, "", textStatus, "", errorThrown);
// 		},
// 	});	
// }
