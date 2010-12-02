# jQuery-UI-pload
> Version 0.2
	* handler the file delete from queue

# About the plugin ?

This plugin it's a swfupload abstration layer developed with the pattern of jQuery UI.

# Features

* File progress
* Complete jQuery UI Interface
* Validation and handlers based in file groups


# Requirements

* SWFUpload
* jQuery UI

# Tested

* Firefox 3+ Windows / MAC / Linux
* IE 6, 7 Windows

# Issues

* For now, the plugin only accepts image and video


# In a nutshell:
     $(function(){
        $("#vertical").pliad({
			url: '/upload/',
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
		});
     });

Soon the complete documentation