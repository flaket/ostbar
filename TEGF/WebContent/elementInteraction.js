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
					
					// these checks should be done somewhere else
					if(document.getElementById("scene").checked){
						$("#activity").attr("disabled", true);
						$("#pickUp").attr("disabled", true);
						
						// make a new scene here
						
						$("#activity").attr("disabled", false);
						$("#pickUp").attr("disabled", false);
					}
					if(document.getElementById("activity").checked){
						$("#scene").attr("disabled", true);
						$("#pickUp").attr("disabled", true);

						// make a new activity here
						
						$("#scene").attr("disabled", false);
						$("#pickUp").attr("disabled", false);
					}
					if(document.getElementById("dialog").checked){
						$("#pickUp").attr("disabled", true);

						// make a new dialog here
						
						$("#pickUp").attr("disabled", false);
					}
					if(document.getElementById("pickUp").checked){
						$("#scene").attr("disabled", true);
						$("#activity").attr("disabled", true);
						$("#dialog").attr("disabled", true);

						// make an element pickable here
						
						$("#scene").attr("disabled", false);
						$("#activity").attr("disabled", false);
						$("#dialog").attr("disabled", false);
					}
					if(document.getElementById("animation").checked){
						
						// do some animation here
						
					}
					if(document.getElementById("sound").checked){
						
						// play a sound here
						
					}
//					$(this).dialog("close");
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
	    // run the currently selected effect
	    function runEffect() {
	      // get effect type from
	      var selectedEffect = $( "#effectTypes" ).val();
	 
	      // run the effect
	      $( ".draggable" ).effect( selectedEffect, 500, callback );
	    };
	 
	    // callback function to bring a hidden box back
	    function callback() {
	      setTimeout(function() {
	        $( ".draggable" ).removeAttr( "style" ).hide().fadeIn();
	      }, 1000 );
	    };
	 
	    // set effect from select menu value
	    $( "#button" ).click(function() {
	      runEffect();
	      return false;
	    });
	  });
	
	
});

