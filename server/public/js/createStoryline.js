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
		var html = '';
		for (key in sceneList){
			var scene = sceneList[ key ];
			var scenetype = scene.sceneType;
			var sceneId = scene.sceneId;
			var div = '<div class="img-wrapper img-wrapper1" name="'+sceneId+'"><div class="img-container">';
			div += '<img name="' + scenetype.sceneTypeId + '" src="' + scenetype.backgroundAvatar.url + '" width ="200" height="200">';
			div += '</div></div>';

			html += div;

			console.log('scene', scene);
			for ( key in scene.elements ){
				var element = scene.elements[ key ];
				console.log('element', element);
				if ( element.actionTypes.length ){

				}
			}
		}
		$('#storylineDialog').html(html);

		$("#storylineDialog").dialog("open");
	});
});