jQuery(document).ready(function(){
	
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
			}).removeClass("ui-draggable").toggleClass("element").children().children().resizable();
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
		
		saveElements();
		
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
				"Bekreft": function(){
					if(currentDialog.sceneChecked==true){
						$(this).dialog("close");
						
						var option = {
								to: "#storylineButton",
								className: "ui-effects-transfer"
						};
						$(target).effect("transfer", option, 1000);

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
										console.log(objectList);
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
					
					
					if(currentDialog.dialogChecked==true){
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
						$(this).dialog("close");
						var option = {
								to: ".schoolbagImage",
								className: "ui-effects-transfer"
						};
						$(target).effect("transfer", option, 1000);
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
				"Avbryt": function(){
					$(this).dialog("close");
					objectList[index] = previousVersionDialog;
					currentDialog = previousVersionDialog;
				},
				"Slett": function(){
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

	$.ajax({
		type: "GET",
		url: "/api/elementtype",
		success: function ( response ){
			if ( response.redirect ){
				window.location.href = response.redirect;
			} else {
				var sidebar = $('#customSidebar');
			}
		},
		error: function ( jqXHR, textStatus, errorThrown ){
			console.log('elementtype error:', textStatus, errorThrown);
		},
		dataType: "json"
	});
});



var currentDialog = null;
var objectList = [];

var currentScene = null;
var sceneList = [];

function Scene(){
	this.elementList = []; // = objectList
	this.scene_id = -1
}


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

//pseudo
function saveElements(){

//access width and height, x and y:
// var div = currentDialog.div;
// console.log(currentDialog.div.offsetParent.offsetParent.offsetLeft); //x
// console.log(currentDialog.div.offsetParent.offsetParent.offsetTop); //y

// console.log(currentDialog.div.offsetParent.offsetParent.offsetHeight); //height
// console.log(currentDialog.div.offsetParent.offsetParent.offsetWidth); //width

	// for(var i = 0; i < objectList.length, i++){
		var temp = objectList[i];
		if (temp.element_id < 0){
			$.ajax({
				type: "POST",
				url: "/api/element/?",
				data: {
					element_type_id: "1",
					frame_x : temp.div.offsetParent.offsetParent.offsetLeft,
					frame_y : temp.div.offsetParent.offsetParent.offsetTop,
					frame_width: temp.div.offsetParent.offsetParent.offsetWidth,
					frame_height : temp.div.offsetParent.offsetParent.offsetHeight,
					scene_id: "2"
				},
				success: function (response) {
					console.log(response);
					temp.element_id = response.elementId;
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
					frame_x : temp.div.offsetParent.offsetParent.offsetLeft,
					frame_y : temp.div.offsetParent.offsetParent.offsetTop,
					frame_width: temp.div.offsetParent.offsetParent.offsetWidth,
					frame_height : temp.div.offsetParent.offsetParent.offsetHeight,
					scene_id: "2"
				},
				success: function (response) {
					console.log(response);
					temp.element_id = response.elementId;
				},
				dataType: "json"
			});
		}
	// }
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
		$(".schoolbagImage").show();
		$(".draggable").tooltip({disabled: false});
		$("#storylineButton").show();
		$("#newWorldDialog").dialog("close");
	});
	
});
