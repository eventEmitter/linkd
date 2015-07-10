!function() {

	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, EventEmitter  = require('ee-event-emitter')
		, Node 			= require('./Node');





	/**
	 * A fast and extendable doubly linked list.
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
		 * @param {CustomNodeType} CustomNodeType A custom item implementation
		 * 						     			  used for storing items
		 */
		, init: function(CustomType) {

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
		 * @param {*} hash a hash identifying an item, may be of any type
		 * @returns {*|undefined} value value of any type
		 */
		, get: function(hash) {
			if (this.has(hash)) return this.map.get(hash).value;
			else return undefined;
		}




		/**
		 * returns a node by its hash or null if the
		 * node was not found
		 *
		 * @param {*} hash a hash identifying an item, may be of any type
		 * @returns {node|null} node or null
		 */
		, getNode: function(hash) {
			if (this.has(hash)) return this.map.get(hash);
			else return null;
		}



		/**
		 * checks if a certain hash is present in the linked list
		 *
		 * @param {3} hash a hash identifying an item, may be of any type
		 * @returns {bool} true if the hash was found inside the list
		 */
		, has: function(hash) {
			return this.map.has(hash);
		}





		/**
		 * add an element after another item in the list
		 *
		 * @param {*|node} hash a hash identifying an item, may be of any type or a node
		 * @param {*} the value to store. undefiend is the only unacceptable
		 * @param {*} hash the hash of the item this should be placed after
		 * 			  value
		 * @returns {Linkd} this
		 */
		, addAfter: function(hash, value, afterHash) {
			var node, afterNode;

			// clean up variables
			if (hash instanceof this.Node) {
				node = hash;
				hash = node.hash;
				afterHash = value;
			}

			// the node to insert after needds to exits!
			if (!this.has(afterHash)) throw new Error('Cannot add node after hash «'+afterHash+'», the node referenced node does not exist!');
			else afterNode = this.map.get(afterHash);


			// set up node
			if (hash instanceof this.Node) {
				node.nextNode = afterNode;
				node.previousNode = null;
			}
			else node = new this.Node(hash, value, null, afterNode);


			// remove existing instances
			if (this.has(hash)) this._removeNode(hash);


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
			this.emit('add', node.value);
			this.emit('addNode', node);
			this.emit('addAfter', node.value);
			this.emit('addAfterNode', node);

			// return this class for daisy chaning
			return this;
		}




		/**
		 * add an element before another item in the list
		 *
		 * @param {*|node} hash a hash identifying an item, may be of any type or a node
		 * @param {*} the value to store. undefiend is the only unacceptable
		 * @param {*} hash the hash of the item this should be placed before
		 * 			  value
		 * @returns {Linkd} this
		 */
		, addBefore: function(hash, value, beforeHash) {
			var node, beforeNode;

			// clean up variables
			if (hash instanceof this.Node) {
				node = hash;
				hash = node.hash;
				beforeHash = value;
			}

			// the node to insert before needds to exits!
			if (!this.has(beforeHash)) throw new Error('Cannot add node before hash «'+beforeHash+'», the node referenced node does not exist!');
			else beforeNode = this.map.get(beforeHash);


			// set up node
			if (node instanceof this.Node) {
				node.nextNode = null;
				node.previousNode = beforeNode;
			}
			else node = new this.Node(hash, value, beforeNode);


			// remove existing instances
			if (this.has(hash)) this._removeNode(hash);


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
			this.emit('add', node.value);
			this.emit('addNode', node);
			this.emit('addBefore', node.value);
			this.emit('addBeforeNode', node);

			// return this class for daisy chaning
			return this;
		}







		/**
		 * add an element to the beginning of the list
		 *
		 * @param {*|node} hash a hash identifying an item, may be of any type or a node
		 * @param {*} the value to store. undefiend is the only unacceptable
		 * 				value
		 * @returns {Linkd} this
		 */
		, push: function(hash, value) {
			var node;

			// set up node
			if (node instanceof this.Node) {
				node = hash;
				hash = node.hash;

				node.nextNode = null;
				node.previousNode = this.firstNode;
			}
			else node = new this.Node(hash, value, this.firstNode);


			// remove existing instances
			if (this.has(hash)) this._removeNode(hash);


			// store the node
			this.map.set(hash, node);


			// set myself as nextnode
			if (this.firstNode) this.firstNode.nextNode = node;


			// set as first node
			this.firstNode = node;


            // set as last node if first item
            if (!this.lastNode) this.lastNode = this.firstNode;


			// emit events
			this.emit('add', node.value);
			this.emit('addNode', node);
			this.emit('push', node.value);
			this.emit('pushNode', node);

			// return this class for daisy chaning
			return this;
		}



		/**
		 * add an element to the end of the list
		 *
		 * @param {*} hash a hash identifying an item, may be of any type
		 * @param {any} the value to store. undefiend is the only unacceptable
		 * 				value
		 * @returns {Linkd} this
		 */
		, unshift: function(hash, value) {
			var node;

			// set up node
			if (node instanceof this.Node) {
				node = hash;
				hash = node.hash;

				node.nextNode = this.lastNode;
				node.previousNode = null;
			}
			else node = new this.Node(hash, value, null, this.lastNode);


			// remove existing instances
			if (this.has(hash)) this._removeNode(hash);


			// store the node
			this.map.set(hash, node);


			// set myself as nextnode
			if (this.lastNode) this.lastNode.previousNode = node;


			// set as first node
			this.lastNode = node;


            // set as last node if first item
            if (!this.firstNode) this.firstNode = this.lastNode;


			// emit events
			this.emit('add', node.value);
			this.emit('addNode', node);
			this.emit('unshift', node.value);
			this.emit('unshiftNode', node);

			// return this class for daisy chaning
			return this;
		}




		/**
		 * remove an element from the beginning of the list
		 *
		 * @returns {Node} the removed node
		 */
		, popNode: function() {
			var node;

			if (this.firstNode) {
				node = this._removeNode(this.firstNode.hash);

				if (node) {
					this.emit('remove', node.value);
					this.emit('_removeNode', node);
					this.emit('pop', node.value);
					this.emit('popNode', node);
				}

				return node;
			}
			return undefined;
		}



		/**
		 * remove an element from the beginning of the list
		 *
		 * @returns {*} the removed item
		 */
		, pop: function() {
			var node = this.popNode();

			return node ? node.value : node;
		}




		/**
		 * remove an element from the beginning of the list
		 *
		 * @returns {Node} the removed item
		 */
		, shiftNode: function() {
			var node;

			if (this.lastNode) {
				node = this._removeNode(this.lastNode.hash);

				if (node) {
					this.emit('remove', node.value);
					this.emit('_removeNode', node);
					this.emit('shift', node.value);
					this.emit('shiftNode', node);
				}

				return node.value;
			}
			return undefined;
		}




		/**
		 * remove an element from the beginning of the list
		 *
		 * @returns {*} the removed item
		 */
		, shift: function() {
			var node = this.shiftNode();

			return node ? node.value : node;
		}






		/**
		 * remove an element from the list
		 *
		 * @param {*|Node} hash a hash identifying an item, may be of any type or node
		 * @returns {Node} the removed node
		 */
		, removeNode: function(hash) {
			var node;

			if (hash instanceof this.Node) node = this._removeNode(hash.hash);
			else node = this._removeNode(hash);

			if (node) {
				this.emit('remove', node.value);
				this.emit('_removeNode', node);
			}

			return node;
		}





		/**
		 * remove an element from the list
		 *
		 * @param {*|Node} hash a hash identifying an item, may be of any type or node
		 * @returns {*} the removed item
		 */
		, remove: function(hash) {
			var node = this.removeNode(hash);

			return node ? node.value : node;
		}





		/**
		 * returns all the hashes that are stored in the list
		 *
		 * @returns {Iterable*} with all hashes
		 */
		, keys: function() {
			return this.map.keys();
		}




		/**
		 * clears all values from the linked list, re-initilizes
		 * the class isntance
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
		 * @param {*} hash the hash of the node to remove
		 * @returns {*} node
		 */
		, _removeNode: function(hash) {
			var toBeRemovedNode = this.getNode(hash);



			if (toBeRemovedNode) {
				if (toBeRemovedNode.nextNode) {
					if (toBeRemovedNode.previousNode) {
						// this node is in between of two nodes
						toBeRemovedNode.nextNode.previousNode = toBeRemovedNode.previousNode;
						toBeRemovedNode.previousNode.nextNode = toBeRemovedNode.nextNode;
					}
					else {
						// this is the last node
						toBeRemovedNode.nextNode.previousNode = null;
						this.lastNode = toBeRemovedNode.nextNode;
					}
				}
				else {
					if (toBeRemovedNode.previousNode) {
						// this is the first node
						toBeRemovedNode.previousNode.nextNode = null;
						this.firstNode = toBeRemovedNode.previousNode;
					}
					else {
						// this was the last node
						this.lastNode = null;
						this.firsNode = null;
					}
				}

				// remove from map
				this.map.delete(hash);

				// remove links
				toBeRemovedNode.nextNode = null;
				toBeRemovedNode.previousNode = null;

				// return the deleted node
				return toBeRemovedNode;
			}
			else throw new Error('Cannot remove the node «'+hash+'», the node deosnt exist!');
		}
	};







	/**
	 * returns an ES6 iterator object
	 *
	 * @returns {Iterator} Iterator object
	 */
	classDefinition[Symbol.iterator] = function() {
		var currentNode = this.firstNode;

		return {
			next: function() {
				var returnNode;

				if (currentNode) {
					returnNode = currentNode;
					currentNode = currentNode.previousNode || null;

					return {value: returnNode.value, done: false};
				}
				else return {done: true};
			}
		};
	};



	// make a class
	module.exports = new Class(classDefinition);
}();
