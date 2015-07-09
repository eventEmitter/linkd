

	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, assert 		= require('assert');



	var   LinkedList = require('../');



	describe('The LinkedList', function(){
		it('should not crash when instantiated', function() {
			new LinkedList();
		});


		it('should corrently save pushed nodes', function() {
			var list = new LinkedList();

			list.push(1, 'a');
			list.push(2, 'b');
			list.push(3, 'c');

			for (var x of list) log(x);
		});
	});
