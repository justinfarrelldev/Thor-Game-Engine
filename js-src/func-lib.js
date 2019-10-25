//This is the function library for Thor. 
//It is used for common functions and to make syntax simple. 
function AddElem(type, innerHTML, id) {
    let el = document.createElement(type);
    el.innerHTML = innerHTML;
    if (id != undefined) {
        el.id = id;
    }
    AppendChildToCorrectElement(el);
    return el;
}
//Shorthand
function AddButton(text, onclick, id) {
    let el = document.createElement("button");
    el.innerHTML = text;
    if (id != undefined) {
        el.id = id;
    }
    el.onclick = onclick;
    AppendChildToCorrectElement(el);
    return el;
}
//Shorthand
function GetElemById(id) {
    document.getElementById(id);
}
if (AppendChildToCorrectElement === undefined) {
    var AppendChildToCorrectElement = (element) => {
        if (!document.getElementById("GamePreviewWindow")) {
            document.body.appendChild(element);
        }
        else {
            document.getElementById("GamePreviewWindow").appendChild(element);
        }
    };
}
//Sets style of given element to a certain style
if (SetStyle === undefined) {
    var SetStyle = (element, style) => {
        element.style = style;
    };
}
//# sourceMappingURL=func-lib.js.map