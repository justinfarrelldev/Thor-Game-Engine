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