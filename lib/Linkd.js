!function() {

	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, EventEmitter  = require('ee-event-emitter')
		, Node 			= require('./Node');





	/**
	 * A fast and extendable doubly linked list implementation.
	 */



	var classDefinition = {
		inherits: EventEmitter



		// the lenght property returns how many items are currently
		// stored in the linked list
		, length: {
			  get: function() {return this.map.size;}
			, set: function() {throw new Error('The length property is readonly!')}
		}





		/**
		 * initilize the linked list, set up storage and pointer. class constructor.
		 *
		 * @param {Item} customType a custom item implementation used for storing
		 * 						    ittems
		 */
		, init: function(customType) {

			// the map hoofding the linked list
			Class.define(this, 'map', Class(new  Map()).Writable());

			// reference to the first item
			Class.define(this, 'firsNode', Class(null).Writable().Configurable());

			// reference to the last item
			Class.define(this, 'lastNode', Class(null).Writable().Configurable());

			// the user may pass a custom type for the map items
			if (CustomType){
				if (!(CustomType instanceof Item)) throw new Error('The custom type must inherit from the LinkedList.Item class!');
				Class.define(this, 'Node', Class(CustomType));
			}
			else {
				Class.define(this, 'Node', Class(Node));
			}
		}




		/**
		 * returns an item by its hash or undefined if the
		 * item was not found.
		 *
		 * @param {any} hash a hash identifying an item, may be of any type
		 * @returns {any|any[]} value value of any type, or array of any type
		 */
		, get: function(hash) {
			if (this.has(hash)) return this.map.get(hash).value;
			else return undefined;
		}


		/**
		 * checks if a certain hash is present in the linked list
		 *
		 * @param {any} hash a hash identifying an item, may be of any type
		 * @returns {bool} true if the hash was found inside the list
		 */
		, has: function(hash) {
			return this.map.has(hash);
		}







		, addAfter: function(hash, value, afterHash) {
			var node, afterNode;


			// the node to insert after needds to exits!
			if (!this.has(afterHash)) throw new Error('Cannot add node after hash «'+afterHash+'», the node referenced node does not exist!');
			else afterNode = this.map.get(afterHash);


			// set up node
			node = new this.Node(hash, value, null, afterNode);


			// remove existing instances
			if (this.has(hash)) this.removeNode(hash);


			// store the node
			this.map.set(hash, node);


			// set this node between the afterNode and its previous node
			if (afterNode.previousNode) {
				afterNode.previousNode.nextNode = node;
				node.previousNode = afterNode.previousNode;
			}
			else {
				// this is the last node
				this.lastNode = node;
			}


			// set link
			afterNode.previousNode = node;


			// emit events
			this.emit('add', node);
			this.emit('addAfter', node);

			// return this class for daisy chaning
			return this;
		}





		, addBefore: function(hash, value, beforeHash) {
			var node, beforeNode;


			// the node to insert after needds to exits!
			if (!this.has(beforeHash)) throw new Error('Cannot add node before hash «'+afterHash+'», the node referenced node does not exist!');
			else beforeNode = this.map.get(beforeHash);


			// set up node
			node = new this.Node(hash, value, beforeNode);


			// remove existing instances
			if (this.has(hash)) this.removeNode(hash);


			// store the node
			this.map.set(hash, node);


			// set this node between the beforeNode and its previous node
			if (beforeNode.nextNode) {
				beforeNode.nextNode.previousNode = node;
				node.nextNode = beforeNode.nextNode;
			}
			else {
				// this is the first node
				this.firstNode = node;
			}


			// set link
			beforeNode.nextNode = node;


			// emit events
			this.emit('add', node);
			this.emit('addBefore', node);

			// return this class for daisy chaning
			return this;
		}







		/**
		 * add an element to the beginning of the list
		 *
		 * @param {any} hash a hash identifying an item, may be of any type
		 * @param {any} the value to store. undefiend is the only unacceptable
		 * 				value
		 * @returns {Linkd} this
		 */
		, push: function(hash, value) {
			var node = new this.Node(hash, value, this.lastNode, this.firstNode);


			// remove existing instances
			if (this.has(hash)) this.removeNode(hash);


			// store the node
			this.map.set(hash, node);


			// set myself as nextnode
			if (this.firstNode) this.firstNode.nextNode = node;


			// set as first node
			this.firstNode = node;


            // set as last node if first item
            if (!this.lastNode) this.lastNode = this.firstNode;


			// emit events
			this.emit('add', node);
			this.emit('push', node);

			// return this class for daisy chaning
			return this;
		}



		/**
		 * add an element to the end of the list
		 *
		 * @param {any} hash a hash identifying an item, may be of any type
		 * @param {any} the value to store. undefiend is the only unacceptable
		 * 				value
		 * @returns {Linkd} this
		 */
		, unshift: function(hash, value) {
			var node = new this.Node(hash, value, this.lastNode, this.firstNode);


			// remove existing instances
			if (this.has(hash)) this.removeNode(hash);


			// store the node
			this.map.set(hash, node);


			// set myself as nextnode
			if (this.lastNode) this.lastNode.previousNode = node;


			// set as first node
			this.lastNode = node;


            // set as last node if first item
            if (!this.firstNode) this.firstNode = this.lastNode;


			// emit events
			this.emit('add', node);
			this.emit('unshift', node);

			// return this class for daisy chaning
			return this;
		}




		/**
		 * remove an element from the beginning of the list
		 *
		 * @returns {any} the removed item, array of items if the uniqueHashes
		 * 			      is deactivated
		 */
		, pop: function() {
			var node;

			if (this.firstNode) {
				node = this.remove(this.firstNode.hash);

				this.emit('pop', node);

				return node.value;
			}
			return undefined;
		}




		/**
		 * remove an element from the beginning of the list
		 *
		 * @returns {any} the removed item, array of items if the uniqueHashes
		 * 			      is deactivated
		 */
		, shift: function() {
			var node;

			if (this.lastNode) {
				node = this.remove(this.lastNode.hash);

				this.emit('shift', node);

				return node.value;
			}
			return undefined;
		}





		/**
		 * remove an element from the list
		 *
		 * @param {any} hash a hash identifying an item, may be of any type
		 * @returns {any} the removed item
		 */
		, remove: function(hash) {
			var node = this.removeNode(hash);

			this.emit('remove', node);

			return node.value;
		}





		/**
		 * returns all the hashes that are stored in the list
		 *
		 * @returns {array} with all hashes
		 */
		, keys: function() {
			return this.map.keys();
		}




		/**
		 * clears all values from the linked list
		 */
		, clear: function() {

			// create a new map
			Class.define(this, 'map', Class(new  Map()).Writable());

			// clear nodes
			this.lastNode = null;
			this.firstNode = null;


			this.emit('clear');
		}




		/**
		 * removes a node from the lsit
		 *
		 * @private
		 * @param {any} hash the hash of the node to remove
		 * @returns {any} node
		 */
		, removeNode: function(hash) {
			var existingNode = this.get(hash);

			if (existingNode) {
				if (existingNode.nextNode) {
					if (existingNode.previousNode) {
						// this node is in between of two nodes
						existingNode.nextNode.previousNode = existingNode.previousNode;
						existingNode.previousNode.nextNode = existingNode.nextNode;
					}
					else {
						// this is the last node
						existingNode.nextNode.previousNode = null;
					}
				}
				else {
					// this is the first node
					existingNode.previousNode.nextNode = null;
				}

				return existingNode;
			}
			else throw new Error('Cannot remove the node «'+hash+'», the node deosnt exist!');
		}
	};







	// make it iterable
	classDefinition[Symbol.iterator] = function() {
		var currentNode = this.firstNode;

		return {
			next: function() {
				var returnNode;

				if (currentNode && currentNode.previuosNode) {
					returnNode = currentNode;
					currentNode = currentNode.previuosNode
					return {value: returnNode, done: false};
				}
				else return {done: true};
			}
		};
	};


	// make a class
	return new Class(classDefinition);
}();
