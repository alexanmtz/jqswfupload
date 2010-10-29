module("dependencies and initialization checking",{
	setup: function() {
		$('<div></div>',{
			'id' : 'swfupload-init'
		}).appendTo('#qunit-fixture')		
	}
});

test("check if all dependencies is loading", function() {
	ok($.ui.progressbar, 'progres bar ok');
	ok($.ui.button, 'button ok');
    var swfupload = new SWFUpload({
        upload_url: "somehurl",
        flash_url: "swfupload.swf",
		button_placeholder_id : "swfupload-init", 
        file_size_limit: "20 MB"
    });
	
	equals(typeof swfupload,'object', 'swfupload loaded');
	
});

module("core tests");

test("plugin started", function(){
	
	ok($.ui.pload, 'the main plugin was instanciaded');
	
});

test('the target selector contains a flash instance', function(){
	
});
