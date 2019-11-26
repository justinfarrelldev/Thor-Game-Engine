//This is a working example of a small, one-arc Visual Novel. There will be choices coming soon. 

var arc1 = new VNArc()

arc1.AddNewNode("Hello world! This first dialogue node will display as soon as you hit the play button.", //This is the dialogue
				"Ricky the Robot",  //This is the character name (displayed in the character text box)
				"DeveloperImage.jpg", //This will be the character image (not implemented yet)
				"img.jpg")          //This is the background image to use (upload one with the file explorer and access it using the filename)

arc1.AddNewNode("The second dialogue node will require only the dialogue to be specified, but you can specify the others if you want.")

//Add more dialogue nodes here to make a story! 

var temp = new PageVN(arc1)
