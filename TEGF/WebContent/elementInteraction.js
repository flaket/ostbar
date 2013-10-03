jQuery(document).ready(function(){
	
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
		
//		console.log(e)
		
		// if(!name)
			// return
		
		console.log(target);
		console.log(this);

		// a new dialog should me made for each element, and should remember check boxes checked 
		$(".dialog").dialog({
			// autoOpen: true,
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
					if(sceneChecked==true){
						var tempElement = target;
						var option = {
								to: "#customSidebar",
								className: "ui-effects-transfer"
						};
						$(target).effect("transfer", option, 500);
						
						//make a new scene
					};
					if(activityChecked==true){
						//make a new activity
					};
					if(dialogChecked==true){
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
					if(pickUpChecked==true){
						//make an element pickable
					};
					if(animationChecked==true){
						//append animation on target
					}
					if(soundChecked==true){
						//append sound on target
					}
					
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

var sceneChecked = false;
var activityChecked = false;
var dialogChecked = false;
var pickUpChecked = false;
var animationChecked = false;
var soundChecked = false;

function OnChangeCheckBoxScene(){
	if(document.getElementById("scene").checked){
		$("#activity").attr("disabled", true);
		$("#pickUp").attr("disabled", true);
		sceneChecked = true;
	}
	else{
		sceneChecked = false;
		if(!pickUpChecked)
			$("#activity").attr("disabled", false);
		if(!activityChecked)
			$("#pickUp").attr("disabled", false);
	}
}

function OnChangeCheckBoxActivity(){
	if(document.getElementById("activity").checked){
		$("#scene").attr("disabled", true);
		$("#pickUp").attr("disabled", true);
		activityChecked = true;
	}
	else{
		activityChecked = false;
		
		if(!pickUpChecked)
			$("#scene").attr("disabled", false);
		if(!sceneChecked)
			$("#pickUp").attr("disabled", false);
	}
}
function OnChangeCheckBoxDialog(){
	if(document.getElementById("dialog").checked){
		$("#pickUp").attr("disabled", true);
		dialogChecked = true;
	}
	else{
		dialogChecked = false;
		if(!sceneChecked && !activityChecked)
			$("#pickUp").attr("disabled", false);
	}
}

function OnChangeCheckBoxPickUp(){
	if(document.getElementById("pickUp").checked){
		$("#scene").attr("disabled", true);
		$("#activity").attr("disabled", true);
		$("#dialog").attr("disabled", true);
		pickUpChecked = true;
	}
	else{
		pickUpChecked = false;
		
		if(!activityChecked)
			$("#scene").attr("disabled", false);
		if(!sceneChecked)
			$("#activity").attr("disabled", false);
		
		$("#dialog").attr("disabled", false);
	}
}
function OnChangeCheckBoxAnimation(){
	if(document.getElementById("animation").checked){
		animationChecked = true;
		$("#effectTypes").attr("disabled", false);
		$("#button").attr("disabled", false);
	}
	else{
		animationChecked = false;
		$("#effectTypes").attr("disabled", true);
		$("#button").attr("disabled", true);
	}
}
function OnChangeCheckBoxSound(){
	if(document.getElementById("sound").checked){
		soundChecked = true;
	}
	else{
		soundChecked = false;
	}
}

