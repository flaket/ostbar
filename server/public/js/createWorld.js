$(function createNewWorldView(){
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