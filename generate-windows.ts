//Generate the various engine window panes from HTML elements

//This code is so temporary that it isn't even funny

const CreateWindow = (windowName : string) => 
{
    if (windowName === 'GamePreview')
    {
        const GamePreviewHTML = 
        '<div id = "GamePreviewWindow" class = "Window">'
        +
        '<!--Elements are added to this to simulate gameplay.-->'

        +'    <!--Dropdown for preview menu-->'
        +    '<div class = "DropdownDiv">'
        +            '<ul class = "Dropdown" onselectstart = "return false;">'
        +                '<li style = "position: absolute">'
                   +         '<button onclick = "DropdownOpenClose(' + "'Window1Dropdown'" + ')" title = '
                   +         '"Switch this window mode.">↩️</button>'
                   +         '<ul class = "DropdownSubmenu" id = "Window1Dropdown">'        
                   +             '<li class = "DropdownItem1" onclick = "ChangeWindow(' + "'GamePreview', 'Window1Div'" + ')">Game Preview</li>'
                   +             '<li class = "DropdownItem1" onclick = "ChangeWindow(' + "'ErrorLog', 'Window1Div'" + ')">Error Log</li>'
                   +         '</ul>'
         +               '</li>'
         +           '</ul>'
         +   '</div>'
         +   '<!--End of dropdown for preview menu-->'
    
        + '</div>'

        return GamePreviewHTML
    }
    else if (windowName === 'GamePreviewWindowDropdown')
    {
        const el = 
            '<div class = "DropdownDiv">'
        +            '<ul class = "Dropdown" onselectstart = "return false;">'
        +                '<li style = "position: absolute">'
                   +         '<button onclick = "DropdownOpenClose(' + "'Window1Dropdown'" + ')" title = '
                   +         '"Switch this window mode.">↩️</button>'
                   +         '<ul class = "DropdownSubmenu" id = "Window1Dropdown">'        
                   +             '<li class = "DropdownItem1" onclick = "ChangeWindow(' + "'GamePreview', 'Window1Div'" + ')">Game Preview</li>'
                   +             '<li class = "DropdownItem1" onclick = "ChangeWindow(' + "'ErrorLog', 'Window1Div'" + ')">Error Log</li>'
                   +         '</ul>'
         +               '</li>'
         +           '</ul>'
         +   '</div>'

         return el
    }
    else if (windowName === 'ErrorLog')
    {
        const el = 
        '        <div id = "ErrorWindow" class = "Window">'
       + '<!--Dropdown for preview menu-->'
       + '<div class = "DropdownDiv">'
         +       '<ul class = "Dropdown" onselectstart = "return false;">'
             +       '<li style = "position: absolute">'
                  +      '<button onclick = "DropdownOpenClose(' + "'Window3Dropdown'" + ')" title = '
                  +      '"Switch this windows mode.">↩️</button>'
                   +     '<ul class = "DropdownSubmenu" id = "Window3Dropdown">'        
                     +       '<li class = "DropdownItem1" onclick = "ChangeWindow(' + "'ErrorLog', 'Window2Div'" + ')">Error Log</li>'
                     +       '<li class = "DropdownItem1" onclick = "ChangeWindow(' + "'GamePreview', 'Window2Div'" + ')">Game Preview</li>'
                     +   '</ul>'
                +    '</li>'
            +    '</ul>'
        +    '</div>'
       +     '<!--End of dropdown for preview menu-->'
     +   '<p>Errors will show up here when they occur.</p>'
  +  '</div>'

        return el;
    }
    else
    {
        console.error('The window name specified was not found')
    }
}