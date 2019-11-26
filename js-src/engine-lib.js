//Used for common engine functions, such as launching the game. Modify at your 
//own risk.
//Launches the game
let LaunchGame = () => {
    //Grab the stuff written in the text window and check
    //if it works as Javascript 
    let textInputWindowValue = editor.getValue();
    ExecuteGameInEditor(textInputWindowValue);
};
//Gets called before the game is packed into a zip.
//Makes all of the game files and adds them to the
//game itself to be exported
let MakeGame = async () => {
    //Doctype needs to be up here as well as charset
    console.log("Starting build process...");
    let outFile = new HTMLFile("test.html", "");
    let title = "Test output game";
    let html = outFile.MakeElement("html", "", ""); //Outer HTML tag
    let head = outFile.MakeElement("head", "", "");
    outFile.NestElement(head, outFile.MakeElement("title", "", title)); //Put the title in the head
    outFile.contents = outFile.NestElement(html, head).ToString(); //Nest the head in the 
    //html tag
    outFile.AddElement("body", "", "");
    outFile.AddElement("script", "src = \"type-lib.js\"", "");
    outFile.AddElement("script", "src = \"func-lib.js\"", "");
    console.log("HTML file constructed in memory. Adding user scripts to build.");
    let biggest = 0;
    let scriptsInExecutionOrder = [];
    for (let i = 1; i < UserScripts.length; i++) {
        if (UserScripts[i].executionOrder > biggest) {
            scriptsInExecutionOrder.push(UserScripts[i]);
            biggest = UserScripts[i].executionOrder;
            console.log(UserScripts[i].name + " has been added to the list of scripts in execution order.");
        }
    }
    for (let i = 0; i < scriptsInExecutionOrder.length; i++) {
        //Add elements to link the userscripts up
        outFile.AddElement("script", "src = \"" + scriptsInExecutionOrder[i].name + ".js\"", "");
        console.log(scriptsInExecutionOrder[i].name + " has had a script tag added in the HTML file.");
        let script = new GameFile(scriptsInExecutionOrder[i].name + '.js', '');
        script.contents = scriptsInExecutionOrder[i].text;
        Game.AddFile(script);
        console.log(scriptsInExecutionOrder[i].name + " has had its file added to the build.");
    }
    outFile.AddElement("script", "", UserScripts[0].text); //Add the inline script
    console.log("The inline script has been added to the HTML file.");
    Game.AddFile(outFile.ToGameFile());
    console.log("The HTML file has been added to the game build.");
    let funcLib = new GameFile("func-lib.js", "");
    funcLib.contents = ReadFileOnServer("js-src/func-lib.js");
    Game.AddFile(funcLib);
    console.log("The function library file (func-lib.js) has been added to the game build.");
    let typeLib = new GameFile("type-lib.js", "");
    typeLib.contents = ReadFileOnServer("js-src/type-lib.js");
    Game.AddFile(typeLib);
    console.log("The type library file (type-lib.js) has been added to the game build.");
    await new Promise(async (res, rej) => {
        await GetImagesFileData().then(() => res());
    });
};
async function GetImagesFileData() {
    let imgs = await GetImagesOnServer('upload/resources');
    console.log("It has awaited the images on the server.");
    return await new Promise(async (resolve, rej) => {
        let imgCount = 0;
        console.log("Promise initiated for getting image file data.");
        if (imgs.length === 0) {
            console.log("No images found for download. Resolving.");
            resolve();
        }
        for (let i = 0; i < imgs.length; i++) //Trick typescript because we know 
         
        //no matter what this will be string[]
        {
            imgs[i] = imgs[i].replace(/ /g, '');
            let imgFile = new GameFile(imgs[i], '/imgs/');
            fetch('/upload/resources/' + imgs[i], {
                method: "GET"
            })
                .then(async (res) => {
                console.log("Fetch request successful. Awaiting blob.");
                let resBlob = await res.blob();
                console.log('"' + imgs[i] + '" has had its data recieved from the server.');
                imgFile.contents = resBlob;
                imgFile.type = "image";
                Game.AddFile(imgFile);
                imgCount++;
                if (imgCount == imgs.length) {
                    console.log('All images have had their data recieved from the server.');
                    resolve();
                }
            }).catch((reason) => {
                console.error("Could not fetch image data from server: " + reason);
            });
        }
    });
}
async function GetImagesOnServer(path) {
    const pathForm = new FormData();
    pathForm.append("path", path);
    return await new Promise(async (resolve, reject) => {
        console.log("Sending a POST request to the server for the image files present.");
        let result = await fetch('/imgfiles', {
            method: "POST",
            body: pathForm
        }).then((response) => {
            console.log("POST request has been answered.");
            let f = response.headers.get('files');
            let fsplit = f.split(',');
            console.log("The files have been gotten from the response headers.");
            for (let i = 0; i < fsplit.length; i++) {
                fsplit[i] = fsplit[i].replace(' ', '');
                if (fsplit[i] == 'keep.gitkeep') {
                    console.log("keep.gitkeep has been culled from the build.");
                    fsplit.splice(i, 1);
                }
            }
            let images = fsplit;
            console.log("Image files prepared.");
            resolve(images);
        });
    });
}
async function GetImageOnServer(name, directory) {
    return await new Promise(async (resolve, reject) => {
        let imgTest = new GameFile(name, directory);
        //  upload/resources/name.jpg
        if (directory[directory.length - 1] != '/') //If it doesn't end in a slash
         {
            directory += '/'; //add one so that the name can be appended
        }
        if (directory[0] == '/') //If the first char is a slash, it should be removed
         {
            directory = directory.substr(1); //Broken... for now
        }
        imgTest.contents = await ReadImageOnServer(directory + name);
        resolve(imgTest);
    });
}
let ClearGamePreviewWindow = () => {
    document.getElementById("GamePreviewWindow").innerHTML = null;
};
let ThrowScriptError = (error) => {
    let el = document.createElement("p");
    el.innerHTML = error.name + ": " + error.message + '; ' + error.stack;
    el.className = "ErrorText";
    document.getElementById("ErrorWindow").appendChild(el);
    WarnOfCommonErrors(error);
};
let WarnOfCommonErrors = (error) => {
    var advice = "";
    if (error.message.toLowerCase() === "addelem is not defined") {
        advice += "Did you mean 'AddElem(type : string, innerHTML : string, id? : string)'?";
    }
    if (error.name === "ContextNameError") {
        advice += "In the first argument of AddCanvas(), a name is supplied for " +
            "the Canvas' context. The name used is taken. Try supplying a different name.";
    }
    if (error.message.toLowerCase() === "addstyle is not defined") {
        advice += "Did you mean 'SetStyle(element : any, style : string)'?";
    }
    let el = document.createElement("p");
    el.innerHTML = advice;
    el.className = "ErrorFix";
    document.getElementById("ErrorWindow").appendChild(el);
};
//Adds a user script to the list of user scripts
let AddUserScript = (name) => {
    console.log("Adding a user script.");
    return new UserScript(name);
};
//Changes the current user script in the CodeMirror to being 
//the script the user selects.
let ChangeUserScript = (index) => {
    SaveUserScriptText();
    editor.getDoc().setValue(UserScripts[index].text);
    CurrentUserScript = index;
    return null;
};
//Saves the user script text in the CodeMirror to a variable
//for the user script it corresponds to
let SaveUserScriptText = () => {
    if (editor.getValue() === CodeMirrorDefaultCode) {
        return;
    }
    UserScripts[CurrentUserScript].text = editor.getValue();
};
//Executes the game inside the editor itself (in the game preview window)
let ExecuteGameInEditor = (textInputWindowValue) => {
    SaveUserScriptText();
    if (document.getElementById("FuncLibScript")) {
        document.getElementById("FuncLibScript").parentNode.removeChild(document.getElementById("FuncLibScript"));
    }
    if (document.getElementById("TypeLibScript")) {
        document.getElementById("TypeLibScript").parentNode.removeChild(document.getElementById("TypeLibScript"));
    }
    for (let i = 0; i < document.getElementsByClassName('RuntimeUserScript').length; i++) {
        document.getElementsByClassName('RuntimeUserScript')[i].parentNode.removeChild(document.getElementsByClassName('RuntimeUserScript')[i]);
    }
    ClearGamePreviewWindow();
    //Add dependencies first
    AddDependenciesInEditor();
    //Then add user scripts in execution order
    AddUserScriptsInEditor();
};
let AddUserScriptsInEditor = () => {
    //Make this with respect to script execution order
    let scriptsInExecutionOrder = [];
    let biggest = 0;
    for (let i = 1; i < UserScripts.length; i++) {
        if (UserScripts[i].executionOrder > biggest) {
            scriptsInExecutionOrder.push(UserScripts[i]);
            biggest = UserScripts[i].executionOrder;
        }
    }
    for (let i = 0; i < scriptsInExecutionOrder.length; i++) {
        //Add elements to link the userscripts up
        let script = document.createElement("script");
        script.id = scriptsInExecutionOrder[i].name;
        script.setAttribute('class', 'RuntimeUserScript');
        script.type = 'text/javascript';
        let userScriptText = "try {\n" + scriptsInExecutionOrder[i].text + "\n} catch (error) { ThrowScriptError(error) }";
        let code = userScriptText;
        try {
            script.appendChild(document.createTextNode(code));
            document.getElementById("GamePreviewWindow").appendChild(script);
        }
        catch (error) {
            script.text = code;
            document.getElementById("GamePreviewWindow").appendChild(script);
        }
    }
    //Deal with inline script last as it always executes last
    let script = document.createElement("script");
    script.id = UserScripts[0].name;
    script.setAttribute('class', 'RuntimeUserScript');
    script.type = 'text/javascript';
    let userScriptText = "try {\n" + UserScripts[0].text + "\n} catch (error) { ThrowScriptError(error) }";
    let code = userScriptText;
    try {
        script.appendChild(document.createTextNode(code));
        document.getElementById("GamePreviewWindow").appendChild(script);
    }
    catch (error) {
        script.text = code;
        document.getElementById("GamePreviewWindow").appendChild(script);
    }
};
//Adds engine dependencies in while still in-engine
let AddDependenciesInEditor = () => {
    let funcLib = document.createElement("script");
    funcLib.id = "FuncLibScript";
    let typeLib = document.createElement("script");
    typeLib.id = "TypeLibScript";
    funcLib.type = 'text/javascript';
    typeLib.type = 'text/javascript';
    var funcLibCode = ReadFileOnServer("js-src/func-lib.js");
    var typeLibCode = ReadFileOnServer("js-src/type-lib.js");
    try {
        funcLib.appendChild(document.createTextNode(funcLibCode));
        typeLib.appendChild(document.createTextNode(typeLibCode));
        document.getElementById("GamePreviewWindow").appendChild(typeLib);
        document.getElementById("GamePreviewWindow").appendChild(funcLib);
    }
    catch (error) {
        funcLib.text = funcLibCode;
        typeLib.text = typeLibCode;
        document.getElementById("GamePreviewWindow").appendChild(typeLib);
        document.getElementById("GamePreviewWindow").appendChild(funcLib);
    }
};
//Downloads the file which will play the game (.html file)
let DownloadGameFile = (data, fileName) => {
    let blob = new Blob([data], { type: 'text/csv' });
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
    }
    else {
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};
let ReadFileOnServer = (path) => {
    let result = null;
    let XMLHttp = new XMLHttpRequest();
    //For now, leaving as XMLHttpRequest. Will become fetch in the future.
    XMLHttp.open("GET", path, false);
    XMLHttp.send();
    if (XMLHttp.status === 200) {
        result = XMLHttp.responseText;
    }
    return result;
};
async function ReadImageOnServer(path) {
    let getData = await fetch(path).then(async (response) => {
        return await response.blob();
    }).catch(async (err) => {
        console.error("Error happened: " + err);
        return null;
    });
    let reader = new FileReader();
    reader.readAsArrayBuffer(getData); //1st
    let res = new Promise(async (resolve) => {
        reader.addEventListener("loadend", async () => {
            resolve(await reader.result);
            return reader.result;
        });
    }).catch((reason) => {
        console.error("Promise did not resolve: " + reason);
    });
    return await res;
}
//Displaying options windows, etc.
let OpenWindow = (window) => {
};
//# sourceMappingURL=engine-lib.js.map