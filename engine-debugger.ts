
class Debugger
{
    gameData : any[] //Will be an array of arrays which has named indices
                     //"arcs" will be an array of the arcs in the game if applicable
    constructor()
    {
        if (!document.getElementById("THOR-ENGINE-IN-EDITOR"))
        {
            console.error("The debugger should not work outside of the editor, yet it is attempting to.")
        }
        console.log("Thor Debugger now working.")
        this.AddGUI()
    }

    AddGUI()
    {
        let div = document.createElement("div")

        div.style.backgroundColor = "rgb(94,94,94,0.4)"
        div.style.width = "75%"
        div.style.height = "25%"

        document.getElementById('GamePreviewWindow').appendChild(div)

    }
}