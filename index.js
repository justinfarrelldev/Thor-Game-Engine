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

app.get('/upload/resources/', (req, res) => 
{
    console.log("It's asking for that resource");
})

app.listen(PORT, () =>
{ 
    console.log("Server started on port " + PORT)
})

app.put('/upload/resources', (req, res) => 
{
    var form = new formidable.IncomingForm()
    form.parse(req)

    form.on('fileBegin', (name, file) => 
    {
        if (file.name.indexOf(' ') >= 0)
        {
            //Has spaces, so replace spaces with %20
            file.name.replace(' ', '%20')
        }
        file.path = __dirname + '/upload/resources/' + file.name
    })

    
    form.on('file', (name, file) => 
    {
        console.log("Uploaded " + file.name)
        return res
    })

    res.sendFile(__dirname + "/index.html")
})