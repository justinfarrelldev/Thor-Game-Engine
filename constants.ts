//The code displayed in the editor when it is first opened
let CodeMirrorDefaultCode = 
"//Please do not use the 'let' keyword\n//Doing so will result in errors upon replay\n"
+ "//\n//For a list of available Thor Engine functions, see the readme\n\n";

let ContextNameError = new Error('There is already a global variable with the name you are trying to supply to the Canvas context. [ContextNameError]')
ContextNameError.name = "ContextNameError"