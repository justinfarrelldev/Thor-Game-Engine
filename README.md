# Thor Game Engine
 The Thor web-based Game Engine, created with Typescript. 

# Purpose
Thor is meant to be used to create small, lightweight web games (such as gacha games and 
visual novels). I plan to expand it as I work on more projects inside of Thor, so 
in the future it will likely have many more features.

# Features
**14th Dec, 2019**
- Can export games to a new webpage (.zip file with HTML file and scripts inside) with multiple 
custom scripts included as well as multiple uploaded images
- Can test games inside of Thor's game window (left side) using the play button or the shortcut
(ctrl + space)
- Can use multiple custom scripts (Javascript) to control the game
- Thor includes a multitude of library functions which you can use to quickly develop new games (see below)

# Update Notes
**14th Dec, 2019**
- Added a shortcut for playing the game in-engine (ctrl + space)
- Added the ability to delete images from the engine

# How to Use Thor
To run Thor, first install npm (Node Package Manager) and the Typescript transpiler. 
## Compiling the Typescript
Navigate to the root of the downloaded project in the command line and then type 
tsc to transpile the Typescript files into Javascript files. These will be put into 
the js-src folder. Once it starts reporting changes, press ctrl+c to cancel it out. 
This will leave the JS files and allow you to use the command line again. 
## Getting the dependencies
Next, type "npm install" into the command line. This will install the dependencies into 
the node_modules folder. 
## Starting the local server
Finally, type "node index.js" to start the server. Navigate to http://localhost:80/
inside of your browser and Thor should be displayed. Have fun! 

# To-Do
**Updated 14th Dec, 2019**
- Make the website have a login and authentication screen (not posted to Github of course,
lest there be a giant vulnerability)
- Implement saving of projects (this will be after the login and authentication is 
finished and will likely be tied to a specific user)
- Add support for switching windows to the selected types
- Enhance the file viewer (similar to Unity's project file viewer) with drag and drop capability
as well as more interactability. 
- Add more library functions (especially for interaction with images and more game interactability)
- Fix warnings about using XMLHttpRequest (not an immediate priority)
- Add configuration options for Thor (likely stored in the browser cache)
- Add JQuery support to exported games
- Incorporate shortcut keys to hide UI elements
- Swap the AddCanvas arguments so that the mode is first and the context name is second
- Split the function library into multiple files and only include files which are actually used

# Function Library (Updated 23rd Nov, 2019)
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
  
- AddCanvasImage(contextName, imgName, x?, y?)
  - Adds an image to the Canvas with the context contextName. imgName corresponds to the 
  filename of an image uploaded to Thor using the File Explorer. The optional x and y
  values are coordinates for Canvas. To add "my-image.png" to a Canvas with a context
  named "ctx" at coordinates "100, 200", write the following: 

  ```
  AddCanvasImage('ctx', 'my-image.png', 100, 200)
  ```

- AddImage(imgName, marginLeft?, marginTop?)      [returns the created image element]
  - Adds an image to the page with the name imgName (imgName should be the filename of an image uploaded to Thor using the File Explorer). marginLeft will specify the CSS rule for the left margin of the image, and marginTop will do the same for the top (you can use this to position the image).
  To add an image with the name 'myImage.jpg' with a 15% margin-left attribute and a 20% margin-top
  attribute, write the following: 

  ```
  AddImage('myImage.jpg', '15%', '20%')
  ```

- SetBackgroundImage(imgName)
  - Sets the background image of the game to the image specified in imgName. imgName should be the 
  filename of an image uploaded to Thor using the File Explorer. To set an image named "myImg.png"
  as the background, write the following: 

  ```
  SetBackgroundImage("myImg.png")
  ```

- SetBGImg(imgName)
  -Shorthand for SetBackgroundImage(imgName).

- GetElemById(id)                 [returns the requested element]
  - A shorthand for document.getElementById. Check documentation on that function
  for more info.

- GetById(id)
  - An even shorter shorthand for GetElemById(id). 