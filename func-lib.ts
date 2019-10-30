//This is the function library for Thor. 
//It is used for common functions and to make syntax simple. 

function AddElem(type : string, innerHTML : string)

function AddElem(type : string, innerHTML : string, id? : string)
{
    let el = document.createElement(type)
    el.innerHTML = innerHTML

    if (id != undefined)
    {
        el.id = id
    }

    AppendChildToCorrectElement(el)

    return el
}

function AddButton(text : string, onclick : string)
//Shorthand
function AddButton(text : string, onclick : any, id? : string)
{
    let el = document.createElement("button")
    el.innerHTML = text

    if (id != undefined)
    {
        el.id = id
    }

    el.onclick = onclick

    AppendChildToCorrectElement(el)

    return el
}

//Adds canvas with optional context as well
function AddCanvas(contextName? : string, mode? : string, style? : string)
{
    let canvas = AddElem("canvas", 'Your browser does not support canvas.')

    if (contextName != null || contextName != undefined)
    {
        if (window[contextName] != undefined || window[contextName] === null)
        {
            console.error(ContextNameError.message)
            ThrowScriptError(ContextNameError)
            return;
        }
        window[contextName] = null
        if (mode != null || mode != undefined)
        {
            window[contextName] = canvas.getContext(mode)
        }
        else
        {
            window[contextName] = canvas.getContext('2d')
        }
    }

    if (style != null || style != undefined)
    {
        SetStyle(canvas, style)
    }

    return canvas
}

//Shorthand
function GetElemById(id : string)
{
    return document.getElementById(id)
}

if (AppendChildToCorrectElement === undefined)
{
    var AppendChildToCorrectElement = (element : any) => 
    {
        if (!document.getElementById("GamePreviewWindow"))
        {
            document.body.appendChild(element)
        }
        else
        {
            document.getElementById("GamePreviewWindow").appendChild(element)
        }
    }
}

//Sets style of given element to a certain style
if (SetStyle === undefined)
{
    var SetStyle = (element : any, style : string) =>
    {
        element.style = style
    }
}