//Used for common engine functions, such as launching the game. Modify at your 
//own risk.

const CheckShortcutKeys = () => 
{
    if (keysDownArr.includes(' ') && keysDownArr.includes('Control'))
    {
        LaunchGame()
    }
}

const CreateSaveObject = () => 
{

    //We want to save the project name, scripts, and general settings and then read 
    //them on project load. 

    const obj = new ProjectSave((document.getElementById('ProjectNameInput') as any).value,
                               UserScripts)

    return obj
}

//Loading, incomplete
const LoadSaveFile = () => 
{
    fetch('/projects/save.project', {method: 'GET'})
        .then((res) => 
        {
            if (res.ok)
            {
                LoadProject(res)
            }
            else
            {
                if (res.status === 404)
                {
                    console.log('No save file found, will generate a save file upon saving. ');
                    return
                }
            }

        })
}

const LoadProject = (response : Response) => //If no location is given, assume latest project
{

    response.json().then((data) => 
    {
        SetProjectUpAfterLoad(data)
    });

}

const SetProjectUpAfterLoad = (savedData) => 
{
    (document.getElementById('ProjectNameInput') as HTMLInputElement).value = savedData.name

    const el = document.getElementById('Window2Dropdown')

    for (let i = 0; i < el.childElementCount; i++)
    {
        el.removeChild(el.lastChild)
    }

    UserScripts.splice(0, UserScripts.length)

    for (let i = 0; i < savedData.scripts.length; i++)
    {
        UserScripts.pop()
        UserScripts.push(new UserScript(savedData.scripts[i].name))
        UserScripts[UserScripts.length - 1].text = savedData.scripts[i].text
    }

    UserScripts.pop() //Pop the extra one that is produced

    //Last step is now to make the CodeMirror editor have the code appear which is in
    //the first script

    editor.getDoc().setValue(UserScripts[0].text)

}

//Allows you to save a project to a user (user part is coming soon, for now saves it to a 
//project folder)
const SaveProject = (location? : string) => 
{

    const formData = new FormData()
 
    const saveObj = CreateSaveObject()

    SaveUserScriptText()

    formData.append('project-save', JSON.stringify(saveObj))

    const req = {
        method: "POST", 
        body: formData,
    }

    const SaveToFolder = () => 
    {
        
        fetch('/projects', req).then((response) => 
        {
            if (!response.ok)
            {
                console.error(response.statusText);
            }

            console.log('done');
        })

    }

    switch (location)
    {
        case "folder": 
            SaveToFolder()
            break;
    }
}

document.addEventListener('keydown', (event) =>
{
    //Must check key and keycode for almost full browser support
    if (event.key)
    {
        if (!keysDownArr.includes(event.key))
        {
            keysDownArr.push(event.key)
        }
    }
    else
    {
        //Safari more than likely
        if (!keysDownArr.includes(event.keyCode))
        {
            keysDownArr.push(event.keyCode)
        }        
    }

    CheckShortcutKeys()
})

document.addEventListener('keyup', (event) =>
{
        //Must check key and keycode for almost full browser support
        if (event.key)
        {
            keysDownArr.splice(keysDownArr.indexOf(event.key))
        }
        else
        {
            //Safari more than likely
            keysDownArr.splice(keysDownArr.indexOf(event.keyCode))
        }
})

//Launches the game
const LaunchGame = () =>
{

    //Grab the stuff written in the text window and check
    //if it works as Javascript 

    const textInputWindowValue = editor.getValue()

    ExecuteGameInEditor(textInputWindowValue)

}

//Gets called before the game is packed into a zip.
//Makes all of the game files and adds them to the
//game itself to be exported
const MakeGame = async () => 
{
    //Doctype needs to be up here as well as charset

    console.log("Starting build process...")

    //Will likely be allowed to be changed in the future
    const outFile = new HTMLFile("index.html", "")

    const title = (document.getElementById('ProjectNameInput') as any).value

    const html = outFile.MakeElement("html", "", "") //Outer HTML tag

    const head = outFile.MakeElement("head", "", "")

    outFile.NestElement(head,
                        outFile.MakeElement("title", "", title)) //Put the title in the head

    outFile.contents = outFile.NestElement(html, head).ToString() //Nest the head in the 
                                                                    //html tag

    outFile.AddElement("body", "", "");

    outFile.AddElement("script", "src = \"type-lib.js\"", "")

    outFile.AddElement("script", "src = \"vn-lib.js\"", "")

    outFile.AddElement("script", "src = \"func-lib.js\"", "")

    outFile.AddElement("script", "src = \"jquery-3.4.1.js\"", "")

    console.log("HTML file constructed in memory. Adding user scripts to build.")

    let biggest = 0;
    const scriptsInExecutionOrder : UserScript[] = [];
    for (let i = 1; i < UserScripts.length; i++)
    {
        if (UserScripts[i].executionOrder > biggest)
        {
            scriptsInExecutionOrder.push(UserScripts[i])
            biggest = UserScripts[i].executionOrder
            console.log(UserScripts[i].name + " has been added to the list of scripts in execution order.")
        }
    }
    for (let i = 0; i < scriptsInExecutionOrder.length; i++)
    {
        //Add elements to link the userscripts up
        outFile.AddElement("script", "src = \"" + scriptsInExecutionOrder[i].name + ".js\"", "")
        console.log(scriptsInExecutionOrder[i].name + " has had a script tag added in the HTML file.")

        const script = new GameFile(scriptsInExecutionOrder[i].name + '.js', '')
        script.contents = scriptsInExecutionOrder[i].text
        Game.AddFile(script)
        console.log(scriptsInExecutionOrder[i].name + " has had its file added to the build.")
    }

    outFile.AddElement("script", "", UserScripts[0].text) //Add the inline script

    console.log("The inline script has been added to the HTML file.")

    Game.AddFile(outFile.ToGameFile())

    console.log("The HTML file has been added to the game build.")

    AddLibFileToGameFiles(Game, 'js-src/func-lib.js', 'func-lib.js')

    AddLibFileToGameFiles(Game, 'js-src/type-lib.js', 'type-lib.js')

    AddLibFileToGameFiles(Game, 'js-src/vn-lib.js', 'vn-lib.js') //Adding Visual Novel library to 
                                                                 //the build. Will be checked later 
                                                                 //on to check if it's needed

    AddLibFileToGameFiles(Game, 'js-src/jquery-3.4.1.js', 'jquery-3.4.1.js')

    await new Promise(async (res, rej) => 
    {
        await GetImagesFileData().then(() => res())
    })

}

const AddLibFileToGameFiles = (game : GameFiles, src : string, name : string) => 
{
    const lib = new GameFile(name, "")

    lib.contents = ReadFileOnServer(src)

    Game.AddFile(lib)

    console.log("The function library file (" + name + ") has been added to the game build.")
}

function DeleteImageFromServer(imgName : string)
{

    //Need to do a request to the server and then act upon the request
    fetch('upload/resources/' + imgName, 
        { 
            method: 'delete'
        }).then((response) => 
        {

            if (response.ok)
            {
                console.log('The delete request was recieved and was okay.')
            }
            else
            {
                console.error('The delete request was not legitimate.')
            }
        })
}

async function GetImagesFileData()
{
    const imgs = await GetImagesOnServer('upload/resources')

    console.log("It has awaited the images on the server.")

    return await new Promise(async (resolve, rej) => 
    {
        let imgCount = 0
        console.log("Promise initiated for getting image file data.")

        if ((imgs as any).length === 0)
        {
            console.log("No images found for download. Resolving.")
            resolve()
        }

        for (let i = 0; i < (imgs as any).length; i++) //Trick typescript because we know 
        //no matter what this will be string[]
        {
            imgs[i] = imgs[i].replace(/ /g, '')
            const imgFile = new GameFile(imgs[i], '/imgs/')
            fetch('/upload/resources/' + imgs[i], 
            {
                method: "GET"
            })
            .then(async (res) => 
            {
                console.log("Fetch request successful. Awaiting blob.")
                const resBlob = await res.blob()

                console.log('"' + imgs[i] + '" has had its data recieved from the server.')

                imgFile.contents = resBlob

                imgFile.type = "image"

                Game.AddFile(imgFile)

                imgCount++

                if (imgCount == (imgs as any).length)
                {
                    console.log('All images have had their data recieved from the server.')
                    resolve()
                }
            }).catch((reason) => 
            {
                console.error("Could not fetch image data from server: " + reason)
            })
        }
    })

}

async function GetImagesOnServer(path : string) //Gets images from server with path
{

    const pathForm = new FormData()
    pathForm.append("path", path)
    return await new Promise(async (resolve, reject) => 
    {
        console.log("Sending a POST request to the server for the image files present.")
        const result = await fetch('/imgfiles', { 
            method: "POST",
            body: pathForm
        }).then((response) => 
        {
            console.log("POST request has been answered.")
            const f = response.headers.get('files')
            const fsplit = f.split(',')

            console.log("The files have been gotten from the response headers.")
    
            for (let i = 0; i < fsplit.length; i++)
            {
     
                fsplit[i] = fsplit[i].replace(' ', '')
    
                if (fsplit[i] == 'keep.gitkeep')
                {
                    console.log("keep.gitkeep has been culled from the build.")
                    fsplit.splice(i, 1)
                }
            }
    
            const images = fsplit

            console.log("Image files prepared.")
            resolve(images)
        })
    })
}

async function GetImageOnServer(name : string, directory : string) 
{
    return await new Promise(async (resolve, reject) => 
    {
        const imgTest = new GameFile(name, directory)

        //  upload/resources/name.jpg
        if (directory[directory.length - 1] != '/') //If it doesn't end in a slash
        {
            directory += '/'                        //add one so that the name can be appended
        }

        if (directory[0] == '/')    //If the first char is a slash, it should be removed
        {
            directory = directory.substr(1) //Broken... for now
        }
        imgTest.contents = await ReadImageOnServer(directory + name)

        resolve(imgTest)
    })
}

const ClearGamePreviewWindow = () => 
{
    const el = document.getElementById('GamePreviewWindow')

    el.innerHTML = null

    el.insertAdjacentHTML('afterbegin', CreateWindow('GamePreviewWindowDropdown'))
}

const ThrowScriptError = (error : Error) => 
{
    const el = document.createElement("p")
    el.innerHTML = error.name + ": " + error.message + '; ' + error.stack
    el.className = "ErrorText"
    document.getElementById("ErrorWindow").appendChild(el)
    WarnOfCommonErrors(error)
}

const PrintToConsole = (content : string) => 
{
    const el = document.createElement('p')
    el.innerHTML = content
    el.className = 'ConsoleText'
    document.getElementById('ErrorWindow').appendChild(el)
}

const WarnOfCommonErrors = (error) => 
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

    const el = document.createElement("p")
    el.innerHTML = advice
    el.className = "ErrorFix"
    document.getElementById("ErrorWindow").appendChild(el)
}

//Adds a user script to the list of user scripts
const AddUserScript = (name?) : UserScript =>
{
    console.log("Adding a user script.")

    return new UserScript(name)
}

//Changes the current user script in the CodeMirror to being 
//the script the user selects.
const ChangeUserScript = (index) : UserScript => 
{
    SaveUserScriptText()

    editor.getDoc().setValue(UserScripts[index].text)

    CurrentUserScript = index

    return null;
}

//Saves the user script text in the CodeMirror to a variable
//for the user script it corresponds to
const SaveUserScriptText = () => 
{
    if (editor.getValue() === CodeMirrorDefaultCode)
    {
        return;
    }
    UserScripts[CurrentUserScript].text = editor.getValue()
}

//Executes the game inside the editor itself (in the game preview window)
const ExecuteGameInEditor = (textInputWindowValue : string) => 
{
    SaveUserScriptText()

    Sounds.forEach((val) => 
    {
        val.pause()
    })

    if (document.getElementById("FuncLibScript"))
    {
        document.getElementById("FuncLibScript").parentNode.removeChild(document.getElementById("FuncLibScript"))
    }

    if (document.getElementById("TypeLibScript"))
    {
        document.getElementById("TypeLibScript").parentNode.removeChild(document.getElementById("TypeLibScript"))
    }

    
    if (document.getElementById("VNLibScript"))
    {
        document.getElementById("VNLibScript").parentNode.removeChild(document.getElementById("VNLibScript"))
    }

    for (let i = 0; i < document.getElementsByClassName('RuntimeUserScript').length; i++)
    {
        document.getElementsByClassName('RuntimeUserScript')[i].parentNode.removeChild(
            document.getElementsByClassName('RuntimeUserScript')[i]
        )
    }

    ClearGamePreviewWindow()

    AddDebugToolsInEditor()

    //Add dependencies first
    AddDependenciesInEditor()

    //Then add user scripts in execution order
    AddUserScriptsInEditor()
}

const AddDebugToolsInEditor = () => 
{
    //Adds in debug tools in the future
    console.error("Debugging in-editor not fully implemented");

    debug = new Debugger(); //Assigns the debugger as a new debugger

    debug.gameData = []
}

const AddUserScriptsInEditor = () => 
{
    //Make this with respect to script execution order

    const scriptsInExecutionOrder = []
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
        const script = document.createElement("script")
        script.id = scriptsInExecutionOrder[i].name
        script.setAttribute('class', 'RuntimeUserScript')
        script.type = 'text/javascript'
        const userScriptText = "try {\n" + scriptsInExecutionOrder[i].text + "\n} catch (error) { ThrowScriptError(error) }"
        const code = userScriptText

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
    const script = document.createElement("script")
    script.id = UserScripts[0].name
    script.setAttribute('class', 'RuntimeUserScript')
    script.type = 'text/javascript'
    const userScriptText = "try {\n" + UserScripts[0].text + "\n} catch (error) { ThrowScriptError(error) }"
    const code = userScriptText

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
const AddDependenciesInEditor = () => 
{
    
    const funcLib = document.createElement("script")
    funcLib.id = "FuncLibScript"
    const typeLib = document.createElement("script")
    typeLib.id = "TypeLibScript"
    const vnLib = document.createElement('script')
    vnLib.id = "VNLibScript"

    funcLib.type = 'text/javascript'
    typeLib.type = 'text/javascript'
    vnLib.type = 'text/javascript'

    var funcLibCode = ReadFileOnServer("js-src/func-lib.js")
    var typeLibCode = ReadFileOnServer("js-src/type-lib.js")
    var vnLibCode = ReadFileOnServer("js-src/vn-lib.js")
    try 
    {
        funcLib.appendChild(document.createTextNode(funcLibCode))
        typeLib.appendChild(document.createTextNode(typeLibCode))
        vnLib.appendChild(document.createTextNode(vnLibCode))
        document.getElementById("GamePreviewWindow").appendChild(typeLib)
        document.getElementById("GamePreviewWindow").appendChild(funcLib)
        document.getElementById("GamePreviewWindow").appendChild(vnLib)
    }
    catch (error)
    {
        funcLib.text = funcLibCode
        typeLib.text = typeLibCode
        vnLib.text = vnLibCode
        document.getElementById("GamePreviewWindow").appendChild(typeLib)
        document.getElementById("GamePreviewWindow").appendChild(funcLib)
        document.getElementById("GamePreviewWindow").appendChild(vnLib)
    }
}

//Downloads the file which will play the game (.html file)
const DownloadGameFile = (data : string, fileName : string) =>
{
    const blob : Blob = new Blob([data], {type: 'text/csv'})
    if (window.navigator.msSaveOrOpenBlob)
    {
        window.navigator.msSaveBlob(blob, fileName)
    }
    else
    {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }
}

const ReadFileOnServer = (path : string) : string => 
{
    
    let result = null
    
    const XMLHttp = new XMLHttpRequest()
    //For now, leaving as XMLHttpRequest. Will become fetch in the future.
    XMLHttp.open("GET", path, false)
    XMLHttp.send()
    if (XMLHttp.status === 200)
    {
        result = XMLHttp.responseText
    }
    
    return result
}

async function ReadImageOnServer (path: string)
{

    const getData = await fetch(path).then(async (response) => 
    {
        return await response.blob()
    }).catch(async (err) => 
    {
        console.error("Error happened: " + err)
        return null
    })
    
    const reader = new FileReader()
    reader.readAsArrayBuffer(getData)  //1st

    const res = new Promise(async (resolve) => 
    {
        reader.addEventListener("loadend",async () => 
        {
            resolve(await reader.result)
            return reader.result
        })
    }).catch((reason) => 
    {
        console.error("Promise did not resolve: " + reason)
    })

    return await res

}

//Displaying options windows, etc.
const OpenWindow = (window : string) => 
{
    
}