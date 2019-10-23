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
let AppendChildToCorrectElement = (element) => {
    if (!document.getElementById("GamePreviewWindow")) {
        document.body.appendChild(element);
    }
    else {
        document.getElementById("GamePreviewWindow").appendChild(element);
    }
};
//# sourceMappingURL=func-lib.js.map