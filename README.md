# jQuery-UI-upload

> Version 1.1
	* Removed the jQuery UI header as requested

> Version 1.0
	* A uploadComplete callback now receive a array of the data returned of each file uploaded
	* Documentation about File Groups

> Version 0.9
	* Complete documentation
	* License
	* renamed all the references to jQuery-ui-upload
	* Warning message pass as options
	* Theme roller link at demo page

> Version 0.8
	* Update documentation
	* Internet Explorer issues (Queue Handler)

> Version 0.7
	* Smart filesize convertion
	* Handler overall progress per file
	* Long filesize splitted

> Version 0.6
	* Callback for overall progress
	* Integration with block UI at demo page

> Version 0.5
	* jQuery UI Theming of delete button and warnings
	* file size limit

> Version 0.4
	* Callback for all files completed
	* Fixed delete handlers bug

> Version 0.3
	* Callbacks for file upload success and file upload complete
	* Additional post parameters throught postParams

> Version 0.2
	* handler the file delete from queue

# About the plugin ?

This plugin is a multiple file upload jQuery-UI plugin.

# Demo

You can [see a demo](http://www.alexandremagno.net/jquery-ui-upload/demo.html "Demo Page") 

# How it works

This plugin it's a swfupload abstraction layer developed with the pattern of jQuery UI.

# Features

* File progress
* Complete jQuery UI Interface
* Validation and handlers based in file groups

# Requirements

* SWFUpload
* jQuery UI

# Tested

* Firefox 3+ Windows / MAC / Linux
* IE 6, 7+ Windows

# Issues

* File progress don't work properly at Mac OS. Whatever, the plugin has their own implementation of overall progress that can be used.

# File Groups

This feature it's when this plugin differ from other uploads scripts. When you are dealing with images, documents and other types, generally they a group of formats. With this plugin you can make rules for each type and even create custom types with their own implementation.
See the example below:

# In a nutshell:
     $(function(){
        $("#vertical").upload({
			url: '/upload/',
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
		});
     });

# Plugin Options

## url
* type: String
* default: '/upload/'
* description: The URL where the upload will be processed and the post file data and other parameters will be sent

## flashUrl
* type: String
* default: 'libs/swfupload.swf'
* description: The path of the flash file used by plugin

## postParams
* type: Object
* default: {}
* description: A object of additional post params that will be send to the server
* example:
	 $(function(){
        $("#vertical").upload({
			postParams: {
				'key' : 'value',
				'key2' : 'value2'
			},
		});
     });

## buttonImageUrl
* type: String
* default: btn-upload-select.png
* description: The path of the image used to button that open the file dialog. This image should be a sprite of three images one bellow each other with the normal state, hover state and active state

## buttonText
* type: String
* default: <span class="text">Select File(s)</span>
* description: the text that appear at button that activate the file dialog. You can use html tags to use stylesheets at style option described bellow

## buttonWidth
* type: Number
* default: 178
* description: the width of the button in pixels

## buttonHeight
* type: Number
* default: 30
* description: the height of the button in pixels

## buttonTextTopPadding
* type: Number
* default: 5
* description: the button top padding in pixels used for alignment purposes

## style
* type: String
* default: .text {color: black; font-weight: bold; font-size: 16pt; text-align:center;margin-top:15px;}
* description: used to apply stylesheets declared at buttonText

## multiple
* type: Boolean
* default: true
* description: Specify if the upload will be multiple or not, letting the user hold control to select more than one file at file dialog

## rules
* type: Object
* default: see example 
* description: To make easier and flexible the management of file types, this object you can create group of file types that hold the rules of limit, formats and size of the files
* example: 
 $(function(){
    $("#vertical").upload({
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
	});
 });

## fileTypesDescription
* type: String
* default: choose file(s)
* description: the message that appear at file choose dialog

## fileSizeWarning
* type: String
* default: The limit of <strong>{limit}</strong> was reached
* description: the message of warning when the file reach the limit. You can use {limit} to reference this limit that is declared at limit in option rules

## debug
* type: Boolean
* default: false
* description: create a log at browser to debug all the events and status of the file upload cycle

# Plugin Options - Callbacks

## flashLoaded
* type: Function
* description: Callback that is called where the flash movie is correctly loaded

## fileDialogStart
* type: Function
* description: Callback fired when the choose file dialog is open

## fileQueued
* type: Function
* parameters: file
* description: Callback fired when a file is choosed and is valid, making a queue of files. The file Object has information about name, size etc

## fileQueueError
* type: Function
* parameters: file, error, msg
* description: Callback fired when a file for some reason doesn't enter in queue

## fileDialogComplete
* type: Function
* parameters: selected, queued, total
* description: Callback to track the files selected, the files queued and the total of files in queue

## uploadStart
* type: Function
* parameters: file
* description: Callback fired when each upload started

## fileUploadProgress
* type: Function
* parameters: file, bytes, total
* description: Callback fired when the current file is uploading, giving the bytes already uploaded and the total

## uploadProgress
* type: Function
* parameters: percent, currentFile
* description: Callback fired of the overall progress, very useful for progress

## fileUploadComplete
* type: Function
* parameters: file
* description: Callback fired when each upload was successfully completed

## uploadComplete
* type: Function
* parameters: fileData
* description: Callback fired when all uploads are completed, you have access a array of data returned throught fileData. The plugin assumes that the return it's a JSON Object.

# Methods

## startUpload
* description: This method start the upload process and can be used in any event,
* example:
$(function(){
	uploadInstance = $('#upload').upload();
	uploadInstance.upload('startUpload');
});

## convertSize
* parameters: number
* description: Convert the file size in bytes to the most smart filesize. If you passa uni like '20 KB' they convert to bytes

## getFiles
* description: return all the files in the queue

## getInstance
* description: return the swfupload instance and you can use his methods

## getFile
* parameter: id
* description: return the file object based in his id

