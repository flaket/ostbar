// function for running animation
function runAnimationEffect(e) {
	var selectedEffect = $("#effectTypes").prop("selectedIndex",e.animationIndex).val(); 
	$(e.div).effect( selectedEffect, 500, animationCallback(e.div));
};
function animationCallback(e) {
	setTimeout(function() {
		$(e).fadeIn();
	}, 1000 );
};