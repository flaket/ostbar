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
	
	$(".draggable").dblclick(function(){
		$(".dialog").dialog({
			title: "OST",
			resizable: false,
			show: {
				effect: "blind",
				duration: 500
			},
			modal: true,
			buttons: {
				"Confirm": function(){
					$(this).dialog("close");
					//må utføre sjekk for hva som er trykket og handle etter det
				},
				Cancel: function(){
					$(this).dialog("close");
				},
				"Delete": function(){
					//må få elementet til å forsvinne og legge til et element igjen
					$(this).dialog("close");
				}
			},
		});
	});
	
});

