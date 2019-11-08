//Holds important classes for the engine, such as the GameFiles and File types
//NOT included in game builds

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
    AddFile(file : GameFile)
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
    contents : string
    constructor(fileName, relFilePath) 
    {
        this.fileName = fileName
        this.relFilePath = relFilePath
        this.contents
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