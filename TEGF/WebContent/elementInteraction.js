jQuery(document).ready(function(){
	
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
						var option = {
								to: "#customSidebar2",
								className: "ui-effects-transfer"
						};
						$(target).effect("transfer", option, 500);
						
						//make a new scene
//						var mainFrameClone = $("#mainFrame").clone();
//						mainFrameClone.css({
//							"height": "20%"
//						});
//						$("#mainFrame").empty();
//						$("#customSidebar2").html(mainFrameClone);
//						
//						$(this).dialog("close");
						
					};
					
					
					
					if(currentDialog.activityChecked==true){
						//make a new activity
					};
					
					
					
					if(currentDialog.dialogChecked==true){
						//make a new dialog
						$(".userInputDialog").dialog({
							title: "type in dialog",
							buttons:{
								"Confirm": function(){
									if(!$(".dialogText").val()){
										alert("please type in a dialog");
									}
									else{
										if(!currentDialog.dialogClickActionMade){
											$(target).on("click", dialogFunction);
											currentDialog.dialogClickActionMade = true;
										}
										currentDialog.dialogData = $('.dialogText').val();
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
	$(e.target).tipsy({
		gravity: 's',
		title: function(){
			return objectList[inList(objectList,e.target)].dialogData;
		}
	});
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
	
	$(".dialogText").val(dialogObject.dialogData);
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

$(function(){
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
		$("#newWorldDialog").dialog("close");
	});
});

