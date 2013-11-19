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
			var div = '<div class="img-wrapper img-wrapper1" name="'+sceneId+'" style="width: 100%; height: 200px"><div class="img-container" style="width: 25%">';
			div += '<img name="' + scenetype.sceneTypeId + '" src="' + scenetype.backgroundAvatar.url + '" style="">';
			div += '</div>';

			for ( elementNr in scene.elements ){
				var element = scene.elements[ elementNr ];

				var names = new Array();
				for ( actionTypeNr in element.actionTypes ){
					var actionType = element.actionTypes[ actionTypeNr ];

					switch ( actionType.name ){
						case 'TO_ACTIVITY': names.push('Aktivitet'); break;
						case 'DIALOG': names.push('Dialog'); break;
						case 'ANIMATION': names.push('Animasjon'); break;
						case 'SCENE': names.push('Til scene'); break;
					}
				}

				div += '<div style="width: 75%; float: right;">' + names.toString() + '</div>';


				console.log('element', element);
			}

			div += '</div>';

			html += div;
		}
		$('#storylineDialog').html(html);

		$("#storylineDialog").dialog("open");
	});
});