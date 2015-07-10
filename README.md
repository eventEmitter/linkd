# linkd

A fast and extendable doubly linked list


for node. 0.12+, io.js


[![npm](https://img.shields.io/npm/dm/linkd.svg?style=flat-square)](https://www.npmjs.com/package/linkd)
[![Travis](https://img.shields.io/travis/eventEmitter/linkd.svg?style=flat-square)](https://travis-ci.org/eventEmitter/linkd)
[![node](https://img.shields.io/node/v/linkd.svg?style=flat-square)](https://nodejs.org/)


## API

The linked list implements the ES6 Iterable Interface. You ma us the ES6
`for (var x in list)` loop on the list. If you like to convert the lsit
into an array you may do so using the `Array.from(list)` method or the
ES6 spread operator `[...list]`.

You may use any type as the hash value for your items, not only strings.


### Constructor

Create an instance o the linked list

    var list = new Linkd();


If you like to override the internal node representation you may inherit from
the Node class found on the Linked Lsit constructor.


    var   Class = require('ee-class')
        , Linkd = require('linkd')
        , Node  = Linkd.Node;



    var MyNodeImplementation = new Class({
        inherits: Node


        , init: function init(hash, value, previousNode, nextNode) {


            // you should call the super contructor
            init.super.call(this, hash, value, previousNode, nextNode);
        }



        , myCustomMethod: function() {

        }
    });



    var list = new Linkd(MyNodeImplementation);


### Get

Returns the value for a given hash. It returns the item or undefined if the
hash was not found.

    list.get(hash);


### GetNode

Returns the node for a given hash. It returns the node or null if the
hash was not found. The node is the internal representation of any item
and provides an easy to use interface for traversing the list.

    list.getNode(hash);

### Has

Checks if a given hash is stored in the linked list

    list.has(hash);


### Push

Add an item or a node at the beginning of the list.

    list.push(hash, value);
    list.push(node);


### AddBefore

Add an item or a node before another item.

    list.addBefore(hash, value, hashOfItemBefore);
    list.addBefore(node, hashOfItemBefore);



### AddAfter

Add an item or a node after another item.

    list.addAfter(hash, value, hashOfItemAftrer);
    list.addAfter(node, hashOfItemAftrer);


### Unshift

Add an item or a node at the end of the list.

    list.unshift(hash, value);
    list.unshift(node);



### Shift

Removes the last item from the list

    var removedValue = list.shift(hash);

If you want the removed node instead of the value

    var removedNode = list.shiftNode(hash);


### Pop

Removes the first item from the list

    var removedValue = list.pop(hash);

If you want the removed node instead of the value

    var removedNode = list.popNode(hash);


### Remove

Removes an item addressed by hash

    var removedValue = list.remove(hash);

If you want the removed node instead of the value

    var removedNode = list.removeNode(hash);





## Events

The list emits events for each action performed on it.

Events that have the value of the item passed to

- `remove`: emitted when a node was removed using one of the `remove`, `pop`, `shift`, `removeNode`, `popNode` or `shiftNode` methods
- `add`: emitted when a node was added using one of the `add`, `addAfter`, `addBefore`, `unshift`, `push`, `addNode`, `addAfterNode`, `addBeforeNode`, `unshiftNode` or `pushNode` methods
- `pop`: emitted when a node was removed using the `pop` method
- `unshift`: emitted when a node was added using the `unshift` method
- `shift`: emitted when a node was removed using the `shift` method
- `push`: emitted when a node was added using the `push` method
- `addBefore`: emitted when a node was added using the `addBefore` method
- `addAfter`: emitted when a node was added using the `addAfter` method

Events that have the node of the item passed to

- `removeNode`: emitted when a node was removed using one of the `remove`, `pop`, `shift`, `removeNode`, `popNode` or `shiftNode` methods
- `addNode`: emitted when a node was added using one of the `add`, `addAfter`, `addBefore`, `unshift`, `push`, `addNode`, `addAfterNode`, `addBeforeNode`, `unshiftNode` or `pushNode` methods
- `popNode`: emitted when a node was removed using the `pop` method
- `unshiftNode`: emitted when a node was added using the `unshift` method
- `shiftNode`: emitted when a node was removed using the `shift` method
- `pushNode`: emitted when a node was added using the `push` method
- `addBeforeNode`: emitted when a node was added using the `addBefore` method
- `addAfterNode`: emitted when a node was added using the `addAfter` method




## Iterating over all values

Use the Iterable interface:

    for (var value of list) {
        log(value);
    }



### Iterating over all hashes

Use the Iterable interface:

    for (var key of list.keys()) {
        log(key);
    }






## Node

The node retreived via the `getNode` method has the following interface

### Hash

the hash property holds the hash this node is stored on


### HasNext

Returns true if the node has a next node in the list

    if (node.hasNext()) ...


### HasPrevious

Returns true if the node has a previous node in the list

    if (node.hasPrevious()) ...




### IsFirst

Returns true if the node is the first node in the list

    if (node.isFirst()) ...



### IsLast

Returns true if the node is the last node in the list

    if (node.isLast()) ...


### GetNext

Returns the next node in the list

    var nextNode = node.getNext();


### GetPrevious

Returns the previous node in the list

    var previousNode = node.getPrevious();
