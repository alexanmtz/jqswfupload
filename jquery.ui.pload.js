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
	files: [],
	medias: {},
	progress: {
		file: null,
		fileSize: 0,
		current: 0,
		percent: 0,
		total: 0
	},
	options: {
		url: '/upload/',
		flashUrl: 'libs/swfupload.swf',
		postParams: {},
		buttonImageUrl: 'btn-pload-select.png',
		buttonText: '<span class="text">Select File(s)</span>',
		buttonWidth: 178,
		buttonHeight: 30,
		buttonTextTopPadding: 5, 
		style: '.text {color: black; font-weight: bold; font-size: 16pt; text-align:center;margin-top:15px;}',
		multiple: true,
		rules: {
			'image' : {
				'fileTypes' : ['jpeg', 'jpg', 'png'],
				'limit' : 6,
				'size' : '200 KB'
			},
			'video' : {
				'fileTypes' : ['mov'],
				'limit' : 1,
				'size' : '20 MB'
			}
		},
		fileTypesDescription: 'choose file(s)',
		fileSizeWarning: 'The limit of <strong>{limit}</strong> was reached',
		flashLoaded: function(){},
		fileDialogStart: function() {},
		fileQueue: function() {},
		fileQueueError: function() {},
		fileUploadProgress: function() {},
		fileDialogComplete: function(){},
		fileUploadSuccess: function(){},
		fileUploadComplete: function() {},
		fileUploadError: function() {},
		uploadStart: function(){},
		uploadProgress: function() {},
		uploadComplete: function() {},
		debug: false
	},
	_create: function() {
		var self = this;
		var op = self.options;
		this.element.append('<div id="jquery-ui-pload-flash-button"></div>');
		this.element.addClass('ui-widget ui-pload');
		
		$.each(self.options.rules, function(item,value){
			self.medias[item] = 0;
		});
		
		//header
		var header = $('<div class="ui-widget-header ui-corner-tl ui-corner-tr ui-pload-file-counter"></div>');
		header.appendTo(this.element);
		var headerContent = '';
		$.each(this.medias,function(item,value){
			headerContent+= '<div class="ui-pload-type ui-pload-type-'+ item +'"><span class="ui-pload-type-name"><span>'+item+'</span></span> <span class="ui-pload-current"></span> / <span class="ui-pload-total">'+ op.rules[item].limit +'</span></div>';			
		});
		$(headerContent).appendTo(header);
		header.hide();
		
		//content
		$('<div class="ui-widget-content ui-corner-bl ui-corner-br"></div>').appendTo(this.element).hide();
		$('<ul class="ui-pload-file-list"></ul>').prependTo('.ui-widget-content');
		
		var swfOptions = {
	        post_params: op.postParams,
			upload_url: op.url,
	        flash_url: op.flashUrl,
			button_placeholder_id: 'jquery-ui-pload-flash-button',
			button_text : op.buttonText,
			button_text_style : op.style, 
			button_text_top_padding: op.buttonTextTopPadding,
			button_action : op.multiple ? SWFUpload.BUTTON_ACTION.SELECT_FILES : SWFUpload.BUTTON_ACTION.SELECT_FILES, 
	        file_size_limit: 0,
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
			upload_start_handler: function(file) {
				op.uploadStart.call(this,file);
			},
			upload_progress_handler: function(file, bytes, total) {
				self.progress.fileSize = total;
				op.fileUploadProgress.call(this,file,bytes,total); 
			},
			upload_success_handler: function(file,data,response) {
				op.fileUploadSuccess.call(this,file,data,response);
			},
			upload_complete_handler: function(file) {
				self.progress.file = file.name;
				self.progress.current += self.progress.fileSize;
				self.progress.percent = Math.ceil((self.progress.current / self.progress.total) * 100);
				op.uploadProgress.call(this, self.progress.percent, self.progress.file);
				self.removeFromQueue(file);
				self.startUpload(file);
				if(!self.files.length) {
					// force progress complete for browser issues
					self.progress.percent = 100;
					op.uploadComplete.call(this);
				}
				op.fileUploadComplete.call(this,file);
			},
			upload_error_handler: function(file, error, msg) {
				op.fileUploadError.call(this, file, error, msg);
			},
			debug : this.options.debug
		};
        this.swfu = new SWFUpload(swfOptions);
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
	convertSize: function(n) {
		var s = ['B', 'KB', 'MB', 'GB'];
        if (!Array.indexOf) {
            Array.prototype.indexOf = function(obj){
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == obj) {
                        return i;
                    }
                }
                return -1;
            }
        }
        if(typeof n == 'string'){
			var sizeArray = n.split(' ');
			var indexUnit = s.indexOf(sizeArray[1]);
			return Math.round(sizeArray[0]*(Math.pow(1024,indexUnit)));
			
		} else {
			if (n) {
	            var e = Math.floor(Math.log(n) / Math.log(1024));
	            var converted = (n / Math.pow(1024, Math.floor(e))).toFixed(2);
				return Math.ceil(converted,2)  + ' ' + s[e];
        	}
	        else {
	            return 0;
	        }	
		}
		

	},
	fileSplit: function(word, len) {
        var trunc = word;
        m = trunc.match(/([^\/\\]+)\.(\w+)$/);
        if (m[1].length > len) {
            trunc = m[1].substring(0, len);
            trunc = trunc.replace(/w+$/, '');
            trunc += '(...)';
            return trunc + '.' + m[2];
        }
        return trunc;

	},
	getFileType: function(file){
		if (file.type ==""){
			return file.name.match(/([^\/\\]+)\.(\w+)$/)[2];
		}else{
			return file.type.substring(1, file.type.length);
		}
	},
	decrementMediaCounter: function(file) {
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
		}
	},
	getFileGroup: function(file) {
		var self = this;
		var rules = this.options.rules;
		var type;
		$.each(rules, function(item,key){
			$.each(key.fileTypes, function(j,value){
				if(file.type==value) {
					type = item;
				}
			});			
		});
		return type;
	},
	queueFiles: function(file) {
		var self = this;
		var rules = this.options.rules;
		$.each(rules, function(item,key){
			$.each(key.fileTypes, function(j,value){
				if(file.type==value) {
					if(self.medias[item]  < key.limit) {
						if(file.size < self.convertSize(key.size)) {
							self.medias[item]++;
							self.files.push(file);
							self.insertFile(file, false);
							self.progress.total += file.size;							
						} else {
							self.insertFile(file, true);
							self.swfu.cancelUpload(file.id);
						}
					} else {
						self.swfu.cancelUpload(file.id);
					}
					
				}
			});			
		});
		self.updateCounter();
	},
	removeFromQueue: function(file){
		var index = -1;
		$.each(this.files,function(i,obj){
			if(obj.id == file.id) {
				index = i;
			}
		});
		
		this.files.splice(index,1);
	},
	insertFile: function(file, invalid) {
		$('.ui-widget-content').show();
		var fileGroup = this.getFileGroup(file);
		var fileInvalid = invalid ? 'class="ui-pload-file-invalid"' : 'class="ui-pload-file"'; 
		var name = '<span class="ui-pload-filename">' + this.fileSplit(file.name, 20) + '</span> ';
		var type = '<span class="ui-pload-filetype">' + file.type + '</span>';
		var size = '<span class="ui-pload-filesize">' + this.convertSize(file.size) + '</span> ';
		var invalidText = invalid ? ' <div class="ui-pload-invalid-text ui-state-error ui-corner-all"><p><span class="ui-icon ui-icon-alert"></span>' + this.options.fileSizeWarning.replace('{limit}', this.options.rules[fileGroup].size) + '</p></div>' : '';
		var deleteButton = '<a href="#" title="remove file" class="ui-pload-delete ui-state-default ui-corner-all"><span class="ui-icon ui-icon-trash">Apagar</span></a> ';
		$('<li id="'+file.id+'" '+ fileInvalid +'>'+ deleteButton +  '<div class="ui-pload-fileinfo">' + name + ' (' + type + ') ' + size + '</div>' +invalidText + '</li>').appendTo('.ui-pload-file-list');
		this.deleteFileHandler(file.id);
	},
	deleteFileHandler: function(id) {
		var self = this;
		var file = self.getFile(id);
		$('a','#'+file.id).bind('click', function(e){
			self.swfu.cancelUpload(id);
			var parent = $(this).parent().remove();
			self.removeFromQueue(file);
			if(!parent.hasClass('ui-pload-file-invalid')) {
				self.decrementMediaCounter(file);
				self.updateCounter();				
			}
			return false;
		}).hover(function(){
			$(this).addClass('ui-state-hover');
		},function(){
			$(this).removeClass('ui-state-hover');
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
		var fileType = this.getFileType(newFile);
		newFile.type = fileType;					
		return newFile;
	},
	startUpload: function(file) {
		this.swfu.startUpload();
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
