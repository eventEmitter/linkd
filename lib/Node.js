!function() {

	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, EventEmitter  = require('ee-event-emitter');



	module.exports = new Class({
		inherits: EventEmitter


		/**
		 * initilize the linked list node
		 *
		 * @param {Item} customType a custom item implementation used for storing
		 * 						    ittems
		 */
		, init: function(value, previousNode, nextNode) {

            // save the value
            this.value = value;

            // save the links
            Class.define(this, 'previousNode', Class(previousNode).Writable().Configurable());
            Class.define(this, 'nextNode', Class(nextNode).Writable().Configurable());
		}

	});
}();
