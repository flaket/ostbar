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
    	},
    	buttons: {
    		'Lukk': function (){
    			$( this ).dialog( 'close' ); 
    		}
    	}
	});
	
	$("#storylineButton").on("click", function(){
		getUpdatedElements( function ( error, success ){
			if ( error ) return;

			var html = '';
		
			for ( sceneNr in sceneList ){
				var scene = sceneList[ sceneNr ];
				var scenetype = scene.sceneType;
				var sceneId = scene.sceneId;
				var div = '<div class="img-wrapper img-wrapper1" name="'+sceneId+'" style="width: 100%; height: 200px"><div class="img-container" style="width: 25%">';
				div += '<img name="' + scenetype.sceneTypeId + '" src="' + scenetype.backgroundAvatar.url + '" style="">';
				div += '</div>';

				var names = {};

				for ( elementNr in scene.elements ){
					var element = scene.elements[ elementNr ];


					for ( actionTypeNr in element.actionTypes ){
						var actionType = element.actionTypes[ actionTypeNr ];

						var name;

						switch ( actionType.name ){
							case 'TO_ACTIVITY': name = 'Aktivitet'; break;
							case 'DIALOG': name = 'Dialog'; break;
							case 'ANIMATION': name = 'Animasjon'; break;
							case 'TO_SCENE': name = 'Til scene'; break;
						}


						if ( names.hasOwnProperty( name ) ){
							names[name]++;
						} else {
							names[name] = 1;
						}
					}
				}

				var namesString = "";

				for ( prop in names ){
					var count = names[prop];

					// console.log('count is', count, 'for', prop);

					namesString += prop;
					if ( count > 1 ) namesString += ' (' + count + ')';
					namesString += '<br>';
				}

				div += '<div style="width: 75%; float: right;">' + namesString + '</div>';

				div += '</div>';

				html += div;
			}
			$('#storylineDialog').html(html);

			$("#storylineDialog").dialog("open");
		});
	});
});