# Thor Game Engine
 The Thor web-based Game Engine, created with Typescript. 

# Purpose
Thor is meant to be used to create small, lightweight web games (such as gacha games and 
visual novels). I plan to expand it as I work on more projects inside of Thor, so 
in the future it will likely have many more features.

# Features
**1st Nov, 2019**
- Can export games to a new webpage (.zip file with HTML file and scripts inside) with multiple 
custom scripts included
- Can test games inside of Thor's game window (left side) using the play button
- Can use multiple custom scripts (Javascript) to control the game
- Thor includes a few library functions which you can use to quickly develop new games (see below)

# Update Notes
**4th Nov, 2019**
- The entire engine is now a fully-fledged Node.JS server (this is my first time making a server, I am quite proud). You can run the server the old way (double click index.html) or by running a Node server and using index.js instead. In the future, the only way to properly run it will be with a server. This will likely be the last update where the engine will still function the old way.

# How to Use Thor
As of right now, Thor can work client-side correctly for testing out games (double click index.html). However, it cannot save or download the game unless it is launched within a NodeJS server.

# To-Do
**Updated 4th Nov, 2019**
- Fix vulnerabilities
- Add support for uploading custom images to Thor (similar to Unity's file viewer)
- Create a file viewer with Javascript (similar to Unity's project file viewer) with drag and drop capability. This will be so much easier with the engine now being a server.
- Add more library functions (especially for making UI and WebGL)
- Make Thor download files correctly while not launched on a server
- Fix warnings about using XMLHttpRequest (not an immediate priority)
- Add configuration options for Thor (likely stored in the browser cache)
- Add JQuery support to exported games
- Possibly add support for Typescript
- Incorporate shortcut keys to hide UI elements
- Swap the AddCanvas arguments so that the mode is first and the context name is second
- Split the function library into multiple files and only include files which are actually used

# Function Library (Updated 31st Oct, 2019)
Thor includes a function library which can be used to create your game quickly and with 
minimal effort. The functions are listed below (? means that an argument is optional): 

- AddElem(type, innerHTML, id?)     [returns the element]
  - Adds a new element to the scene of type "type" which has the inner HTML "innerHTML" 
with an optional id "id". For example, to create a new heading, write the following: 
  ```
  AddElem("h1", "Hello world")
  ```

- AddButton(text, onclick, id?)     [returns the button]
  - Adds a new button to the scene with text "text" and which has a handler of "onclick"
  and an optional id "id". For example, to make a new button which says "Click me" 
  and which calls a function "DoStuff()", write the following: 
  ```
  AddButton("Click me", DoStuff)
  ```

- AddCanvas(contextName?, mode?, style?)     [returns the element]
  - Adds a new Canvas to the scene for rendering use. The optional contextName argument will
  name a context to be optionally added to the scene. The optional mode argument will set
  the mode between 2D and 3D variants. The optional style argument can be used to supply 
  a CSS styling to the Canvas. For example, to create a new Canvas with a context named
  "ctx", a type of "2d", and a solid border, write the following:
  ```
  AddCanvas('ctx', '2d', 'border-style: solid')
  ```
  
- GetElemById(id)                 [returns the requested element]
  - A shorthand for document.getElementById. Check documentation on that function
  for more info.
