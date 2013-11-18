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
		for ( sceneNr in sceneList ){
			var scene = sceneList[ sceneNr ];
			var scenetype = scene.sceneType;
			var sceneId = scene.sceneId;
			var div = '<div class="img-wrapper img-wrapper1" name="'+sceneId+'"><div class="img-container">';
			div += '<img name="' + scenetype.sceneTypeId + '" src="' + scenetype.backgroundAvatar.url + '" width ="200" height="200">';
			div += '</div>';

			for ( elementNr in scene.elements ){
				var element = scene.elements[ elementNr ];
				for ( actionTypeNr in element.actionTypes ){
					var actionType = element.actionTypes[ actionTypeNr ];

					if ( actionType.name == 'TO_ACTIVITY' ){
						div += '<div style="padding-top: 200;">actionType</div>';
						console.log('has action type TO_ACTIVITY');
					}
				}
			}

			div += '</div>';

			html += div;
		}
		$('#storylineDialog').html(html);

		$("#storylineDialog").dialog("open");
	});
});