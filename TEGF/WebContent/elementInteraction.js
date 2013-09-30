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

function OnChangeCheckBoxScene(){
	if(document.getElementById("scene").checked){
		$("#activity").attr("disabled", true);
		$("#pickUp").attr("disabled", true);
		
		// make a new scene here
	}
	else{
		$("#activity").attr("disabled", false);
		$("#pickUp").attr("disabled", false);
	}
}

function OnChangeCheckBoxActivity(){
	if(document.getElementById("activity").checked){
		$("#scene").attr("disabled", true);
		$("#pickUp").attr("disabled", true);

		// make a new activity here
	}
	else{
		$("#scene").attr("disabled", false);
		$("#pickUp").attr("disabled", false);
	}
}
function OnChangeCheckBoxDialog(){
	if(document.getElementById("dialog").checked){
	$("#pickUp").attr("disabled", true);

	// make a new dialog here
	}
	else{
		$("#pickUp").attr("disabled", false);
	}
}

function OnChangeCheckBoxPickUp(){
	if(document.getElementById("pickUp").checked){
		$("#scene").attr("disabled", true);
		$("#activity").attr("disabled", true);
		$("#dialog").attr("disabled", true);

		// make an element pickable here
	}
	else{
		$("#scene").attr("disabled", false);
		$("#activity").attr("disabled", false);
		$("#dialog").attr("disabled", false);
	}
}
function OnChangeCheckBoxAnimation(){
	if(document.getElementById("animation").checked){
		// do some animation here
		$("#effectTypes").attr("disabled", false);
		$("#button").attr("disabled", false);
	}
	else{
		$("#effectTypes").attr("disabled", true);
		$("#button").attr("disabled", true);
	}
}
function OnChangeCheckBoxSound(){
	if(document.getElementById("sound").checked){
		
		// play a sound here
		
	}
	else{
	}
}

