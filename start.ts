//The function ran on initialization of the game engine.

var editor; //CodeMirror editor

var Game = new GameFiles() //The files to be built 

let Windows = document.getElementsByClassName("Window")

let UserScripts : UserScript[] = [] //Creates an array of userscripts
                                                                   //with a default constant 
                                                                   //inline userscript which will be
                                                                   //included in the build's HTML 
                                                                   //file

new UserScript('Inline Script')

let Start = () => 
{
    console.log("Thor Game Engine is initialized and starting.")
} 
 
Start()