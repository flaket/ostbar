function LanguageActivity(){
	
}

function createNewLanguageActivity(languageObject, isNewGame){
	
}

function createLanguageActivity(languageObject){

}

function initializeLanguageDialog(){
	var Wwidth = $(window).width();
	var Wheight = $(window).height();
	
	$(".languageActivity").dialog({
		rezisable: false,
		height: Wheight*0.8,
		width: Wwidth*0.7,
		position: {
			my: "center top",
			at: "center top",
			of: "#mainFrame"
		},
		show: {
			effect: "clip",
			duration: 500
		},
		hide: {
			effect: "clip",
			duration: 500
		}
	});
}