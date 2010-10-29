/*
 * jQuery UI Upload 0.1
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 *   jquery.ui.progressbar.js
 *   jquery.ui.button.js
 */

(function( $, undefined ) {

$.widget( "ui.pload", {
	options: {
		url: '/upload/'
	},
	_create: function() {
		
	}

});

$.extend( $.ui.pload, {
	version: "0.1"
});

})( jQuery );