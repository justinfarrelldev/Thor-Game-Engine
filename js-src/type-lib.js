//The library for types to be included in every build
//These will be useful data structure types and 
//other such structures and classes
//Currently excluded due to glitchiness
if (finished === false || finished === undefined) {
    let Global = window || global;
    //Vector 2 (position x and y + magnitude)
    class Vec2 {
        constructor(x, y, magnitude) {
            this.x = x;
            this.y = y;
            if (magnitude) {
                this.magnitude = magnitude;
            }
        }
        //Makes all values on a 0 to 1 scale
        //by dividing by the magnitude
        Normalize() {
            if (this.magnitude === undefined) {
                console.error("MissingMagnitudeError: Magnitude is undefined, thus normalization is impossible for this vector.");
            }
            this.x = this.x / this.magnitude;
            this.y = this.y / this.magnitude;
        }
    }
    class LinkedListNode {
        constructor(next, previous, data) {
            this.next = next;
            this.previous = previous;
            if (data != null) {
                this.data = data;
            }
        }
    }
    Global.LinkedListNode = LinkedListNode;
    class LinkedList {
        constructor(initialState) {
            /**
             * A class for the Linked List data structure
            */
            this.nodes = [];
            //Need to check if it's an array else unshift won't work
            if (initialState != null) {
                this.nodes = initialState;
            }
        }
        InsertAtHead(node) {
            this.nodes.unshift(node);
            this.Update();
        }
        DeleteAtHead() {
            this.nodes.shift();
            this.Update();
        }
        InsertAtEnd(node) {
            this.nodes.push(node);
            this.Update();
        }
        DeleteAtEnd() {
            this.nodes.pop();
            this.Update();
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
        //Updates next and previous values for nodes
        Update() {
            for (let i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i - 1] != undefined && this.nodes[i - 1] != null) {
                    this.nodes[i].previous = this.nodes[i - 1];
                }
                if (this.nodes[i + 1] != undefined && this.nodes[i + 1] != null) {
                    this.nodes[i].next = this.nodes[i + 1];
                }
            }
        }
    }
    Global.LinkedList = LinkedList;
    class VNWebpage {
        constructor() {
            this.playspace = AddElem('div', '');
            this.playspace.style.width = '100%';
            this.playspace.style.height = '100%';
            this.playspace.style.overflow = 'hidden';
            this.textbox = AddElem('div', '');
            this.textbox.style.width = '100%';
            this.textbox.style.height = '25%';
            this.playspace.appendChild(this.textbox); //The textbox should be a child of 
            //the playspace 
            this.textbox.style.position = 'absolute';
            this.textbox.style.bottom = '0';
            this.textbox.style.backgroundColor = 'rgba(132, 0, 255, 0.15)';
            this.characterHeading = AddElem('h2', 'CHARACTER NAME');
            this.characterHeading.className = 'VNChar'; //Access the character name anytime
            this.textbox.appendChild(this.characterHeading);
            this.characterHeading.style.marginLeft = '4%';
            this.characterHeading.style.marginBottom = '0%';
            this.characterHeading.style.fontFamily = 'Verdana, sans-serif';
            this.characterHeading.style.fontWeight = 'bold';
            this.characterHeading.style.color = 'white';
            this.text = AddElem('p', 'TEXT WILL APPEAR HERE');
            this.text.className = 'VNText'; //You can access the text at anytime with this 
            //class (class in case more than one is on 
            //the screen at once)
            this.textbox.appendChild(this.text);
            this.text.style.marginLeft = '6%';
            this.text.style.marginTop = '0.5%';
            this.text.style.fontFamily = 'Verdana, sans-serif';
            this.text.style.color = '#874BE8';
        }
    }
    Global.VNWebpage = VNWebpage;
}
var finished = true;
//# sourceMappingURL=type-lib.js.map