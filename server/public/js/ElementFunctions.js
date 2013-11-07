function dialogFunction(e){
	$("#writtenText").val(objectList[inList(objectList,e.target)].dialogData);
	$(".writtenDialog").dialog({
		modal: true,
		buttons: {
			Ok: function(){
					$(this).dialog("close");
			}
		}
	}).siblings(".ui-dialog-titlebar").hide();
}

function animationFunction(e){
	runAnimationEffect(objectList[inList(objectList,e.target)]);
}

function mathActivityFunction(e){
	createMathActivity(objectList[inList(objectList,e.target)].activityObject);
}

function languageActivityFunction(){
	//dummy
}

function quizActivityFunction(){
	//dummy
}