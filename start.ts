//The function ran on initialization of the game engine.

var editor; //CodeMirror editor

var debug; //Debugger for the engine

var Game = new GameFiles() //The files to be built 

const Windows = document.getElementsByClassName("Window")

const UserScripts : UserScript[] = [] //Creates an array of userscripts
                                    //with a default constant 
                                    //inline userscript which will be
                                    //included in the build's HTML 
                                    //file

const Sounds : HTMLAudioElement[] = [] //Sounds will be an array which will be stopped when the editor is replayed

let CurrentUserScript : number = 0; //Goes by index

new UserScript('Inline Script')

async function CreateImageIcons()
{
    
    const pathForm = new FormData()
    pathForm.append("path", 'upload/resources')

    //First off, find the files in the image directory already.
    const result = await fetch('/imgfiles', { 
        method: "POST",
        body: pathForm
    })
    .then(async (response) => 
    {
        console.log("POST request for the images in the folder /upload/resources has been answered.")
        const f = response.headers.get('files')
        const fsplit = f.split(',')

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
    })

    //Cycle through each part of result and make a new image icon for each 
    //file name inside.
    result.forEach(el => 
        {
            new ImageFileIcon(String(el).replace(/ /g, ''))
        })
}

var keysDownArr = []

const Start = async () => 
{

    console.log("Thor Game Engine is initialized and starting.")

    LoadSaveFile()

    CreateImageIcons()

} 
 
Start()