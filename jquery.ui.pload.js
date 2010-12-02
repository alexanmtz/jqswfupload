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
	medias: {'image':0, 'video':0},
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
		rules: {
			'image' : {
				'fileTypes' : ['jpeg', 'jpg', 'png'],
				'limit' : 6
			},
			'video' : {
				'fileTypes' : ['mov'],
				'limit' : 1
			}
		},
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
	decrementCounter: function(file) {
		var self = this;
		var rules = this.options.rules;
		var found = false;
		var mediaType;
		$.each(rules, function(item,key){
			$.each(key.fileTypes, function(j,value){
				if(file.type==value) {
					found = true;
					mediaType = item;
				}
			});			
		});
		if(found) {
			self.medias[mediaType]--;
			delete self.files[file.index];
		}
	},
	queueFiles: function(file) {
		var self = this;
		var rules = this.options.rules;
		$.each(rules, function(item,key){
			self.swfu.setFileQueueLimit(item.limit);
			$.each(key.fileTypes, function(j,value){
				if(file.type==value && self.medias[item]  < key.limit ) {
					self.medias[item]++;
					self.files.push(file);
					self.insertFile(file);
				}
			});			
		});
		self.updateCounter();
	},
	insertFile: function(file) {
		$('.ui-widget-content').show();
		var name = '<span class="ui-pload-filename">' + file.name + '</span> ';
		var type = '<span class="ui-pload-filetype">' + file.type + '</span> ';
		var size = '<span class="ui-pload-filesize">' + file.size + '</span> ';
		var deleteButton = '<a href="#" class="ui-pload-delete">Apagar</a> ';
		$('<li id="'+file.id+'">'+ deleteButton + name + type + size +'</li>').appendTo('.ui-pload-file-list');
		this.deleteFileHandler(file.id);
	},
	deleteFileHandler: function(id) {
		var self = this;
		var file = self.getFile(id);
		$('a','#'+file.id).bind('click', function(e){
			self.swfu.cancelUpload(id);
			$(this).parent().remove();
			self.decrementCounter(file);
			self.updateCounter();
			return false;
		});
	},
	updateCounter: function() {
		$('.ui-pload-file-counter',this.element).show();
		$.each(this.medias, function(item,value){
			$('.ui-pload-current','.ui-pload-type-'+item).html(value);
		});
	},
	getFiles: function() {
		return this.files;
	},
	// fix a mac os bug that return empty the filetype
	getFile: function(id) {
		var newFile = this.swfu.getFile(id);
		if(!newFile.type) {
			var fileType = this.getFileType(newFile);
			newFile.type = fileType;					
		}
		return newFile;
	},
	startUpload: function() {
		this.swfu.startUpload();
	},
	_create: function() {
		var self = this;
		var op = self.options;
		this.element.append('<div id="jquery-ui-pload-flash-button"></div>');
		this.element.addClass('ui-widget ui-pload');

		//header
		var header = $('<div class="ui-widget-header ui-pload-file-counter"></div>');
		header.appendTo(this.element);
		var headerContent = '';
		$.each(this.medias,function(item,value){
			headerContent+= '<div class="ui-pload-type-'+ item +'"><span class="">'+item+'</span> <span class="ui-pload-current"></span> / <span class="ui-pload-total">'+ op.rules[item].limit +'</span></div>';			
		});
		$(headerContent).appendTo(header);
		header.hide();
		
		//content
		$('<div class="ui-widget-content"></div>').appendTo(this.element).hide();
		$('<ul class="ui-pload-file-list"></ul>').prependTo('.ui-widget-content');
		
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
			file_upload_limit : 0,
			file_queue_limit : 0,
			file_types : self.concatTypes(op.rules), 
			file_types_description : op.fileTypesDescription, 
			button_image_url : op.buttonImageUrl,
			swfupload_loaded_handler : function() {
				op.flashLoaded.call(this);
			},
			file_dialog_start_handler : function() {
				op.fileDialogStart.call(this);		
			},
			file_queued_handler : function(file) {
				var newFile = self.getFile(file.id);
				self.queueFiles(newFile);
				op.fileQueue.call(this, newFile);
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
	destroy: function() {
		this.files = [];
		this.swfu.destroy();
		this.element.empty();
		$.Widget.prototype.destroy.apply( this, arguments );
	},
	getInstance: function() {
		return this.swfu;
	}
});

$.extend( $.ui.pload, {
	version: "@VERSION"
});
})(jQuery);
