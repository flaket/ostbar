function Dialog(object){
	this.sceneChecked = false;
	this.activityChecked = false;
	this.dialogChecked = false;
	this.pickUpChecked = false;
	this.animationChecked = false;
	this.animationIndex = 0;
	this.soundChecked = false;
	
	this.dialogData = "";
	this.div = object;
	this.element_id = -1;
	
	this.activityObject = null;
	this.activityIndex = -1;
	
	this.animationClickActionMade = false;
	this.dialogClickActionMade = false;
	this.activityClickActionMade = false;
}

function inList(arr,obj){
	for(var i = 0; i <arr.length; i++){
		if(arr[i].div == obj) return i;
	}
	return -1;
}

function resetCheckBoxes(dialogObject){
	if(dialogObject.activityChecked){ $("#activity").prop("checked",true);}
	else{ $("#activity").prop("checked",false);}
	
	if(dialogObject.sceneChecked){ $("#scene").prop("checked",true);}
	else{ $("#scene").prop("checked",false);}
	
	if(dialogObject.pickUpChecked){ $("#pickUp").prop("checked",true);}
	else{ $("#pickUp").prop("checked",false);}
	
	if(dialogObject.dialogChecked){ $("#dialog").prop("checked",true);}
	else{ $("#dialog").prop("checked",false);}
	
	if(dialogObject.animationChecked){ $("#animation").prop("checked",true);}
	else{ $("#animation").prop("checked",false);}
	
	if(dialogObject.soundChecked){ $("#sound").prop("checked",true);}
	else{ $("#sound").prop("checked",false);}
	
	OnChangeCheckBoxScene();
	OnChangeCheckBoxActivity();
	OnChangeCheckBoxDialog();
	OnChangeCheckBoxPickUp();
	OnChangeCheckBoxAnimation();
	OnChangeCheckBoxSound();
	
	$("#dialogText").val(dialogObject.dialogData);
	$("#effectTypes").prop("selectedIndex",dialogObject.animationIndex);
}

function OnChangeCheckBoxScene(){
	if(document.getElementById("scene").checked){
		$("#activity").attr("disabled", true);
		$("#pickUp").attr("disabled", true);
		currentDialog.sceneChecked = true;
	}
	else{
		currentDialog.sceneChecked = false;
		if(!currentDialog.pickUpChecked)
			$("#activity").attr("disabled", false);
		if(!currentDialog.activityChecked)
			$("#pickUp").attr("disabled", false);
	}
}

function OnChangeCheckBoxActivity(){
	if(document.getElementById("activity").checked){
		$("#scene").attr("disabled", true);
		$("#pickUp").attr("disabled", true);
		currentDialog.activityChecked = true;
	}
	else{
		currentDialog.activityChecked = false;
		
		if(!currentDialog.pickUpChecked)
			$("#scene").attr("disabled", false);
		if(!currentDialog.sceneChecked)
			$("#pickUp").attr("disabled", false);
	}
}

function OnChangeCheckBoxDialog(){
	if(document.getElementById("dialog").checked){
		$("#pickUp").attr("disabled", true);
		currentDialog.dialogChecked = true;
	}
	else{
		currentDialog.dialogChecked = false;
		if(!currentDialog.sceneChecked && !currentDialog.activityChecked)
			$("#pickUp").attr("disabled", false);
	}
}

function OnChangeCheckBoxPickUp(){
	if(document.getElementById("pickUp").checked){
		$("#scene").attr("disabled", true);
		$("#activity").attr("disabled", true);
		$("#dialog").attr("disabled", true);
		currentDialog.pickUpChecked = true;
	}
	else{
		currentDialog.pickUpChecked = false;
		
		if(!currentDialog.activityChecked)
			$("#scene").attr("disabled", false);
		if(!currentDialog.sceneChecked)
			$("#activity").attr("disabled", false);
		
		$("#dialog").attr("disabled", false);
	}
}

function OnChangeCheckBoxAnimation(){
	if(document.getElementById("animation").checked){
		currentDialog.animationChecked = true;
		$("#effectTypes").attr("disabled", false);
		$("#animationTestButton").attr("disabled", false);
	}
	else{
		currentDialog.animationChecked = false;
		$("#effectTypes").attr("disabled", true);
		$("#animationTestButton").attr("disabled", true);
	}
}

function OnChangeAnimationList(){
	currentDialog.animationIndex = document.getElementById("effectTypes").selectedIndex;
}

function OnChangeCheckBoxSound(){
	if(document.getElementById("sound").checked){
		currentDialog.soundChecked = true;
	}
	else{
		currentDialog.soundChecked = false;
	}
}