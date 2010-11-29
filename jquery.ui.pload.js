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
	selected: 0,
	files: [],
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
		files: "*.*",
		fileTypesDescription: 'choose file(s)',
		flashLoaded: function(){},
		fileDialogStart: function() {},
		fileQueue: function() {},
		fileQueueError: function() {},
		fileDialogComplete: function(){},
		uploadError: function() {},
		debug: false
	},
	concatTypes: function(types) {
		if(typeof types == 'string') {
			return types;	
		} else {
			var typesCont = '';
			$.each(types, function(i, value){
				$.each(types[i].fileTypes, function(i,value){
					typesCont+= '*.' + value + '; ';				
				});
			});
			return typesCont.substring(0, typesCont.length-2);
		}
	},
	getFileType: function(file){
		if (file.type ==""){
			return file.name.match(/([^\/\\]+)\.(\w+)$/)[2];
		}else{
			return file.type.substring(1, file.type.length);
		}
	},
	queueFiles: function(file) {
		$.each(this.files,function(i,value){
			
			if(this.files[i].id != file.id) {
				this.files.push(file);
			}			
		});
	},
	getFiles: function() {
		return this.files;
	},
	_create: function() {
		var el = $(this.element);
		var self = this;
		var op = self.options;
		el.append('<div id="jquery-ui-pload-flash-button"></div>');
		el.addClass('ui-widget ui-pload');
		var swfOptions = {
	        upload_url: op.url,
	        flash_url: op.flashUrl,
			button_placeholder_id: 'jquery-ui-pload-flash-button',
			button_text : op.buttonText,
			button_text_style : op.style, 
			button_text_top_padding: op.buttonTextTopPadding,
			button_action : op.multiple ? SWFUpload.BUTTON_ACTION.SELECT_FILES : SWFUpload.BUTTON_ACTION.SELECT_FILES, 
	        file_size_limit: op.fileSize,
			button_width : op.buttonWidth,
			button_height : op.buttonHeight,
			file_upload_limit : 10,
			file_queue_limit : 10,
			file_types : self.concatTypes(op.files), 
			file_types_description : op.fileTypesDescription, 
			button_image_url : op.buttonImageUrl,
			swfupload_loaded_handler : function() {
				op.flashLoaded.call(this);
			},
			file_dialog_start_handler : function() {
				op.fileDialogStart.call(this);		
			},
			file_queued_handler : function(file) {
				fileType = self.getFileType(file);
				file.type = fileType;
				self.queueFiles(file);
				op.fileQueue.call(this, file);
			},
			file_queue_error_handler: function(file, error, msg) {
				op.fileQueueError.call(this, file, error, msg);
			},
			file_dialog_complete_handler : function(selected, queued, total){
				self.selected += selected;
				if(selected) {
					$('.ui-widget-header').remove();
					var files = op.files;
					var header = $('<div class="ui-widget-header"></div>');
					$(header).appendTo(el);
					$.each(files,function(i,value){
						$('<h3>'+i+'</h3><span class="ui-pload-selected"></span> / <span class="ui-pload-limit">'+ files[i].limit +'</span>').appendTo('.ui-widget-header');						
					});
				}
				op.fileDialogComplete.call(this, selected, queued, total);
			},
			upload_error_handler: function(file, error, msg) {
				op.uploadError.call(this, file, error, msg);
				console.info(error);
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
