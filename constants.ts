//The code displayed in the editor when it is first opened
let CodeMirrorDefaultCode = 
"//Please do not use the 'let' keyword\n//Doing so will result in errors upon replay\n"
+ "//\n//The inline script will always be executed last\n//Userscripts are executed" + 
" in the order in \n//which they are created (for now)";

let ContextNameError = new Error('There is already a global variable with the name you are trying to supply to the Canvas context. [ContextNameError]')
ContextNameError.name = "ContextNameError"