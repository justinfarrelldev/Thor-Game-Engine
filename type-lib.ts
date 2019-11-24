//The library for types to be included in every build
//These will be useful data structure types and 
//other such structures and classes
//Currently excluded due to glitchiness


if (finished === false || finished === undefined)
{
    let Global = window || global

    //Vector 2 (position x and y + magnitude)
    class Vec2
    {
        /**
         * A vector 2, which is a vector in 2 dimensional space
         * and can be a coordinate or a direction
         */
        x : number
        y : number
        magnitude : number
        constructor(x, y, magnitude?) {
            this.x = x
            this.y = y
            if (magnitude)
            {
                this.magnitude = magnitude
            }
        }

        //Makes all values on a 0 to 1 scale
        //by dividing by the magnitude
        Normalize()
        {
            if (this.magnitude === undefined)
            {
                console.error("MissingMagnitudeError: Magnitude is undefined, thus normalization is impossible for this vector.")
            } 
            this.x = this.x / this.magnitude
            this.y = this.y / this.magnitude
        }
    }

    class LinkedListNode
    {
        /*
        * A node for the Linked List data structure
        */
        next : LinkedListNode
        previous : LinkedListNode
        data : any
        constructor(next, previous, data?) {
            this.next = next
            this.previous = previous

            if (data != null)
            {
                this.data = data
            }
        }
    }

    (Global as any).LinkedListNode = LinkedListNode

    class LinkedList
    {
        /**
         * A class for the Linked List data structure
        */
        nodes : LinkedListNode[] = []
        constructor(initialState? : LinkedListNode[]) {
            //Need to check if it's an array else unshift won't work
            if (initialState != null)
            {
                this.nodes = initialState
            }
        }

        InsertAtHead(node : LinkedListNode)
        {
            this.nodes.unshift(node)

            this.Update()
        }

        DeleteAtHead()
        {
            this.nodes.shift()

            this.Update()
        }

        InsertAtEnd(node : LinkedListNode)
        {
            this.nodes.push(node)

            this.Update()
        }

        DeleteAtEnd()
        {
            this.nodes.pop()

            this.Update()
        }

        Search(data : any) : LinkedListNode
        {
            return this.nodes.find(data)
        }

        IsEmpty() : boolean
        {
            if (this.nodes.length === 0)
            {
                return true
            }
            else
            {
                return false
            }
        }

        //Updates next and previous values for nodes
        Update()
        {
            for (let i = 0; i < this.nodes.length; i++)
            {
                if (this.nodes[i-1] != undefined && this.nodes[i-1] != null)
                {
                    this.nodes[i].previous = this.nodes[i-1]
                }

                if (this.nodes[i+1] != undefined && this.nodes[i+1] != null)
                {
                    this.nodes[i].next = this.nodes[i+1]
                }
            }
        }
    }
    (Global as any).LinkedList = LinkedList 

    class VNWebpage
    {
        /**
         *  The template for creating visual novels in a webpage itself 
         * (with UI handled by actual webpage elements)
         */

        playspace : HTMLElement
        textbox : HTMLElement
        text : HTMLParagraphElement
        characterHeading : HTMLHeadingElement
        arcs : VNArc[]
        constructor(arcs : VNArc[]) {

            this.arcs = arcs

            this.playspace = AddElem('div', '')
            this.playspace.style.width = '100%'
            this.playspace.style.height = '100%'
            this.playspace.style.overflow = 'hidden'

            this.textbox = AddElem('div', '')
            this.textbox.style.width = '99%'
            this.textbox.style.height = '25%'
            this.playspace.appendChild(this.textbox) //The textbox should be a child of 
                                                     //the playspace 
            this.textbox.style.position = 'absolute'
            this.textbox.style.bottom = '0'
            this.textbox.style.backgroundColor = 'rgba(132, 0, 255, 0.15)'

            this.characterHeading = AddElem('h2', 'CHARACTER NAME')
            this.characterHeading.className = 'VNChar' //Access the character name anytime
            this.textbox.appendChild(this.characterHeading)  
            this.characterHeading.style.marginLeft = '4%'
            this.characterHeading.style.marginBottom = '0%'
            this.characterHeading.style.fontFamily = 'Verdana, sans-serif'
            this.characterHeading.style.fontWeight = 'bold'
            this.characterHeading.style.color = 'white'
            this.characterHeading.style.userSelect = 'none'
            this.characterHeading.style.msUserSelect = 'none'
            this.characterHeading.style.msTouchSelect = 'none'
            this.characterHeading.style.webkitUserSelect = 'none'
            
            this.text = AddElem('p', 'TEXT WILL APPEAR HERE')
            this.text.className = 'VNText' //You can access the text at anytime with this 
                                           //class (class in case more than one is on 
                                           //the screen at once)
            this.textbox.appendChild(this.text)
            this.text.style.marginLeft = '6%'
            this.text.style.marginTop = '0.5%'
            this.text.style.fontFamily = 'Verdana, sans-serif'
            this.text.style.fontSize = '1.2em'
            this.text.style.color = '#874BE8'
            this.text.style.userSelect = 'none'
            this.text.style.msUserSelect = 'none'
            this.text.style.msTouchSelect = 'none'
            this.text.style.webkitUserSelect = 'none'

            if (arcs[0])
            {
                arcs[0].Advance()
            }
        }
    }
    (Global as any).VNWebpage = VNWebpage

    class VNArc
    {
        /**
         * An arc of the visual novel template
         * 
         *   previous choice -> arc dialogue -> next choice option 1 -> another arc 1
         *                                      next choice option 2 -> another arc 2
         *                                      next choice option 3 -> another arc 3
         * 
         */

        dialogueNodes : VNNode[] = []
        currentNode : number = 0
        thisArc : any
        constructor() {
            var index = 0;
            this.thisArc = this

            //If it's not in-editor, then add it to the body
            if (!document.getElementById('THOR-ENGINE-IN-EDITOR'))
            {
                document.body.addEventListener('click', (mouseEvent)=>
                {
                    this.Advance()
                })

                document.body.addEventListener('keydown', (event) => 
                {
                    if (event.keyCode === 32)
                    {
                        //space 
                        this.Advance()
                    }
                })
            }
            else
            {
                //Otherwise, make sure it's clicking in the preview window so that editing 
                //does not make playtesting a pain

                let advanceOnClick = (e) => 
                {
                    let div = document.getElementById('GamePreviewWindow')
                    if (div.contains(e.target))
                    {
                        this.Advance()
                    }
                }

                let advanceOnSpace = (e) =>
                {
                    if (e.keyCode === 32)
                    {
                        //space 
                        this.Advance()
                    }
                }

                document.body.addEventListener('click', advanceOnClick)

                document.body.addEventListener('keydown', advanceOnSpace)
            }
        }

        Advance()
        {
            if (this.dialogueNodes.length > 0 && this.dialogueNodes.length > this.currentNode)
            {
                if (this.dialogueNodes[this.currentNode - 1])
                {
                    if (this.dialogueNodes[this.currentNode - 1].dialogueInterval)
                    {
                        clearInterval(this.dialogueNodes[this.currentNode - 1].dialogueInterval)
                    }
                }
                this.dialogueNodes[this.currentNode].ScrollText()
                
                for (let i = 0; i < document.getElementsByClassName('VNChar').length; i++)
                {
                    document.getElementsByClassName('VNChar')[i].innerHTML =
                    this.dialogueNodes[this.currentNode].speakerName
                }

                if (!document.getElementById("THOR-ENGINE-IN-EDITOR"))
                {
                    document.body.style.backgroundColor = 'black'
                    document.body.style.backgroundImage = "url(upload/resources/" + this.dialogueNodes[this.currentNode].bgImg + ")"
                    document.body.style.backgroundSize = "100% 100%"
                }
                else
                {
                    let previewWindow = document.getElementById('GamePreviewWindow');

                    (previewWindow) ? previewWindow.style.backgroundColor = 'black'
                                    : document.body.style.backgroundColor = 'black';

                    (previewWindow) ? previewWindow.style.backgroundImage = "url(upload/resources/" + this.dialogueNodes[this.currentNode].bgImg + ")"
                                    : document.body.style.backgroundImage = "url(upload/resources/" + this.dialogueNodes[this.currentNode].bgImg + ")";

                    (previewWindow) ? previewWindow.style.backgroundSize = "100% 100%"
                                    : document.body.style.backgroundSize = "100% 100%";
                }

                this.currentNode ++
            }
            else 
            {
                return
            }
        }

        AddNewNode(dialogue : string,
                   speakerName? : string, 
                   charImg? : string[],
                   bgImg? : string)
        {

            let node = new VNNode(this, dialogue, speakerName, charImg, bgImg)
            this.dialogueNodes.push(node)

            if (this.dialogueNodes.length == 1)
            {
                this.Advance()

                document.addEventListener('DOMContentLoaded', () =>
                {
                    let VNC = document.getElementsByClassName('VNChar')
                    for (let i = 0; i < VNC.length; i++)
                    {
                        VNC[i].innerHTML = this.dialogueNodes[0].speakerName
                    }
                })
            }

        }

        AddNode(node : VNNode)
        {
            node.arc = this.thisArc
            node.indexInArc = this.dialogueNodes.length
            node.SetNode(node.dialogue, node.speakerName, node.charImg, node.bgImg)
            this.dialogueNodes.push(node)
        }
    }
    (Global as any).VNArc = VNArc

    class VNNode 
    {
        /**
         * A VN dialogue node with dialogue, character name, a bg image, sounds to play, 
         * music to play, and character images to display.
         * 
         * If it's the same person talking, the character image can be assumed to be the
         * same. 
         */

        dialogue : string
        speakerName : string
        charImg : string[]
        bgImg : string
        arc : VNArc //The arc this is in (set upon creation in arc)
        indexInArc : number //The place in the arc (set upon creation in arc)
        thisNode : VNNode
        dialogueInterval //The setInterval for scrolling text - useful for stopping
                        //text scroll
        constructor(arc : VNArc, 
                    dialogue : string, 
                    speakerName? : string,
                    charImg? : string[],
                    bgImg? : string) 
        {
            this.thisNode = this
            this.SetArc(arc)
            this.SetNode(dialogue, speakerName, charImg, bgImg)
        }

        SetArc(arc : VNArc)
        {
            this.arc = arc
            this.indexInArc = arc.dialogueNodes.length
            return this.thisNode
        }

        SetNode(
            dialogue : string,    //The text inside the text box
            speakerName? : string, //The name of the person talking
            charImg? : string[],     //The image(s) paths displayed front and center
            bgImg? : string,       //The background image
            ) 
        {
            this.dialogue = (dialogue) ? dialogue : this.arc.dialogueNodes[this.indexInArc - 1].dialogue
            this.speakerName = (speakerName) ? speakerName : this.arc.dialogueNodes[this.indexInArc-1].speakerName
            this.charImg = (charImg) ? charImg : this.arc.dialogueNodes[this.indexInArc-1].charImg
            this.bgImg = (bgImg) ? bgImg : this.arc.dialogueNodes[this.indexInArc - 1].bgImg

            return this.thisNode
        }

        ScrollText()
        {
            var displayedText = ''
            var letter : number = 0 //0 to length of string
            var textWindows = document.getElementsByClassName('VNText')

            this.dialogueInterval = setInterval((handler) => 
            {
                if (letter < this.dialogue.length)
                {
                    displayedText += this.dialogue[letter++]
                    for (let i = 0; i < textWindows.length; i++)
                    {
                        textWindows[i].innerHTML = displayedText
                    }
                }
                else
                {
                    clearInterval(this.dialogueInterval)
                }
            }, 50)
        }
    }
    (Global as any).VNNode = VNNode
}


var finished = true