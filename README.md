# Thor Game Engine
 The Thor Game Engine, created with Typescript. 

# Purpose
Thor is meant to be used to create small, lightweight web games (such as gacha games and 
visual novels). I plan to expand it as I work on more projects inside of Thor, so 
in the future it will likely have many more features.

# Features
**27th Oct, 2019**
- Can export games to a new webpage (.html file) with a single custom script included
- Can test games inside of Thor's game window (left side) using the play button
- Can use a custom script (Javascript) to control the game
- Thor includes a few library functions which you can use to quickly develop new games (see below)

# Update Notes
**27th Oct, 2019**
- Updated this document

# To-Do
**As of 27th Oct, 2019**
- Add support for multiple (not just one) script
- Make the CodeMirror code viewport properly recognize functions defined in the function library.
- Add support for exporting as a .zip file (so that images can be included in exported games)
- Add support for uploading custom images to Thor (similar to Unity's file viewer)
- Add more library functions (especially for making UI and WebGL)
- Fix warnings about using XMLHttpRequest (not an immediate priority)
- Add configuration options for Thor (likely stored in the browser cache)
- Add JQuery support to exported games

# Function Library (as of Oct 27th, 2019)
Thor includes a function library which can be used to create your game quickly and with 
minimal effort. The functions are listed below (for now): 

- AddElem(type, innerHTML, ?id)     [returns the element]
  - Adds a new element to the scene of type "type" which has the inner HTML "innerHTML" 
with an optional id "id". For example, to create a new heading, write the following: 
  ```
  AddElem("h1", "Hello world")
  ```

- AddButton(text, onclick, ?id)     [returns the button]
  - Adds a new button to the scene with text "text" and which has a handler of "onclick"
  and an optional id "id". For example, to make a new button which says "Click me" 
  and which calls a function "DoStuff()", write the following: 
  ```
  AddButton("Click me", DoStuff)
  ```
  
- GetElemById(id)                 [returns the requested element]
  - A shorthand for document.getElementById. Check documentation on that function
  for more info.
