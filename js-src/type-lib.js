//The library for types to be included in every build
//These will be useful data structure types and 
//other such structures and classes
//Currently excluded due to glitchiness
class LinkedListNode {
    constructor(next, previous, data) {
        this.next = next;
        this.previous = previous;
        if (data != null) {
            this.data = data;
        }
    }
}
class LinkedList {
    constructor(initialState) {
        if (initialState != null) {
            this.nodes = initialState;
        }
    }
    InsertAtHead(node) {
        this.nodes.unshift(node);
    }
    DeleteAtHead() {
        this.nodes.shift();
    }
    InsertAtEnd(node) {
        this.nodes.push(node);
    }
    DeleteAtEnd() {
        this.nodes.pop();
    }
    Search(data) {
        return this.nodes.find(data);
    }
    IsEmpty() {
        if (this.nodes.length === 0) {
            return true;
        }
        else {
            return false;
        }
    }
}
//# sourceMappingURL=type-lib.js.map