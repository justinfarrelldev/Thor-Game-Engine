//The code displayed in the editor when it is first opened
let CodeMirrorDefaultCode = "/*Please do not use the 'let' keyword, as\ndoing so will result in errors upon replay.\n"
    + "Please use 'var' instead.\n"
    + "\nThe inline script will always be executed last.\nUserscripts are executed" +
    " in the order in \nwhich they are created (for now).\n*/\n\n\n";
let ContextNameError = new Error('There is already a global variable with the name you are trying to supply to the Canvas context. [ContextNameError]');
ContextNameError.name = "ContextNameError";
//# sourceMappingURL=constants.js.map