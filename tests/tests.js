module("dependencies and initialization checking",{
	setup: function() {
		$('<div></div>',{
			'id' : 'swfupload'
		}).appendTo('#qunit-fixture');
		$('input',{
			'type' : 'file',
			'name' : 'Filedata'
		}).appendTo('#swfupload');	
        this.swfupload = new SWFUpload({
            upload_url: "somehurl",
            flash_url: "swfupload.swf",
            button_placeholder_id: "swfupload",
            file_size_limit: "20 MB"
        });
	},
	teardown: function() {
		this.swfupload.destroy();
	}
});

test("check if all dependencies is loading", function() {
	ok($.ui.progressbar, 'progres bar ok');
	ok($.ui.button, 'button ok');
	equals(typeof this.swfupload,'object', 'swfupload loaded');
	
});

test("force upload start without file", function() {
	ok($.ui.progressbar, 'progres bar ok');
	ok($.ui.button, 'button ok');
	equals(typeof this.swfupload,'object', 'swfupload loaded');
	
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
		this.element = $('#jquery-ui-pload').pload();			
	},
	teardown: function() {
		this.element.pload('destroy');
	}
});

test("plugin started", function(){
	
	ok($.ui.pload, 'the main plugin was instanciaded');
	
});

test('the target selector contains a flash instance', function(){
	ok($('object',this.element).length,"there's a flash object inside de component");
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
 	//this.element.pload();
	var instance = this.element.pload('getInstance');
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
	
	var result = this.element.pload('concatTypes','*.*');
	equal(result, '*.*', 'the file types return the same');
	
	result = this.element.pload('concatTypes',{
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
	var file = {
		name:"obj_teste",
		type:"jpg"
	};
	equal(this.element.pload('getFileType',file),'jpg','returning file extension');
});

test('it should return a file extension, with a file without type property', function(){
	var file = {
		name:"obj_teste.jpg",
		type: ""
	}
	equal(this.element.pload('getFileType',file),'jpg','returning file extension');
});

test('it should return a file extension, when a file named with dot', function(){
	var file = {
		name:"obj_teste.jpg.jpg",
		type: ""
	};
	equal(this.element.pload('getFileType',file),'jpg','returning file extension');
});

test('it should return the right dimensions where a byte filesize is given', function(){
	var size = this.element.pload('convertSize', 34);
	equal(size, '34 B', 'The right filesize is given');
	
	var size2 = this.element.pload('convertSize', 3456);
	equal(size2, '4 KB', 'The right filesize is given');
	
	var size3 = this.element.pload('convertSize', 12224343);
	equal(size3, '12 MB', 'The right filesize is given');
});

test('it should return the size in bytes if a dimension is given', function(){
	var size = this.element.pload('convertSize', '4 KB');
	equal(size, 4096, 'the conversion from KB to bytes given unit to bytes is given');
	
	var size2 = this.element.pload('convertSize', '2 MB');
	equal(size2, 2097152, 'the conversion in MB to bytes');
	
	var size3 = this.element.pload('convertSize', '1 GB');
	equal(size3, 1073741824, 'the conversion from GB to byte');
	
});

test('it should return the file name truncated', function() {
	var file = 'abcdefghijklmnopqrsxtzabcdefghijklmn.jpg'
	var fileTruncated = this.element.pload('fileSplit', file, 5);
	
	equal(fileTruncated, 'abcde(...).jpg', 'the file name was truncated correctly');
});

/*
test('it should queue if not exceed the limit', function(){
	var file1 = {
		id: 'SWFUpload_0_1',
		type: 'jpg',
		index: 1,
		name: 'image1.jpg'
	};
	this.element.pload('queueFiles', file1);

	var file2 = {
		id: 'SWFUpload_0_2',
		type: 'jpg',
		index: 2,
		name: 'image2.jpg'
	};
	this.element.pload('queueFiles', file2);	

	var expected = [
		{
			id: 'SWFUpload_0_1',
			type: 'jpg',
			index: 1,
			name: 'image1.jpg'
		},
		{
			id: 'SWFUpload_0_2',
			type: 'jpg',
			index: 2,
			name: 'image2.jpg'
		}
	];
	
	deepEqual(this.element.pload('getFiles'), expected, 'create a queue with two files');
});

test('it should not enqueue if exceed the video limit', function(){

	var filex = {
		id: 'SWFUpload_0_1',
		type: 'mov',
		index: 1,
		name: 'movie1.mov'
	};
	this.element.pload('queueFiles', filex);

	var filey = {
		id: 'SWFUpload_0_2',
		type: 'mov',
		index: 2,
		name: 'movie2.mov'
	};
	this.element.pload('queueFiles', filey);	
	
	var expected = [
	{
		id: 'SWFUpload_0_1',
		type: 'mov',
		index: 1,
		name: 'movie1.mov'
	}];
	deepEqual(this.element.pload('getFiles'), expected, 'create a queue with one video');
});


test('it should not enqueue if exceed the image limit', function(){
	var el = $('#jquery-ui-pload');
	el.pload();

	for(i=0;i<7;i++){
		file = {
			id: 'SWFUpload_0_'+i,
			type: 'gif',
			index: i,
			name: 'pic'+i+'.gif'
		};
		el.pload('queueFiles', file);			
	}	
	
	var expected = [];
	for(i=0;i<6;i++){
		file = {
			id: 'SWFUpload_0_'+i,
			type: 'gif',
			index: i,
			name: 'pic'+i+'.gif'
		};
		expected.push(file);			
	}

	deepEqual(el.pload('getFiles'), expected, 'create a queue with two files');
	
});

*/