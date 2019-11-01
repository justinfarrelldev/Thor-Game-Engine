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

    let title = "Test output game"

    let html = outFile.MakeElement("html", "", "") //Outer HTML tag

    let head = outFile.MakeElement("head", "", "")

    outFile.NestElement(head,
                        outFile.MakeElement("title", "", title)) //Put the title in the head

    outFile.contents = outFile.NestElement(html, head).ToString() //Nest the head in the 
                                                                    //html tag

    outFile.AddElement("body", "", "");

    outFile.AddElement("script", "src = \"type-lib.js\"", "")

    outFile.AddElement("script", "src = \"func-lib.js\"", "")

    let biggest = 0;
    let scriptsInExecutionOrder = [];
    for (let i = 1; i < UserScripts.length; i++)
    {
        if (UserScripts[i].executionOrder > biggest)
        {
            scriptsInExecutionOrder.push(UserScripts[i])
            biggest = UserScripts[i].executionOrder
        }
    }
    for (let i = 0; i < scriptsInExecutionOrder.length; i++)
    {
        //Add elements to link the userscripts up
        outFile.AddElement("script", "src = \"" + scriptsInExecutionOrder[i].name + ".js\"", "")
    }

    outFile.AddElement("script", "", UserScripts[0].text) //Add the inline script

    Game.AddFile(outFile.ToGameFile())

    let funcLib = new GameFile("func-lib.js", "")

    funcLib.contents = ReadFileOnServer("js-src/func-lib.js")

    Game.AddFile(funcLib)

    let typeLib = new GameFile("type-lib.js", "")

    typeLib.contents = ReadFileOnServer("js-src/type-lib.js")

    Game.AddFile(typeLib)

    for (let i = 0; i < scriptsInExecutionOrder.length; i++)
    {
        let file = new GameFile(scriptsInExecutionOrder[i].name + ".js", "")
        file.contents = scriptsInExecutionOrder[i].text
        Game.AddFile(file)
    }
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

    if (error.name === "ContextNameError")
    {
        advice += "In the first argument of AddCanvas(), a name is supplied for " + 
        "the Canvas' context. The name used is taken. Try supplying a different name."
    }

    if (error.message.toLowerCase() === "addstyle is not defined")
    {
        advice += "Did you mean 'SetStyle(element : any, style : string)'?"
    }

    let el = document.createElement("p")
    el.innerHTML = advice
    el.className = "ErrorFix"
    document.getElementById("ErrorWindow").appendChild(el)
}

//Adds a user script to the list of user scripts
let AddUserScript = (name?) : UserScript =>
{
    console.log("Adding a user script.")

    return new UserScript(name)
}

//Changes the current user script in the CodeMirror to being 
//the script the user selects.
let ChangeUserScript = (index) : UserScript => 
{
    SaveUserScriptText()

    editor.getDoc().setValue(UserScripts[index].text)

    CurrentUserScript = index

    return null;
}

//Saves the user script text in the CodeMirror to a variable
//for the user script it corresponds to
let SaveUserScriptText = () => 
{
    if (editor.getValue() === CodeMirrorDefaultCode)
    {
        return;
    }
    UserScripts[CurrentUserScript].text = editor.getValue()
}

//Executes the game inside the editor itself (in the game preview window)
let ExecuteGameInEditor = (textInputWindowValue : string) => 
{
    SaveUserScriptText()

    if (document.getElementById("FuncLibScript"))
    {
        document.getElementById("FuncLibScript").parentNode.removeChild(document.getElementById("FuncLibScript"))
    }

    if (document.getElementById("TypeLibScript"))
    {
        document.getElementById("TypeLibScript").parentNode.removeChild(document.getElementById("TypeLibScript"))
    }

    for (let i = 0; i < document.getElementsByClassName('RuntimeUserScript').length; i++)
    {
        document.getElementsByClassName('RuntimeUserScript')[i].parentNode.removeChild(
            document.getElementsByClassName('RuntimeUserScript')[i]
        )
    }

    ClearGamePreviewWindow()

    //Add dependencies first
    AddDependenciesInEditor()

    //Then add user scripts in execution order
    AddUserScriptsInEditor()
}

let AddUserScriptsInEditor = () => 
{
    //Make this with respect to script execution order

    let scriptsInExecutionOrder = []
    let biggest = 0;

    for (let i = 1; i < UserScripts.length; i++)
    {
        if (UserScripts[i].executionOrder > biggest)
        {
            scriptsInExecutionOrder.push(UserScripts[i])
            biggest = UserScripts[i].executionOrder
        }
    }
    for (let i = 0; i < scriptsInExecutionOrder.length; i++)
    {
        //Add elements to link the userscripts up
        let script = document.createElement("script")
        script.id = scriptsInExecutionOrder[i].name
        script.setAttribute('class', 'RuntimeUserScript')
        script.type = 'text/javascript'
        let userScriptText = "try {\n" + scriptsInExecutionOrder[i].text + "\n} catch (error) { ThrowScriptError(error) }"
        let code = userScriptText

        try
        {
            script.appendChild(document.createTextNode(code))
            document.getElementById("GamePreviewWindow").appendChild(script)
        } 
        catch(error)
        {
            script.text = code
            document.getElementById("GamePreviewWindow").appendChild(script)
        }
    }

    //Deal with inline script last as it always executes last
    let script = document.createElement("script")
    script.id = UserScripts[0].name
    script.setAttribute('class', 'RuntimeUserScript')
    script.type = 'text/javascript'
    let userScriptText = "try {\n" + UserScripts[0].text + "\n} catch (error) { ThrowScriptError(error) }"
    let code = userScriptText

    try
    {
        script.appendChild(document.createTextNode(code))
        document.getElementById("GamePreviewWindow").appendChild(script)
    } 
    catch(error)
    {
        script.text = code
        document.getElementById("GamePreviewWindow").appendChild(script)
    }
}

//Adds engine dependencies in while still in-engine
let AddDependenciesInEditor = () => 
{
    
    let funcLib = document.createElement("script")
    funcLib.id = "FuncLibScript"
    let typeLib = document.createElement("script")
    typeLib.id = "TypeLibScript"
    funcLib.type = 'text/javascript'
    typeLib.type = 'text/javascript'

    var funcLibCode = ReadFileOnServer("js-src/func-lib.js")
    var typeLibCode = ReadFileOnServer("js-src/type-lib.js")
    try 
    {
        funcLib.appendChild(document.createTextNode(funcLibCode))
        typeLib.appendChild(document.createTextNode(typeLibCode))
        document.getElementById("GamePreviewWindow").appendChild(typeLib)
        document.getElementById("GamePreviewWindow").appendChild(funcLib)
    }
    catch (error)
    {
        funcLib.text = funcLibCode
        typeLib.text = typeLibCode
        document.getElementById("GamePreviewWindow").appendChild(typeLib)
        document.getElementById("GamePreviewWindow").appendChild(funcLib)
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