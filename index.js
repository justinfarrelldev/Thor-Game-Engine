//Start the engine from this file. This is where the magic will happen from.

const url = require('url')
const http = require('http')
const fs = require('fs')

const express = require('express')
const path = require('path')
const PORT = 1337

var app = express()

app.use(express.static(path.join(__dirname, '/')))
 
app.get('/', (req, res) =>  
{
    res.sendFile(__dirname + '/index.html')
})

app.listen(PORT, () =>
{ 
    console.log("Server started on port " + PORT)
})


fs.readdir(__dirname + '/', (err, items) => 
{
    console.log(items)
})