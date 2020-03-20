//Change the windows which are present in the editor.

const ChangeWindow = (windowToChangeTo : string, idOfParent : string) =>
{
    const parent = document.getElementById(idOfParent)
    while(parent.hasChildNodes())
    {
        parent.removeChild(parent.firstChild)
    }
    parent.insertAdjacentHTML('afterbegin', CreateWindow(windowToChangeTo))
    parent.style.height = '50%';
}