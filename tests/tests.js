module("dependencies and initialization checking",{
	setup: function() {
		$('<div></div>',{
			'id' : 'swfupload'
		}).appendTo('#qunit-fixture');
		$('input',{
			'type' : 'file',
			'name' : 'Filedata'
		}).appendTo('#swfupload');	
	}
});

test("check if all dependencies is loading", function() {
	ok($.ui.progressbar, 'progres bar ok');
	ok($.ui.button, 'button ok');
    var swfupload = new SWFUpload({
        upload_url: "somehurl",
        flash_url: "swfupload.swf",
		button_placeholder_id : "swfupload", 
        file_size_limit: "20 MB"
    });
	equals(typeof swfupload,'object', 'swfupload loaded');
	
});

test("force upload start without file", function() {
	ok($.ui.progressbar, 'progres bar ok');
	ok($.ui.button, 'button ok');
    var swfupload = new SWFUpload({
        upload_url: "somehurl",
        flash_url: "swfupload.swf",
		button_placeholder_id : "swfupload", 
        file_size_limit: "20 MB",
    });
	equals(typeof swfupload,'object', 'swfupload loaded');
	
});

module("core tests",{
	setup: function() {
		$('<div></div>',{
			'id' : 'jquery-ui-pload'
		}).appendTo('#qunit-fixture');
		$('input',{
			'type' : 'file',
			'name' : 'Filedata'
		}).appendTo('#swfupload');			
	}
});

test("plugin started", function(){
	
	ok($.ui.pload, 'the main plugin was instanciaded');
	
});

test('the target selector contains a flash instance', function(){
	var container = '#jquery-ui-pload';
	$(container).pload();
	ok($('object',container).length,"there's a flash object inside de component");
	ok(SWFUpload.movieCount > 0 ,"there's a movies started");
});

/*
test('swfupload loaded', function(){
	expect(1);
	$('#jquery-ui-pload').pload({
		flashLoaded: function() {
			ok(true, 'swfupload loaded');
		}
	});
});
*/

test('get the swfupload instance', function() {
 	var el = $('#jquery-ui-pload');
	el.pload();
	var instance = el.pload('getInstance');
	equals(instance.getSetting('button_placeholder_id'), 'jquery-ui-pload-flash-button', 'obteu a instancia atual');
});

/*
test('dialog start handler', function() {
	expect(1);
	$('#jquery-ui-pload').pload({
		fileDialogStart: function() {
			ok(true, 'open file dialog');
		}
	});
	//$('#jquery-ui-pload object').trigger('click');
});


test('Upload started without any file', function(){
    expect(1);
	$('#jquery-ui-pload').pload({
		fileDialogComplete: function(fselected) {
			ok(fselected, 'one file enter in the queue');
		},
		uploadError: function(file,error,msg) {
			alert(error);
		}
	});
	$('#jquery-ui-pload').pload('getInstance').callFlash("startUpload", 'bla');
});
*/

test('get all the filetypes groups and mixing in one', function() {
 	var el = $('#jquery-ui-pload');
	el.pload();
	
	result = el.pload('concatTypes','*.*');
	equal(result, '*.*', 'the file types return the same');
	
	result = el.pload('concatTypes',{
		'image' : {
			'fileTypes' : ['jpeg', 'png'],
			'limit' : 10
		},
		'video' : {
			'fileTypes' : ['mov'],
			'limit' : 1
		}
	});
	equal(result, '*.jpeg; *.png; *.mov', 'the file types concat');
	
});

test('it should return a file extension, given an file object with an already defined type', function(){
	var el = $('#jquery-ui-pload');
	el.pload();
	file = {
		name:"obj_teste",
		type:".jpg"
	}
	equal(el.pload('getFileType',file),'jpg','returning file extension');
});

test('it should return a file extension, with a file without type property', function(){
	var el = $('#jquery-ui-pload');
	el.pload();
	file = {
		name:"obj_teste.jpg",
		type: ""
	}
	equal(el.pload('getFileType',file),'jpg','returning file extension');
});

test('it should return a file extension, when a file named with dot', function(){
	var el = $('#jquery-ui-pload');
	el.pload();
	file = {
		name:"obj_teste.jpg.jpg",
		type: ""
	}
	equal(el.pload('getFileType',file),'jpg','returning file extension');
});

test('it should create a queue of file object based on file type', function(){
	var el = $('#jquery-ui-pload');
	el.pload();
	file = {
		id: 'SWFUpload_0_0',
		type: 'jpg',
		index: 0,
		name: 'testimage.jpg'
	};
	el.pload('queueFiles', file);
	
	file2= {
		id: 'SWFUpload_0_1',
		type: 'gif',
		index: 0,
		name: 'testotherimage.jpg'
	};
	el.pload('queueFiles', file2);
	
	expected = [{
		id: 'SWFUpload_0_0',
		type: 'jpg',
		index: 0,
		name: 'testimage.jpg'
	},
	{
		id: 'SWFUpload_0_1',
		type: 'gif',
		index: 0,
		name: 'testotherimage.jpg'
	}];
	deepEqual(el.pload('getFiles'), expected, 'create a queue with two files');
	
});

test('it should not include on queue a file with same id', function(){
	var el = $('#jquery-ui-pload');
	el.pload();
	file = {
		id: 'SWFUpload_0_0',
		type: 'jpg',
		index: 0,
		name: 'testimage.jpg'
	};
	el.pload('queueFiles', file);
	
	el.pload('queueFiles', file);
	
	expected = [{
		id: 'SWFUpload_0_0',
		type: 'jpg',
		index: 0,
		name: 'testimage.jpg'
	}];
	deepEqual(el.pload('getFiles'), expected, 'a queue with same file');
});
