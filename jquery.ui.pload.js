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
		buttonImageUrl: 'btn-pload-select.png',
		buttonText: '<span class="text">Hello</span>',
		buttonWidth: 178,
		buttonHeight: 30,
		buttonTextTopPadding: 5, 
		style: '.text {color: black; font-weight: bold; font-size: 16pt; text-align:center;margin-top:15px;}',
		multiple: true,
		fileTypes: "*.*",
		fileTypesDescription: 'choose file(s)',
		fileUploadLimit: 10,
		fileQueueLimit: 2,
		flashLoaded: function(){},
		fileDialogStart: function() {},
		fileQueue: function() {},
		fileQueueError: function() {},
		fileDialogComplete: function(){},
		uploadError: function() {},
		debug: false
	},
	_create: function() {
		var el = $(this.element);
		var self = this;
		var op = self.options;
		el.append('<div id="jquery-ui-pload-flash-button"></div>');
		var swfOptions = {
	        upload_url: this.options.url,
	        flash_url: this.options.flashUrl,
			button_placeholder_id: 'jquery-ui-pload-flash-button',
			button_text : this.options.buttonText,
			button_text_style : this.options.style, 
			button_text_top_padding: this.options.buttonTextTopPadding,
			file_types : this.options.fileType,
			file_types_description: this.options.fileTypeDescription,
			button_action : this.options.multiple ? SWFUpload.BUTTON_ACTION.SELECT_FILES : SWFUpload.BUTTON_ACTION.SELECT_FILES, 
	        file_size_limit: this.options.fileSize,
			button_width : this.options.buttonWidth,
			button_height : this.options.buttonHeight,
			button_image_url : this.options.buttonImageUrl,
			file_upload_limit : this.options.fileUploadLimit,
			file_queue_limit : this.options.fileQueueLimit,
			swfupload_loaded_handler : function() {
				op.flashLoaded.call(this);
			},
			file_dialog_start_handler : function() {
				op.fileDialogStart.call(this);		
			},
			file_queue_handler : function(file) {
				op.fileQueue.call(this, file);
			},
			file_queue_error_handler: function(file, error, msg) {
				op.fileQueueError.call(this, file, error, msg);
			},
			file_dialog_complete_handler : function(selected, queued, total){
				op.fileDialogComplete.call(this, selected, queued, total);
			},
			upload_error_handler: function(file, error, msg) {
				op.uploadError.call(this, file, error, msg);
			},
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
