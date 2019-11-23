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
        constructor(arcs) {
            this.arcs = arcs;
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
            this.characterHeading.style.userSelect = 'none';
            this.characterHeading.style.msUserSelect = 'none';
            this.characterHeading.style.msTouchSelect = 'none';
            this.characterHeading.style.webkitUserSelect = 'none';
            this.text = AddElem('p', 'TEXT WILL APPEAR HERE');
            this.text.className = 'VNText'; //You can access the text at anytime with this 
            //class (class in case more than one is on 
            //the screen at once)
            this.textbox.appendChild(this.text);
            this.text.style.marginLeft = '6%';
            this.text.style.marginTop = '0.5%';
            this.text.style.fontFamily = 'Verdana, sans-serif';
            this.text.style.color = '#874BE8';
            this.text.style.userSelect = 'none';
            this.text.style.msUserSelect = 'none';
            this.text.style.msTouchSelect = 'none';
            this.text.style.webkitUserSelect = 'none';
            if (arcs[0]) {
                arcs[0].Advance();
            }
        }
    }
    Global.VNWebpage = VNWebpage;
    class VNArc {
        constructor() {
            /**
             * An arc of the visual novel template
             *
             *   previous choice -> arc dialogue -> next choice option 1 -> another arc 1
             *                                      next choice option 2 -> another arc 2
             *                                      next choice option 3 -> another arc 3
             *
             */
            this.dialogueNodes = [];
            this.currentNode = 0;
            var index = 0;
            this.thisArc = this;
            document.body.addEventListener('click', (mouseEvent) => {
                this.Advance();
            });
        }
        Advance() {
            if (this.dialogueNodes.length > 0 && this.dialogueNodes.length > this.currentNode) {
                if (this.dialogueNodes[this.currentNode - 1]) {
                    if (this.dialogueNodes[this.currentNode - 1].dialogueInterval) {
                        clearInterval(this.dialogueNodes[this.currentNode - 1].dialogueInterval);
                    }
                }
                this.dialogueNodes[this.currentNode].ScrollText();
                for (let i = 0; i < document.getElementsByClassName('VNChar').length; i++) {
                    document.getElementsByClassName('VNChar')[i].innerHTML =
                        this.dialogueNodes[this.currentNode].speakerName;
                }
                if (!document.getElementById("THOR-ENGINE-IN-EDITOR")) {
                    document.body.style.backgroundImage = "url(upload/resources/" + this.dialogueNodes[this.currentNode].bgImg + ")";
                    document.body.style.backgroundSize = "100% 100%";
                }
                else {
                    let previewWindow = document.getElementById('GamePreviewWindow');
                    (previewWindow) ? previewWindow.style.backgroundImage = "url(upload/resources/" + this.dialogueNodes[this.currentNode].bgImg + ")"
                        : document.body.style.backgroundImage = "url(upload/resources/" + this.dialogueNodes[this.currentNode].bgImg + ")";
                    (previewWindow) ? previewWindow.style.backgroundSize = "100% 100%"
                        : document.body.style.backgroundSize = "100% 100%";
                }
                this.currentNode++;
            }
            else {
                return;
            }
        }
        AddNewNode(dialogue, speakerName, charImg, bgImg) {
            let node = new VNNode(this, dialogue, speakerName, charImg, bgImg);
            this.dialogueNodes.push(node);
        }
        AddNode(node) {
            node.arc = this.thisArc;
            node.indexInArc = this.dialogueNodes.length;
            node.SetNode(node.dialogue, node.speakerName, node.charImg, node.bgImg);
            this.dialogueNodes.push(node);
        }
    }
    Global.VNArc = VNArc;
    class VNNode {
        //text scroll
        constructor(arc, dialogue, speakerName, charImg, bgImg) {
            this.thisNode = this;
            this.SetArc(arc);
            this.SetNode(dialogue, speakerName, charImg, bgImg);
        }
        SetArc(arc) {
            this.arc = arc;
            this.indexInArc = arc.dialogueNodes.length;
            return this.thisNode;
        }
        SetNode(dialogue, //The text inside the text box
        speakerName, //The name of the person talking
        charImg, //The image(s) paths displayed front and center
        bgImg) {
            this.dialogue = (dialogue) ? dialogue : this.arc.dialogueNodes[this.indexInArc - 1].dialogue;
            this.speakerName = (speakerName) ? speakerName : this.arc.dialogueNodes[this.indexInArc - 1].speakerName;
            this.charImg = (charImg) ? charImg : this.arc.dialogueNodes[this.indexInArc - 1].charImg;
            this.bgImg = (bgImg) ? bgImg : this.arc.dialogueNodes[this.indexInArc - 1].bgImg;
            return this.thisNode;
        }
        ScrollText() {
            var displayedText = '';
            var letter = 0; //0 to length of string
            var textWindows = document.getElementsByClassName('VNText');
            this.dialogueInterval = setInterval((handler) => {
                if (letter < this.dialogue.length) {
                    displayedText += this.dialogue[letter++];
                    for (let i = 0; i < textWindows.length; i++) {
                        textWindows[i].innerHTML = displayedText;
                    }
                }
                else {
                    clearInterval(this.dialogueInterval);
                }
            }, 50);
        }
    }
    Global.VNNode = VNNode;
}
var finished = true;
//# sourceMappingURL=type-lib.js.map