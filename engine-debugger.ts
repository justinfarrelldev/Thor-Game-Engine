
class Debugger
{
    gameData : any[] //Will be an array of arrays which has named indices
                     //"arcs" will be an array of the arcs in the game if applicable
    guiIsOn : boolean //True if the gui is on
    defaultDisplayValue : string
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
        const div = document.createElement("div")

        div.style.backgroundColor = "rgb(94,94,94,0.4)"
        div.style.width = "75%"
        div.style.height = "25%"
        div.id = "ThorDebuggerGUI"
        div.style.overflow = "auto"
        this.defaultDisplayValue = div.style.display

        document.getElementById('GamePreviewWindow').appendChild(div)

        this.guiIsOn = true;
    }

    HideGUI()
    {
        const gui = document.getElementById("ThorDebuggerGUI")

        gui.style.display = 'none'

        this.guiIsOn = false;
    }

    ShowGUI()
    {
        const gui = document.getElementById("ThorDebuggerGUI")
        gui.style.display = this.defaultDisplayValue

        this.BuildUI()

        this.guiIsOn = true;
    }

    BuildUI()
    {
        const gui = document.getElementById("ThorDebuggerGUI")

        //will need to make these elements nest
        const uiElement = document.createElement("div")
        const name = document.createElement('p')
        name.style.fontWeight = "bold"
        uiElement.appendChild(name)
    }

    ToggleGUI()
    {
        if (this.guiIsOn)
        {
            this.HideGUI()
        }
        else
        {
            this.ShowGUI();
        }
    }
}

class DebuggerMenuItem
{
    subItems : DebuggerMenuItem[]
    text : string
    constructor(text : string, subItems? : DebuggerMenuItem[])
    {
        this.text = text
        this.subItems = (subItems) ? subItems : null;
    }
}