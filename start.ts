//The function ran on initialization of the game engine.

var editor; //CodeMirror editor

var Game = new GameFiles() //The files to be built 

let Windows = document.getElementsByClassName("Window")

let UserScripts : UserScript[] = [] //Creates an array of userscripts
                                    //with a default constant 
                                    //inline userscript which will be
                                    //included in the build's HTML 
                                    //file

let CurrentUserScript : number = 0; //Goes by index

new UserScript('Inline Script')

let Start = async () => 
{
    console.log("Thor Game Engine is initialized and starting.")


    const pathForm = new FormData()
    pathForm.append("path", 'upload/resources')

    //First off, find the files in the image directory already.
    let result = await fetch('/imgfiles', { 
        method: "POST",
        body: pathForm
    }).then(async (response) => 
    {
        console.log("POST request has been answered.")
        let f = response.headers.get('files')
        let fsplit = f.split(',')

        console.log("The files have been gotten from the response headers.")

        for (let i = 0; i < fsplit.length; i++)
        {
 
            fsplit[i] = fsplit[i].replace(' ', '')

            if (fsplit[i] == 'keep.gitkeep')
            {
                console.log("keep.gitkeep has been culled.")
                fsplit.splice(i, 1)
            }
        }

        return fsplit
    }
    )

    result.forEach(el => 
        {
            let imgIcon = new ImageFileIcon(String(el))
        })
} 
 
Start()