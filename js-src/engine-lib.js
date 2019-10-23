//Used for common engine functions, such as launching the game. Modify at your 
//own risk.
//Launches the game
let LaunchGame = (newWindow) => {
    if (newWindow) {
        //Launches in new browser window
        console.log("Launching in new browser window.");
        MakeGameFile();
    }
    else {
        //Launches in the current engine window
        console.error("Not yet supported.");
    }
};
//Makes the file which will play the game (.html file)
let MakeGameFile = () => {
    let test = "<head><title>This is a test</title></head>";
    let testName = "index.html";
    let blob = new Blob([test], { type: 'text/csv' });
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, testName);
    }
    else {
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = testName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};
//# sourceMappingURL=engine-lib.js.map