//Change the windows which are present in the editor.
let ChangeWindow = (windowToChangeTo, idOfParent) => {
    let parent = document.getElementById(idOfParent);
    while (parent.hasChildNodes()) {
        parent.removeChild(parent.firstChild);
    }
    parent.insertAdjacentHTML('afterbegin', CreateWindow(windowToChangeTo));
    parent.style.height = '50%';
};
//# sourceMappingURL=change-windows.js.map