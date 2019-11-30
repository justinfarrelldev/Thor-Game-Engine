// This is an example of how to make a quick Visual Novel game prototype in Thor. 
// The images (which will all end with .png in this example) would theoretically
// have been uploaded using the File Explorer window on the bottom of the page.
// LAST UPDATED: 30th Nov 2019

var arc1 = new VNArc() // Use this statement to create a new arc for your Visual Novel.
					   // Arcs in Thor consist of dialogue chained together as well
					   // as a 'Choice' node which allows you to have things 
					   // for the player to input. More on those later.

var arc2 = new VNArc() // We're making two more of them here - you can make this more 
					   // organized by adding more scripts for each of them
					   // (Add or edit scripts -> Add Script)
					   // Keep in mind that the order is important - 
					   // Inline script is always last executed, Userscript 1 is 
					   // executed first, Userscript 2 is executed next, etc

					   // I recommend: themes in the last userscript, 
					   // characters inside the next one up, 
					   // the final arc in the next one, 
					   // all the arcs in descending order, 
					   // and finally the page itself in the inline script.

var arc3 = new VNArc()

// Here we are making a theme for a particular character - 
// this will be the colors of the text on screen when this character 
// is being used for dialogue. 
// VNTheme(Character name color, dialogue text color, dialogue box color)
let theme = new VNTheme('orange', '#16dee9', 'rgba(132, 0, 255, 0.65)')
let theme2 = new VNTheme('red', '#16dee9', 'rgba(132, 0, 255, 0.65)')
let theme3 = new VNTheme('lightgreen', '#16dee9', 'rgba(132, 0, 255, 0.65)')

// Here we are creating a new character named "Jessica" and making her 
// theme be the one we created 
let jessica = new VNCharacter('Jessica', theme)

let james = new VNCharacter('James', theme2)

let player = new VNCharacter('You', theme3)

// Here we are setting the background image to an uploaded image named 
// 'city.png'. Images can be uploaded in the file explorer at the bottom
// of the page, and their name will be utilized to use them in Thor. 
// This is for example purposes, this can also be done with dialogue nodes
// as the next comment will explain.
SetBGImg("city.png")

// Here, we are adding a new dialogue node to arc1. 
// The text that displays will be 'See that giant...', 
// and the character will be jessica. 'jessica.png' will be the actual image
// of the character standing in front of the background, this is not implemented yet.
// Lastly, we specify the background again. 
arc1.AddNewNode('"H-hey, you!"', 
				jessica,
				"jessica.png",
				"city.png")

// The next dialogue node can just state the dialogue that is to be said and 
// the rest will be kept the same - we will still use Jessica's character, 
// as well as the city background. 
arc1.AddNewNode('"Hello, can\'t you hear me?"')

// You can get rid of the character name simply by placing a space in a string 
// (a string is a word surrounded by '' or "", like "dog" or 'cat').
// This is great for narration. 
arc1.AddNewNode("James turns around, quite irritated by the tone of his friend.",
				' ',
				' ',
				'city.png')

// Here, we are using James as a character instead of Jessica. As a result, 
// the character name text will change in both contents and color. 
arc1.AddNewNode('"Whadda you want? You\'re really pushing my buttons ya know..."', 
				james,
				"james.png",
				"city.png")

// Finally, we have reached the end of arc1. To end the arc, we add a new Choice
// to the arc (each arc can only have 1 choice). Inside the first square bracket,
// we put our options that will display on screen like so. In the second one, 
// we put the corresponding arcs for those options. When we click the button for 
// option 1 ('Try to ease...'), it will start the corresponding arc (arc2). 
// Every option must have an arc to go with it. Everything else is the same as 
// the dialogue nodes.
arc1.AddNewChoice(['Try to ease the tension...', 'Stay silent.'], 
				 [arc2, arc3],
				 ' ',
				 'city.png')

// If you prefer, you can use a feature of Javascript called Chaining 
// to create dialogue and save on a few characters of typing.
arc2.AddNewNode('"Hey James, I\'m sure she didn\'t really mean it that way..."',
				 player,
				 " ",
				 "city.png")
// You can simply put .AddNewNode at the end of the previous statement to 
// add that dialogue to the same arc!
.AddNewNode('"I mean if she had something against you, she\'dve said "Hey buster!" or something!"')
 
// From here, we could add more dialogue and eventually a choice node to arc2, but for the sake of 
// simplicity, let's skip to arc3 - the result if you click on 'Stay silent.'
 
 arc3.AddNewNode("...",
				 player,
				 " ",
				 "city.png")
// Everything that can be done by typing out arc.AddNewNode() can also be done by typing 
// simply .AddNewNode(), just with the requirement that the first node to be added to the 
// arc has the arc specified. 
.AddNewNode('"I just wanted to get your attention, but if you wanna be all snarky about it..."',
			jessica,
			'jessica.png',
			'city.png')

.AddNewNode('"...Hmph, whatever."',
			james,
			'james.png',
			'city.png')

// Lastly, to tie the whole game together, put all of the arcs in a new PageVN and press play! 
// You can also download the game as a .zip file by clicking the download button in the upper 
// left. Have fun! 
var page = new PageVN([arc1, arc2, arc3])