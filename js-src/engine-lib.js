//Used for common engine functions, such as launching the game. Modify at your 
//own risk.
//Launches the game
let LaunchGame = (newWindow) => {
    if (newWindow) {
        //Launches in new browser window
        console.log("Launching in new browser window.");
        //Grab the stuff written in the text window and check
        //if it works as Javascript 
        let textInputWindowValue = document.getElementById('TextInputWindow').value;
        let title = "Test output game";
        //The skeleton for the file output
        let out = "<head><title>" + title + "</title></head><body>" +
            "<script>" + ReadFileOnServer("js-src/func-lib.js") + "</script>" +
            "<script>"
            + textInputWindowValue + "</script></body>";
        DownloadGameFile(out, "test.html");
    }
    else {
        //Launches in the current engine window
        console.error("Not yet supported.");
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