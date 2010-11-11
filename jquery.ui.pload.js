/*
 * jQuery UI Upload @VERSION
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
		url: '/upload/',
		flashUrl: 'swfupload.js',
		fileSize: "20 MB" 
	},
	_create: function() {
		var swfOptions = {
	        upload_url: this.options.url,
	        flash_url: this.options.flashUrl,
	        button_placeholder_id: $(this.element).attr('id'),
	        file_size_limit: this.options.fileSize
		};
        var swfu = new SWFUpload(swfOptions);
	}

});

$.extend( $.ui.pload, {
	version: "@VERSION"
});
})(jQuery);
