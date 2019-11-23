# Thor Game Engine
 The Thor web-based Game Engine, created with Typescript. 

# Purpose
Thor is meant to be used to create small, lightweight web games (such as gacha games and 
visual novels). I plan to expand it as I work on more projects inside of Thor, so 
in the future it will likely have many more features.

# Features
**20th Nov, 2019**
- Can export games to a new webpage (.zip file with HTML file and scripts inside) with multiple 
custom scripts included as well as multiple uploaded images
- Can test games inside of Thor's game window (left side) using the play button
- Can use multiple custom scripts (Javascript) to control the game
- Thor includes a few library functions which you can use to quickly develop new games (see below)

# Update Notes
**21st Nov, 2019**
- Some minor changes have been made to the build process and the code has been cleaned up slightly.
- Display changes to the File Explorer icons have been made (they are now objects themselves).
- The File Explorer icons now have the file names listed below them as well as when you hover
over them. 
- The console now reports every step of the build process as it is happening. 
- Fixed the issues with spaces in file names. You can now upload images with spaces in the file 
name and the spaces will be replaced with hyphens (for example, "my image of my dog.jpg" will 
become "my-image-of-my-dog.jpg" upon upload).
- Added a visual novel template type. Use it by writing "var template = new VNWebpage()" in 
your userscript. It will be improved massively in the next few updates.
- Added a function to set the background image of your game. Use it by calling 
"SetBGImg('imageName.jpg')" in your userscript. This breaks the game preview as of right now,
but works as expected in builds. 

# How to Use Thor
To run Thor, install Node.js. Navigate to your download directory in the command line, enter the thor-game-engine folder and use 'node index.js'. This will start the Thor game engine, which you can then use in your browser by navigating to 'localhost:1337'. 

# To-Do
**Updated 10th Nov, 2019**
- Fix vulnerabilities
- Fix image bugginess involving spaces
- Improve the function library with use of chaining 
- Add support for deletion of images from the engine (as well as an interface to do so)
- Add support for switching windows to the selected types
- Enhance the file viewer (similar to Unity's project file viewer) with drag and drop capability
as well as more interactability. 
- Add more library functions (especially for interaction with images and more game interactability)
- Make Thor download files correctly while not launched on a server
- Fix warnings about using XMLHttpRequest (not an immediate priority)
- Add configuration options for Thor (likely stored in the browser cache)
- Add JQuery support to exported games
- Possibly add support for Typescript
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