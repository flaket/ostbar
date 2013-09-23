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
		var src = $('img').attr('src').split('/');
		var name = src[src.length-1].split('.')[0];
		
		$(".dialog").dialog({
			title: name,
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
					$(e.target).remove();
					$(this).dialog("close");
				}
			}
		});
	});
	
});

