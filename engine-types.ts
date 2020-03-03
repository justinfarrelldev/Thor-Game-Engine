//Holds important classes for the engine, such as the GameFiles and File types
//NOT included in game builds

class ProjectSave
{
    name : string
    scripts : UserScript[]
    /**
     * A save for a project made with the engine
     * (saved in JSON format and read back into this format)
     */
    constructor(name : string, scripts : UserScript[]) 
    {
        this.name = name
        this.scripts = scripts    
    }
}

class GameFiles
{
    /**
     *The files for the exported games
     */
    files : GameFile[]
    constructor() 
    {
        this.files = []
    }

    //Pushes a file to the Game Files array
    AddFile(file : any)
    {
        this.files.push(file)
    }

    //Takes a file out of the Game Files array
    RemoveFile(file : GameFile)
    {
        for (let i = 0; i < this.files.length; i++)
        {
            if (file === this.files[i])
            {
                this.files.splice(i)
                break
            }
        }
    }
}

class GameFile
{
    /**
     *A singular game file 
     */
    fileName : string
    relFilePath : string
    contents : any
    type : string   //'image', 'sound', ''
    constructor(fileName, relFilePath) 
    {
        this.fileName = fileName
        this.relFilePath = relFilePath
        this.contents
        this.type = ""
    }
}

//Verbose to avoid redefinition
class HTMLFileElement 
{
    /**
     *The class for an HTML element
     */
    contents : string //Element as string
    innerHTML : string
    elementName : string
    attributes : string
    constructor(elementName : string, attribs : string, contents : string) 
    {
        this.innerHTML = contents
        this.elementName = elementName
        this.attributes = attribs
        this.contents = "<" + elementName + " " + attribs + ">" + this.innerHTML + "</"
         + elementName + ">"        
    }

    ChangeInnerHTML(innerHTML : string)
    {
        this.innerHTML = innerHTML
        this.contents = "<" + this.elementName + " " + this.attributes + ">" + this.innerHTML + "</"
        + this.elementName + ">"        

    }

    ToString()
    {
        return this.contents
    }

}

class HTMLFile extends GameFile
{
    /**
     *Creates a HTML file. Add attributes as one continuous string
     */
    constructor(fileName : string, relFilePath : string) 
    {
        super(fileName, relFilePath)
    }

    MakeElement(element : string, attribs : string, contents : string) : HTMLFileElement
    {
        return new HTMLFileElement(element, attribs, contents)
    }

    //Nests an element within an element
    NestElement(parentElement : HTMLFileElement, childElement : HTMLFileElement) : HTMLFileElement
    {
        parentElement.ChangeInnerHTML(childElement.ToString())
        return parentElement
    }

    AddElement(element : string, attribs : string, contents : string)
    {
        this.contents += "<" + element + " " + attribs + ">" + contents + "</"
         + element + ">"
    }

    ToGameFile() : GameFile
    {
        let file = new GameFile(this.fileName, this.relFilePath)
        file.contents = this.contents

        return file
    }
}

class UserScript 
{
    /**
     * For scripts defined by the user
     */

    index : number //The spot it has in the list of scripts displayed to the user
                   //USED SOLELY for display purposes - execution order is handled
                   //by the execution order member (starts at 0)
    text : string //The text inside of the script
    filePath : string //The path to the script
    executionOrder : number //The number in the list in which this script is executed
                            //(starts at 0)
    name : string //The name of the script
    constructor(name? :string) 
    {    
        if (name != null)
        {
            this.name = name
        }
        else
        {
            this.name = "UserScript" + UserScripts.length.toString()
        }

        this.executionOrder = UserScripts.length

        this.index = UserScripts.length

        this.text = CodeMirrorDefaultCode

        $(document).ready(() => {
            let mid = Math.round($('#Window2Dropdown li').length)
            $('#Window2Dropdown li:nth-child(' + mid + ')').after(
                '<li class = "DropdownItem2" onclick = "ChangeUserScript(' + this.index + ')">' + this.name + '</li>'
                )
        })

        UserScripts.push(this) 

    }
}

class ImageFileIcon
{
    /**
     * The file icons in the file explorer
     */
    name : string
    constructor(name : string) {

        this.name = name

        var ext = name.split('.').pop()
        

        let el = document.createElement('div')
        el.style.height = '33%'
        el.style.maxWidth = "10%"
        el.style.margin = '15%'
        el.style.marginBottom = '10%'
        el.style.display = 'inline-block'
        el.style.backgroundColor = 'gray'

        var behavior = this.DetermineBehavior(ext)
 
        if (behavior == 'img')
        {
            let img = document.createElement('img')
            img.src = '/upload/resources/' + name
            img.style.width = 'auto'
            img.style.height = '100%'
            img.style.margin = '1%'
            img.style.marginBottom = '0%'
            img.style.marginRight = '2%'
            img.style.textAlign = 'center'
            img.alt = name
            img.title = name

            el.appendChild(img)
        }
        else if (behavior == 'text')
        {
            let head = document.createElement('h1')
            head.style.margin = '0px'
            head.style.padding = '0px'
            head.innerHTML = '📄'
            el.appendChild(head)
        }
        else if (behavior == 'sound')
        {
            let head = document.createElement('h1')
            head.style.margin = '0px'
            head.style.padding = '0px'
            head.innerHTML = '🎵'
            el.appendChild(head)
        }

        let text = document.createElement('p')
        text.style.width = '100%'
        text.style.height = '45%'
        text.style.marginTop = '0%'
        text.style.fontFamily = 'monospace, sans-serif'
        text.style.fontSize = '14px'
        text.style.whiteSpace = 'initial'
        text.style.position = 'relative'
        text.style.wordBreak = 'break-all'
        text.innerHTML = name

        el.appendChild(text)


        //Create delete button for image to remove it from the server
        let delBut = document.createElement('button')
        delBut.innerHTML = 'DELETE'
        delBut.style.marginTop = '100%'
        delBut.onclick = (event) => 
        {
            DeleteImageFromServer(name)
            let parent = el.parentNode

            parent.removeChild(el)
        }

        el.appendChild(delBut)

        document.getElementById('File_Explorer').appendChild(el)
    }

    DetermineBehavior(extension : string) //Determines what kind of image will
                                          //be displayed
    {
        extension = extension.toLowerCase()
        switch(extension) 
        {
            case 'png': 
                return 'img'
            case 'txt': 
                return 'text'
            case 'jpg':
                return 'img'
            case 'tif': 
                return 'img'
            case 'tiff': 
                return 'img'
            case 'gif': 
                return 'img'
            case 'mp3' || 'wav' || 'wma' || 'ogg':
                return 'sound'
            default: 
                console.log('Returning with text from default');
                return 'text'
        }
    }
}

class EngineWindow
{
    /**
     * For options windows, etc
     * 
     * PRESETS
     *      Preset 0: Double section options menu (left menu for section / page, and right 
     *                for details)
     */
    title : string
    preset : number
    div : HTMLDivElement
    sectionMembers1 : string[]
    constructor(title : string, preset : number, sectionMembers1 : string[]) {
        this.title = title
        this.preset = preset
        this.sectionMembers1 = sectionMembers1

        let head = document.createElement('h1')
        head.innerHTML = title
        head.style.fontFamily = 'monospace, sans-serif'

        let el = document.createElement('div')
        this.div = el
        this.div.style.backgroundColor = 'white'
        this.div.style.border = '1px solid gray'
        this.div.style.position = 'absolute'
        this.div.style.bottom = '25%' 
        this.div.style.width = '45%'
        this.div.style.left = '25%'
        this.div.style.zIndex = '11'
        this.div.style.height = '50%'

        this.div.appendChild(head)

        document.body.appendChild(this.div)

        this.CreatePreset(preset)
    }

    CreatePreset(preset : number)
    {
        switch (preset)
        {
            case 0: 
                    let element = document.createElement('div')
                    element.style.width = '50%'
                    element.style.border = '1px solid black'
                    element.style.height = '72%'
                    element.style.marginBottom = '3%'
                    element.style.marginLeft = '3%'

                    for (let i = 0; i < this.sectionMembers1.length; i++)
                    {
                        let but = document.createElement('button')
                        element.appendChild(but)
                        but.style.width = '100%'
                        but.innerHTML = this.sectionMembers1[i]
                    }

                    this.div.appendChild(element)
                break;
        }
    }
}
