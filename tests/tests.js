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
	equals(typeof this.swfupload,'object', 'swfupload loaded');
	
});

test("force upload start without file", function() {
	ok($.ui.progressbar, 'progres bar ok');
	equals(typeof this.swfupload,'object', 'swfupload loaded');
	
});

module("core tests",{
	setup: function() {
		$('<div></div>',{
			'id' : 'jquery-ui-upload'
		}).appendTo('#qunit-fixture');
		$('input',{
			'type' : 'file',
			'name' : 'Filedata'
		}).appendTo('#swfupload');
		this.element = $('#jquery-ui-upload').jqswfupload();			
	},
	teardown: function() {
		this.element.jqswfupload('destroy');
	}
});

test("plugin started", function(){
	
	ok($.ui.jqswfupload, 'the main plugin was instanciaded');
	
});

test('the target selector contains a flash instance', function(){
	ok($('object',this.element).length,"there's a flash object inside de component");
	ok(SWFUpload.movieCount > 0 ,"there's a movies started");
});

test('get the swfupload instance', function() {
 	//this.element.pload();
	var instance = this.element.jqswfupload('getInstance');
	equals(instance.getSetting('button_placeholder_id'), 'jquery-ui-upload-flash-button', 'obteu a instancia atual');
});


test('get all the filetypes groups and mixing in one', function() {
	
	var result = this.element.jqswfupload('concatTypes','*.*');
	equal(result, '*.*', 'the file types return the same');
	
	result = this.element.jqswfupload('concatTypes',{
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
	equal(this.element.jqswfupload('getFileType',file),'jpg','returning file extension');
});

test('it should return a file extension, with a file without type property', function(){
	var file = {
		name:"obj_teste.jpg",
		type: ""
	}
	equal(this.element.jqswfupload('getFileType',file),'jpg','returning file extension');
});

test('it should return a file extension, when a file named with dot', function(){
	var file = {
		name:"obj_teste.jpg.jpg",
		type: ""
	};
	equal(this.element.jqswfupload('getFileType',file),'jpg','returning file extension');
});

test('it should return the right dimensions where a byte filesize is given', function(){
	var size = this.element.jqswfupload('convertSize', 34);
	equal(size, '34 B', 'The right filesize is given');
	
	var size2 = this.element.jqswfupload('convertSize', 3456);
	equal(size2, '4 KB', 'The right filesize is given');
	
	var size3 = this.element.jqswfupload('convertSize', 12224343);
	equal(size3, '12 MB', 'The right filesize is given');
});

test('it should return the size in bytes if a dimension is given', function(){
	var size = this.element.jqswfupload('convertSize', '4 KB');
	equal(size, 4096, 'the conversion from KB to bytes given unit to bytes is given');
	
	var size2 = this.element.jqswfupload('convertSize', '2 MB');
	equal(size2, 2097152, 'the conversion in MB to bytes');
	
	var size3 = this.element.jqswfupload('convertSize', '1 GB');
	equal(size3, 1073741824, 'the conversion from GB to byte');
	
});

test('it should return the file name truncated', function() {
	var file = 'abcdefghijklmnopqrsxtzabcdefghijklmn.jpg'
	var fileTruncated = this.element.jqswfupload('fileSplit', file, 5);
	
	equal(fileTruncated, 'abcde(...).jpg', 'the file name was truncated correctly');
});