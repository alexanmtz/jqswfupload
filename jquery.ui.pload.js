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
	swfu: null,
	options: {
		url: '/upload/',
		flashUrl: 'libs/swfupload.swf',
		fileSize: "20 MB",
		buttonImageUrl: 'http://r9.room9.co.nz/swfupload/images/upload_button.png',
		buttonText: '<span class="text">Hello</span>',
		buttonWidth: 178,
		buttonHeight: 30,
		style: '.text {color: black; font-size: 16pt;}',
		multiple: true,
		fileTypes: "*.*",
		fileTypesDescription: 'choose file(s)',
		fileUploadLimit: 10,
		fileQueueLimit: 2,
		loaded: function(){},
		debug: false
	},
	_create: function() {
		var el = $(this.element);
		el.append('<div id="jquery-ui-pload-flash-button"></div>');
		var swfOptions = {
	        upload_url: this.options.url,
	        flash_url: this.options.flashUrl,
			button_placeholder_id: 'jquery-ui-pload-flash-button',
			button_text : this.options.buttonText,
			button_text_style : this.options.style, 
			file_types : this.options.fileType,
			file_types_description: this.options.fileTypeDescription,
			button_action : this.options.multiple ? SWFUpload.BUTTON_ACTION.SELECT_FILES : SWFUpload.BUTTON_ACTION.SELECT_FILES, 
	        file_size_limit: this.options.fileSize,
			button_width : this.options.buttonWidth,
			button_height : this.options.buttonHeight,
			button_image_url : this.options.buttonImageUrl,
			file_upload_limit : this.options.fileUploadLimit,
			file_queue_limit : this.options.fileQueueLimit,
			swfupload_loaded_handler : this.options.loaded.call(this),
			debug : this.options.debug
		};
        this.swfu = new SWFUpload(swfOptions);
	},
	getInstance: function() {
		return this.swfu;
	}

});

$.extend( $.ui.pload, {
	version: "@VERSION"
});
})(jQuery);
