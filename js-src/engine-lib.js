//Used for common engine functions, such as launching the game. Modify at your 
//own risk.
//Launches the game
let LaunchGame = () => {
    //Launches in new browser window
    console.log("Launching in new browser window.");
    //Grab the stuff written in the text window and check
    //if it works as Javascript 
    let textInputWindowValue = document.getElementById('TextInputWindow').value;
    ExecuteGameInEditor(textInputWindowValue);
};
//Downloads the game as an HTML file
let DownloadGame = () => {
    let textInputWindowValue = document.getElementById('TextInputWindow').value;
    let title = "Test output game";
    //The skeleton for the file output
    let out = "<head><title>" + title + "</title></head><body>" +
        "<script>" + ReadFileOnServer("js-src/func-lib.js") + "</script>" +
        "<script>"
        + textInputWindowValue + "</script></body>";
    DownloadGameFile(out, "test.html");
};
let ClearGamePreviewWindow = () => {
    document.getElementById("GamePreviewWindow").innerHTML = null;
};
//Executes the game inside the editor itself (in the game preview window)
let ExecuteGameInEditor = (textInputWindowValue) => {
    ClearGamePreviewWindow();
    let s = document.createElement("script");
    s.id = "TextInputWindowValueScript";
    let funcLib = document.createElement("script");
    funcLib.id = "FuncLibScript";
    s.type = 'text/javascript';
    funcLib.type = 'text/javascript';
    let code = textInputWindowValue;
    let funcLibCode = ReadFileOnServer("js-src/func-lib.js");
    try {
        s.appendChild(document.createTextNode(code));
        funcLib.appendChild(document.createTextNode(funcLibCode));
        document.getElementById("GamePreviewWindow").appendChild(funcLib);
        document.getElementById("GamePreviewWindow").appendChild(s);
    }
    catch (error) {
        s.text = code;
        funcLib.text = funcLibCode;
        document.getElementById("GamePreviewWindow").appendChild(funcLib);
        document.getElementById("GamePreviewWindow").appendChild(s);
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
    XMLHttp.open("GET", path, false);
    XMLHttp.send();
    if (XMLHttp.status === 200) {
        result = XMLHttp.responseText;
    }
    return result;
};
//# sourceMappingURL=engine-lib.js.map