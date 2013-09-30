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
	
//	$(".dialog").append(
//			'<input id="scene" type ="checkbox" name="to_scene" /> To Scene <br>',
//			'<input id="activity" type ="checkbox" name="to_activity" /> To Activity <br>',
//			'<input id="dialog" type ="checkbox" name="dialog" /> Dialog <br>',
//			'<input id="pickUp" type ="checkbox" name="pick_up" /> Pick Up <br>',
//			'<input id="animation" type ="checkbox" name="animation" /> Animation <br>',
//			'<input id="sound" type ="checkbox" name="sound" /> Sound <br>'
//	);
	
	$(".draggable").dblclick(function(e){	
		var name = e.target.name;
		var target = e.target;
		alert(target);
		
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
					// if(document.getElementById("scene").checked){
						// $("#activity").attr("disabled", true);
						// $("#pickUp").attr("disabled", true);
						
						// // make a new scene here
					// }
					// else{
						// $("#activity").attr("disabled", false);
						// $("#pickUp").attr("disabled", false);
					// }
					// if(document.getElementById("activity").checked){
						// $("#scene").attr("disabled", true);
						// $("#pickUp").attr("disabled", true);

						// // make a new activity here
					// }
					// else{
						// $("#scene").attr("disabled", false);
						// $("#pickUp").attr("disabled", false);
					// }
					
					// if(document.getElementById("dialog").checked){
						// $("#pickUp").attr("disabled", true);

						// // make a new dialog here
					// }
					// else{
						// $("#pickUp").attr("disabled", false);
					// }
					// if(document.getElementById("pickUp").checked){
						// $("#scene").attr("disabled", true);
						// $("#activity").attr("disabled", true);
						// $("#dialog").attr("disabled", true);

						// // make an element pickable here
					// }
					// else{
						// $("#scene").attr("disabled", false);
						// $("#activity").attr("disabled", false);
						// $("#dialog").attr("disabled", false);
					// }
					// if(document.getElementById("animation").checked){
						
						// // do some animation here
						
					// }
					// if(document.getElementById("sound").checked){
						
						// // play a sound here
						
					// }
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
		
	}
	else{
	}
}
function OnChangeCheckBoxSound(){
	if(document.getElementById("sound").checked){
		
		// play a sound here
		
	}
	else{
	}
}

