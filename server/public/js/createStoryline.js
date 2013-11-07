$(function createStorylineView(){
	
	$("#storylineDialog").dialog({
		autoOpen: false,
		width: 900,
		height: 500,
		show: {
	        effect: "clip",
	        duration: 300
		},
		hide: {
	      effect: "clip",
	      duration: 300
    	}
	});
	
	$("#storylineButton").on("click", function(){
		$("#storylineDialog").dialog("open");
	});
});