/* Public setting */
var container = document.getElementById("container");
var contents = document.getElementById("contents");

var scale = 0;
var scaleTop = 0;
var scaleLeft = 0;



/* Preferences Start */
function containerSize()
{
	var popupWidth = window.innerWidth
	var popupHeight = window.innerHeight;

	scale = popupWidth / 1536;

	scaleTop = 0;
	scaleLeft = 0;

	if ((popupHeight / scale) <960)
	    {
	        scale = popupHeight /960;
	        scaleLeft = ( popupWidth - 1536*scale ) / 2 ;

	        contents.style.top = "0px";

	       contents.style.left = scaleLeft + "px";
	    }
	    else
	    {
	        scale = popupWidth / 1536;
	        scaleTop = ( popupHeight -960*scale ) / 2 ;

	        contents.style.left = "0px";

	        contents.style.top = scaleTop + "px";
	    }


	$(contents).css("transform-origin", "0 0" );
	$(contents).css("transform", "scale("+scale+")" );

	$.ui.ddmanager.prepareOffsets = function( t, event ) {
		var i, j,
			m = $.ui.ddmanager.droppables[ t.options.scope ] || [],
			type = event ? event.type : null, // workaround for #2317
			list = ( t.currentItem || t.element ).find( ":data(ui-droppable)" ).addBack();
	
		droppablesLoop: for ( i = 0; i < m.length; i++ ) {
	
			// No disabled and non-accepted
			if ( m[ i ].options.disabled || ( t && !m[ i ].accept.call( m[ i ].element[ 0 ], ( t.currentItem || t.element ) ) ) ) {
				continue;
			}
	
			// Filter out elements in the current dragged item
			for ( j = 0; j < list.length; j++ ) {
				if ( list[ j ] === m[ i ].element[ 0 ] ) {
					m[ i ].proportions().height = 0;
					continue droppablesLoop;
				}
			}
	
			m[ i ].visible = m[ i ].element.css( "display" ) !== "none";
			if ( !m[ i ].visible ) {
				continue;
			}
	
			// Activate the droppable if used directly from draggables
			if ( type === "mousedown" ) {
				m[ i ]._activate.call( m[ i ], event );
			}
	
			m[ i ].offset = m[ i ].element.offset();
			m[ i ].proportions({ width: m[ i ].element[ 0 ].offsetWidth * scale, height: m[ i ].element[ 0 ].offsetHeight * scale });
		}
	
	};
}

$(document).ready(function(){

        containerSize();
        $( window ).resize( function() {
            containerSize();
        });

   
})


