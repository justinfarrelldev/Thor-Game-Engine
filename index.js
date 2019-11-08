//Start the engine from this file. This is where the magic will happen from.

const fs = require('fs')

const express = require('express')
const path = require('path')
const PORT = 1337
const formidable = require('formidable')

var app = express()

app.use(express.static(path.join(__dirname, '/')))
app.use(express.static(path.join(__dirname, '/upload/resources')))
 
app.get('/', (req, res) =>  
{
    res.sendFile(__dirname + '/index.html')
})

app.listen(PORT, () =>
{ 
    console.log("Server started on port " + PORT)
})

app.post('/upload/resources', (req, res) => 
{
    var form = new formidable.IncomingForm()
    form.parse(req)

    form.on('fileBegin', (name, file) => 
    {
        file.path = __dirname + '/upload/resources/' + file.name
    })

    form.on('file', (name, file) => 
    {
        console.log("Uploaded " + file.name)
    })
})

//Just somewhat useful for debugging to have this spewed into the server console
fs.readdir(__dirname + '/', (err, items) => 
{
    global.resourcesFolder = items
    writeToFileExplorerWindow(items)
})

//Writes stuff to the file explorer window given the folder items for the directory
let writeToFileExplorerWindow = (files) => 
{
    console.log(files)
}
