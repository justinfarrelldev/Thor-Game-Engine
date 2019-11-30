import { Interface } from "readline"
import { createReadStream } from "fs"

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

    class VNCharacterImages
    {
        /**
         * The images for a VN character with a map
         */

        characterImages: { [name : string]: string } = {} //name to correspond to image name
        constructor(characterImages?: {[name : string] : string}) {
        if (characterImages)
            this.characterImages = characterImages
        }

        GetImage(nickname : string) : string
        {
            return this.characterImages[nickname]
        }

        AddImage(nickname : string, imageName : string) : VNCharacterImages
        {
            this.characterImages[nickname] = imageName

            return this
        }
    }
    (Global as any).VNCharacterImages = VNCharacterImages

    class VNCharacter 
    {
        /**
         * Information about a particular character in a VN
         */

        theme : VNTheme
        name : string
        characterImages : VNCharacterImages
        constructor(name : string, theme? : VNTheme, images? : VNCharacterImages) {
            this.name = name
            this.theme = theme
            this.characterImages = images
        }

        AddImage(nickname : string, imageName : string) : VNCharacter
        {
            this.characterImages.AddImage(nickname, imageName)

            return this
        }
    }
    (Global as any).VNCharacter = VNCharacter

    class VNTheme
    {
        /**
         * A general theme for a VN which can be set on the fly
         * within each node or within a character
         */
        charTextColor : string //The styling for the character text.
        dialogueTextColor : string //The styling for the dialogue text
        textBGColor : string
        constructor(charTextColor : string, dialogueTextColor : string, textBGColor : string) {
            this.charTextColor = charTextColor
            this.dialogueTextColor = dialogueTextColor
            this.textBGColor = textBGColor
        }
 
        //Makes the theme apply when called
        ApplyTheme() : VNTheme
        {
            let VNChars = document.getElementsByClassName('VNChar') as HTMLCollectionOf<HTMLElement>
            for (let i = 0; i < VNChars.length; i++)
            {
                VNChars[i].style.color = this.charTextColor
            }

            let VNTexts = document.getElementsByClassName('VNText') as HTMLCollectionOf<HTMLElement>
            for (let i = 0; i < VNTexts.length; i++)
            {
                VNTexts[i].style.color = this.dialogueTextColor
            }

            let VNTextboxes = document.getElementsByClassName('VNTextbox') as HTMLCollectionOf<HTMLElement>
            for (let i = 0; i < VNTextboxes.length; i++)
            {
                VNTextboxes[i].style.backgroundColor = this.textBGColor
            }

            return this
        }
    }
    (Global as any).VNTheme = VNTheme

    //A visual novel template which is based in a webpage, not a canvas.
    class PageVN
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
        currentArc : VNArc
        constructor(arcs : VNArc[], startingTheme? : VNTheme) {

            if (!arcs.length)
            {
                
                console.error("The 'arc' argument of the PageVN type is not an array.");
                ThrowScriptError(new Error("The 'arc' argument of the PageVN type is not an array."))
                
            }

            let defaultTheme = new VNTheme('white', '#874BE8', 'rgba(132, 0, 255, 0.15)')

            this.arcs = arcs

            this.playspace = AddElem('div', '')
            this.playspace.style.width = '100%'
            this.playspace.style.height = '100%'
            this.playspace.style.overflow = 'hidden'

            this.textbox = AddElem('div', '')
            this.textbox.className = 'VNTextbox'
            this.textbox.style.width = '99%'
            this.textbox.style.height = '25%'
            this.playspace.appendChild(this.textbox) //The textbox should be a child of 
                                                     //the playspace 
            this.textbox.style.position = 'absolute'
            this.textbox.style.bottom = '0'
            this.textbox.style.backgroundColor = defaultTheme.textBGColor

            this.characterHeading = AddElem('h2', 'CHARACTER NAME')
            this.characterHeading.className = 'VNChar' //Access the character name anytime
            this.textbox.appendChild(this.characterHeading)  
            this.characterHeading.style.marginLeft = '4%'
            this.characterHeading.style.marginBottom = '0%'
            this.characterHeading.style.fontFamily = 'Verdana, sans-serif'
            this.characterHeading.style.fontWeight = 'bold'
            this.characterHeading.style.color = defaultTheme.charTextColor
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
            this.text.style.display = 'inline'
            this.text.style.color = defaultTheme.dialogueTextColor
            this.text.style.userSelect = 'none'
            this.text.style.msUserSelect = 'none'
            this.text.style.msTouchSelect = 'none'
            this.text.style.webkitUserSelect = 'none'

            for (let i = 0; i < arcs.length; i++)
            {
                this.arcs[i].page = this
            }

            if (this.arcs[0])
            {
                this.currentArc = arcs[0]
                this.currentArc.page = this

                if ((arcs[0].dialogueNodes[0].speaker as any).name)
                {
                    //It's a character 
                    if ((arcs[0].dialogueNodes[0].speaker as any).theme)
                    {
                        (arcs[0].dialogueNodes[0].speaker as any).theme.ApplyTheme()
                    }
                }

                const char = document.getElementsByClassName('VNChar')
                for (let i = 0; i < char.length; i++)
                {
                    if ((this.currentArc.dialogueNodes[this.currentArc.currentNode].speaker as any).name)
                    {
                        //If it's a character type
                        char[i].innerHTML = (this.currentArc.dialogueNodes[this.currentArc.currentNode].speaker as any).name

                    }
                    else
                    {
                        //If it's just a string
                        char[i].innerHTML = (this.currentArc.dialogueNodes[this.currentArc.currentNode].speaker as any)
                    }
                }

                this.currentArc.Advance()
            }

            this.CheckForInput()

        }

        CheckForInput()
        {

            let advanceChoice = () =>
            {
                this.currentArc.Advance()

                if (this.currentArc.currentNode == this.currentArc.dialogueNodes.length + 1)
                {
                    this.currentArc.choiceNode.CreateButtons()
                }
            }

            //If it's not in-editor, then add it to the body
            if (!document.getElementById('THOR-ENGINE-IN-EDITOR'))
            {
                document.body.addEventListener('click', (mouseEvent)=>
                {
                    if ((mouseEvent.target as HTMLButtonElement).className != 'ChoiceButton')
                    {
                        advanceChoice()
                    }
                })

                document.body.addEventListener('keydown', (event) => 
                {
                    if (event.keyCode === 32)
                    {
                        //space 
                        if ((event.target as HTMLButtonElement).className != 'ChoiceButton')
                        {
                            advanceChoice()
                        }                    
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
                        if ((e.target as HTMLButtonElement).className != 'ChoiceButton')
                        {
                            advanceChoice()
                        }                    
                    }
                }

                let advanceOnSpace = (e) =>
                {
                    if (e.keyCode === 32)
                    {
                        //space 
                        if ((e.target as HTMLButtonElement).className != 'ChoiceButton')
                        {
                            advanceChoice()
                        }                    
                    }
                }

                document.body.addEventListener('click', advanceOnClick)

                document.body.addEventListener('keydown', advanceOnSpace)
            }
        }
    }
    (Global as any).PageVN = PageVN

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
        choiceNode : VNChoice //For now, let's leave it at one choice at the end of the arc
        currentNode : number = 0
        thisArc : any
        page : PageVN
        constructor() {
            var index = 0;
            this.thisArc = this

        }

        //Advances the dialogue to the next node and starts printing it to the 
        //screen with scrolling. Returns the arc to allow for chaining
        Advance() : VNArc
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
                    if ((this.dialogueNodes[this.currentNode].speaker as any).name)
                    {
                        //If it's a character
                        document.getElementsByClassName('VNChar')[i].innerHTML =
                        (this.dialogueNodes[this.currentNode].speaker as any).name

                        if ((this.dialogueNodes[this.currentNode].speaker as any).theme)
                        {
                            (this.dialogueNodes[this.currentNode].speaker as any).theme.ApplyTheme()
                        }
                    }
                    else
                    {
                        //If it's a string
                        document.getElementsByClassName('VNChar')[i].innerHTML =
                        (this.dialogueNodes[this.currentNode].speaker as any)
                    }
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

                return this
            }
            else 
            {
                this.currentNode++
                return this
            }
        }

        //Adds a new dialogue node to the arc. Returns the arc to allow for chaining.
        AddNewNode(dialogue : string,
                   speaker? : string | VNCharacter, 
                   charImg? : VNCharacterImages,
                   bgImg? : string) : VNArc
        {
            if (speaker)
            {
                if ((speaker as any).theme != null && (speaker as any).theme != undefined) //If this isn't null, apply it
                {
                    (speaker as any).theme.ApplyTheme()
                }
            }
            let node = new VNNode(this, dialogue, speaker, charImg, bgImg)
            this.dialogueNodes.push(node)

            if (this.dialogueNodes.length == 1)
            {
                document.addEventListener('DOMContentLoaded', () =>
                {
                    let VNC = document.getElementsByClassName('VNChar')
                    for (let i = 0; i < VNC.length; i++)
                    {
                        if ((this.dialogueNodes[0].speaker as any).name) //If it's a VNCharacter
                        {
                            VNC[i].innerHTML = (this.dialogueNodes[0].speaker as any).name
                        }
                        else //It's a string
                        {
                            VNC[i].innerHTML = (this.dialogueNodes[0].speaker as any)
                        }
                    }

                    return this
                })
            }
            
            return this

        }

        AddNewChoice(
            buttonDialogues : string[],
            buttonArcChoices : VNArc[],
            charImg? : VNCharacterImages,
            bgImg? : string)
        {
            for (let i = 0; i < buttonArcChoices.length; i++)
            {
                buttonArcChoices[i].page = this.page
            }

            const choice = new VNChoice(this, buttonDialogues, buttonArcChoices, charImg, bgImg)
            this.choiceNode = choice
        }

        AddChoice(node : VNChoice)
        {
            this.choiceNode = node
            this.choiceNode.arc = this
        }

        //Returns the arc to allow for chaining. Adds an existing VNNode to 
        //the arc
        AddNode(node : VNNode) : VNArc
        {
            node.arc = this.thisArc
            node.indexInArc = this.dialogueNodes.length
            node.SetNode(node.dialogue, node.speaker, node.charImg, node.bgImg)
            this.dialogueNodes.push(node)
            return this
        }
    }
    (Global as any).VNArc = VNArc

    class VNChoice
    {
        /**
         * A choice node for making decisions and linking to a new arc
         */

        buttonDialogues : string[]
        buttonArcChoices : VNArc[]
        charImg : VNCharacterImages
        bgImg : string
        dialogueInterval
        arc : VNArc
        constructor(arc : VNArc,                    //Must have an arc bound to it 
                    buttonDialogues : string[], 
                    buttonArcChoices : VNArc[], 
                    charImg? : VNCharacterImages,
                    bgImg? : string) 
        {
            this.buttonDialogues = buttonDialogues
            this.buttonArcChoices = buttonArcChoices
            this.charImg = charImg
            this.bgImg = bgImg
            this.arc = arc
        }

        CreateButtons()
        {
            var textWindows = document.getElementsByClassName('VNText')

            clearInterval(this.arc.dialogueNodes[this.arc.currentNode - 2].dialogueInterval)

            let chars = document.getElementsByClassName('VNChar')
            for (let i = 0; i < chars.length; i++)
            {
                chars[i].innerHTML = ' '
            }

            for (let j = 0; j < textWindows.length; j++)
            {
                textWindows[j].innerHTML = '' //Clear the text on the text windows
                for (let i = 0; i < this.buttonDialogues.length; i++)
                {
                    let but = document.createElement('button')
                    but.innerHTML = this.buttonDialogues[i]
                    but.style.display = 'block'
                    but.style.marginTop = '1%'
                    but.style.marginLeft = '1%'
                    but.className = 'ChoiceButton'
                    but.onclick = () => {
                        //Activate another arc which this button corresponds to
                        this.arc.page.currentArc = this.buttonArcChoices[i]
                        this.arc.currentNode = 1;
                        this.arc.page.currentArc.dialogueNodes[0].ScrollText()

                        let char = document.getElementsByClassName('VNChar')
                        for (let i = 0; i < char.length; i++)
                        {
                            let speaker = (this.arc.page.currentArc.dialogueNodes[0] as any).speaker
                            char[i].innerHTML = 
                            (speaker.name) ? 
                            speaker.name : 
                            speaker

                            if (speaker.theme)
                            {
                                //It has a theme
                                speaker.theme.ApplyTheme()
                            }
                        }
                    }

                    textWindows[j].appendChild(but)
                }
            }

            return this
        }
    }
    (Global as any).VNChoice = VNChoice

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
        speaker : string | VNCharacter
        charImg : VNCharacterImages
        bgImg : string
        arc : VNArc //The arc this is in (set upon creation in arc)
        indexInArc : number //The place in the arc (set upon creation in arc)
        thisNode : VNNode
        dialogueInterval //The setInterval for scrolling text - useful for stopping
                        //text scroll
        constructor(arc : VNArc, 
                    dialogue : string, 
                    speaker? : string | VNCharacter,
                    charImg? : VNCharacterImages,
                    bgImg? : string) 
        {
            this.thisNode = this
            this.SetArc(arc)
            this.SetNode(dialogue, speaker, charImg, bgImg)
        }

        //Sets the arc of this node. Returns this node to allow for chaining.
        SetArc(arc : VNArc) : VNNode
        {
            this.arc = arc
            this.indexInArc = arc.dialogueNodes.length
            return this.thisNode
        }

        //Sets the node's properties. Returns the node to allow for chaining.
        SetNode(
            dialogue : string,    //The text inside the text box
            speaker? : string | VNCharacter, //The name of the person talking
            charImg? : VNCharacterImages,     //The image(s) paths displayed front and center
            bgImg? : string,       //The background image
            ) : VNNode
        {
            this.dialogue = (dialogue) ? dialogue : this.arc.dialogueNodes[this.indexInArc - 1].dialogue
            this.speaker = (speaker) ? speaker : this.arc.dialogueNodes[this.indexInArc-1].speaker
            this.charImg = (charImg) ? charImg : this.arc.dialogueNodes[this.indexInArc-1].charImg
            this.bgImg = (bgImg) ? bgImg : this.arc.dialogueNodes[this.indexInArc - 1].bgImg

            return this.thisNode
        }

        ScrollText() : VNNode //Scrolls the text along the screen in the elements with class "VNText".
                            //Returns this node to allow for chaining.
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

            return this
        }
    }
    (Global as any).VNNode = VNNode
}


var finished = true