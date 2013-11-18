function sceneFunction(e){
	console.log("such scene, wow")
}

function dialogFunction(e){
	$("#writtenText").val(currentObjectList.objectList[inList(currentObjectList.objectList,e.target)].dialogData);
	$(".writtenDialog").dialog({
		modal: true,
		height: $(window).height()*0.5,
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
	console.log("clicked me");
	createMathActivity(currentObjectList.objectList[inList(currentObjectList.objectList,e.target)].activityObject);
}

function languageActivityFunction(){
	createLanguageActivity(currentObjectList.objectList[inList(currentObjectList.objectList, e.target)].activityObject);
}

function quizActivityFunction(e){
	createQuizActivity(currentObjectList.objectList[inList(currentObjectList.objectList, e.target)].activityObject);
}