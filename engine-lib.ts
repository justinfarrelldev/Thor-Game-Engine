//Used for common engine functions, such as launching the game. Modify at your 
//own risk.

//Launches the game
let LaunchGame = () =>
{

    //Grab the stuff written in the text window and check
    //if it works as Javascript 

    let textInputWindowValue = editor.getValue()

    ExecuteGameInEditor(textInputWindowValue)

}

//Gets called before the game is packed into a zip.
//Makes all of the game files and adds them to the
//game itself to be exported
let MakeGame = () => 
{
    //Doctype needs to be up here as well as charset

    let outFile = new HTMLFile("test.html", "")

    let textInputWindowValue = editor.getValue()

    let title = "Test output game"

    let html = outFile.MakeElement("html", "", "") //Outer HTML tag

    let head = outFile.MakeElement("head", "", "")

    outFile.NestElement(head,
                        outFile.MakeElement("title", "", title)) //Put the title in the head

    outFile.contents = outFile.NestElement(html, head).ToString() //Nest the head in the 
                                                                    //html tag

    outFile.AddElement("body", "", "");

    outFile.AddElement("script", "src = \"func-lib.js\"", "")

    outFile.AddElement("script", "", textInputWindowValue)

    Game.AddFile(outFile.ToGameFile())

    let funcLib = new GameFile("func-lib.js", "")

    funcLib.contents = ReadFileOnServer("js-src/func-lib.js")

    Game.AddFile(funcLib)
}

let ClearGamePreviewWindow = () => 
{
    document.getElementById("GamePreviewWindow").innerHTML = null
}

let ThrowScriptError = (error) => 
{
    let el = document.createElement("p")
    el.innerHTML = error.name + ": " + error.message
    el.className = "ErrorText"
    document.getElementById("ErrorWindow").appendChild(el)
    WarnOfCommonErrors(error)
}

let WarnOfCommonErrors = (error) => 
{
    var advice = "";
    if (error.message.toLowerCase() === "addelem is not defined")
    {
        advice += "Did you mean 'AddElem(type : string, innerHTML : string, id? : string)'?"
    }

    let el = document.createElement("p")
    el.innerHTML = advice
    el.className = "ErrorFix"
    document.getElementById("ErrorWindow").appendChild(el)
}

//Executes the game inside the editor itself (in the game preview window)
let ExecuteGameInEditor = (textInputWindowValue : string) => 
{

    if (document.getElementById("FuncLibScript"))
    {
        document.getElementById("FuncLibScript").parentNode.removeChild(document.getElementById("FuncLibScript"))
    }

    if (document.getElementById("TextInputWindowValueScript"))
    {
        document.getElementById("TextInputWindowValueScript").parentNode.removeChild(document.getElementById("TextInputWindowValueScript"))
    }

    ClearGamePreviewWindow()

    let s = document.createElement("script")
    s.id = "TextInputWindowValueScript"
    let funcLib = document.createElement("script")
    funcLib.id = "FuncLibScript"
    s.type = 'text/javascript'
    funcLib.type = 'text/javascript'

    var code = textInputWindowValue

    let userScriptText = "try {\n" + textInputWindowValue + "\n} catch (error) { ThrowScriptError(error) }"

    code = userScriptText
    var funcLibCode = ReadFileOnServer("js-src/func-lib.js")
    try 
    {
        s.appendChild(document.createTextNode(code))
        funcLib.appendChild(document.createTextNode(funcLibCode))
        document.getElementById("GamePreviewWindow").appendChild(funcLib)
        document.getElementById("GamePreviewWindow").appendChild(s)
    }
    catch (error)
    {
        s.text = code
        funcLib.text = funcLibCode
        document.getElementById("GamePreviewWindow").appendChild(funcLib)
        document.getElementById("GamePreviewWindow").appendChild(s)
    }
}

//Downloads the file which will play the game (.html file)
let DownloadGameFile = (data : string, fileName : string) =>
{
    let blob : Blob = new Blob([data], {type: 'text/csv'})
    if (window.navigator.msSaveOrOpenBlob)
    {
        window.navigator.msSaveBlob(blob, fileName)
    }
    else
    {
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }
}

let ReadFileOnServer = (path : string) : string => 
{
    let result = null
    
    let XMLHttp = new XMLHttpRequest()
    //Possibly use fetch?
    XMLHttp.open("GET", path, false)
    XMLHttp.send()
    if (XMLHttp.status === 200)
    {
        result = XMLHttp.responseText
    }
    
    return result
}