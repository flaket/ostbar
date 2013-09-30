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
			});
		}
	});
	
	$(".draggable").tooltip({
		
	});
	
	$(".draggable").dblclick(function(e){	
		var name = e.target.name;
		var target = e.target;
		
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
					$(this).dialog("close");
				},
				Cancel: function(){
					$(this).dialog("close");
				},
				"Delete": function(){
					$('input[type=checkbox]').attr('checked', false);
					$(target).remove();
					$(this).dialog("close");
				}
			}
		});
	});
	
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
		// make a new scene here
		var option = {
				to: "#customSidebar",
				className: "ui-effects-transfer"
		};
		$(".draggable").effect("transfer", option, 500);
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
		// make a new activity here
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
	// make a new dialog here
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
		// make an element pickable here
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
		// do some animation here
		
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
		// play a sound here
		
	}
	else{
		soundChecked = false;
	}
}

