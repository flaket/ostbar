function dialogFunction(e){
	$("#writtenText").val(currentObjectList.objectList[inList(currentObjectList.objectList,e.target)].dialogData);
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
	runAnimationEffect(currentObjectList.objectList[inList(currentObjectList.objectList,e.target)]);
}

function mathActivityFunction(e){
	createMathActivity(currentObjectList.objectList[inList(currentObjectList.objectList,e.target)].activityObject);
}

function languageActivityFunction(){
	//dummy
}

function quizActivityFunction(){
	//dummy
}