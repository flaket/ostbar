jQuery(document).ready(function(){
	
	$(".elements").hide();
	
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
	
	$(".draggable").tooltip({
		
	});
	
	
	// $(".draggable").dblclick(function(e){	
	$(".draggable").on("dblclick",".element",function(e){
		var target = e.target;
		var name = e.target.name;
		
		console.log(target);
		// console.log(this);
		if(currentDialog == null){
			var dia = new Dialog(false,false,false,false,false,false,target);
			currentDialog = dia;
			console.log(currentDialog)
			objectList.push(dia);
		}
		else if(currentDialog.div != target){
			var index = inList(objectList,target);
			if(index>=0){
				currentDialog = objectList[index];
			}
			else{
				var dia = new Dialog(false,false,false,false,false,false,target);
				currentDialog = dia;
				objectList.push(dia);
				console.log(currentDialog.div);
				console.log("new object");
			}
		}
		console.log(currentDialog);
		console.log(objectList);
		console.log(index);
		
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
						var tempElement = target;
						var option = {
								to: "#customSidebar",
								className: "ui-effects-transfer"
						};
						$(target).effect("transfer", option, 500);
						
						//make a new scene
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
									if(!$(".textarea").val()){
										alert("please type in a dialog");
									}
									else{
										$(target).on("click", function(){
//											$(target).dialog();
											alert($(".textarea").val());
										});
										$(this).dialog("close");
									}
								},
								Cancel: function(){
									$(this).dialog("close");
								}
							}
						});
					};
					if(currentDialog.pickUpChecked==true){
						//make an element pickable
					};
					if(currentDialog.animationChecked==true){
						//append animation on target
					}
					if(currentDialog.soundChecked==true){
						//append sound on target
					}
					objectList[inList(objectList,target)] = currentDialog;
					$(this).dialog("close");
				},
				Cancel: function(){
					$(this).dialog("close");
				},
				"Delete": function(){
					$('input[type=checkbox]').attr('checked', false);
					$("#effectTypes").attr("disabled", true);
					$("#button").attr("disabled", true);
					$(target).remove();
					$(this).dialog("close");
				}
			}
		});
	
	});
	// }
		// function for running animation
	$(function() {
		function runEffect() {
		  var selectedEffect = $( "#effectTypes" ).val();
		  $( ".draggable" ).effect( selectedEffect, 500, callback );
		};
		function callback() {
		  setTimeout(function() {
			$( ".draggable" ).removeAttr( "style" ).hide().fadeIn();
		  }, 1000 );
		};
		$( "#button" ).click(function() {
		  runEffect();
		  return false;
		});
	  });
		
	
});

// var sceneChecked = false;
// var activityChecked = false;
// var dialogChecked = false;
// var pickUpChecked = false;
// var animationChecked = false;
// var soundChecked = false;

var currentDialog = null;
var objectList = [];

function Dialog(scene,activity,dialog,pickUp,animation,sound,object){
	this.sceneChecked = scene;
	this.activityChecked = activity;
	this.dialogChecked = dialog;
	this.pickUpChecked = pickUp;
	this.animationChecked = animation;
	this.soundChecked = sound;
	this.div = object
}

function inList(arr,obj){
	for(var i = 0; i <arr.length; i++){
		if(arr[i].div == obj) return i;
	}
	return -1;
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

//$(".img-grid").on("click", "img", function(e){
//	var target = e.target;
//	$(target).css("border", "3px solid yellow")
//	
//});

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
		$("#newWorldDialog").dialog("close");
	});
});

