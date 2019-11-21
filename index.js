//Start the engine from this file. This is where the magic will happen from.

const fs = require('fs')

const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const PORT = 1337

var app = express()
var upload = multer({dest: '/upload/resources'})

var lastUploadName; //The last name of the last image uploaded. 

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/')))
app.use(express.static(path.join(__dirname, '/upload/resources')))

app.get('/', (req, res) =>  
{
    res.sendFile(__dirname + '/index.html')
})

app.get('/upload/resources/:fileName', async (req, res) => 
{ 
    res.send(res.data)
})

app.listen(PORT, () =>
{ 
    console.log("Server started on port " + PORT)
})

app.post('/upload/resource', upload.single('resource-name'), (req, res) => 
{
    new Promise(async(resolve, reject) => 
    {
        req.on('data', (d) => 
        {
            lastUploadName = d
        })

        req.on('end', () => 
        {
            resolve(lastUploadName)
        })
    }).then((val) => 
    {
        res.end()
    })

})

app.post('/upload/resources',upload.single('resources'), (req, res) => 
{ 
    let data = [Buffer.alloc(0)]
    let fullData

    new Promise(async (resolve, rej) => 
    {
        req.on('data', (d) => 
        {
            data.push(d)
        })

        req.on('end', () => 
        {
            
            resolve(data)

        })
    }).then((val) => 
    {
        fullData = Buffer.concat(data)

        fs.writeFile(__dirname + '/upload/resources/' + String(lastUploadName).replace(/ /g, '-'), fullData, {}, (err) => 
        {
            if (err)
            {
                console.error(err)
            }
        })
    })
    res.sendFile(__dirname + "/index.html")
})

app.post('/download', (req, res) => 
{8
    console.log("It's downloading the game and reflecting that serverside")
    res.sendStatus(200)
})

async function readDirectory(dir)
{

    return await new Promise(async (res, rej) => 
    {
        fs.readdir(dir, async (err, files) => 
        {
            if (err)
            {
                rej(err)
            }

            res(files)
        })
    })
}

app.post('/imgfiles',upload.array('path'), (req, res) =>  
{
    new Promise(async (resolve, rej) => 
    {
        files = await readDirectory(req.body.path)

        if (files != null && files != undefined)
        {
            resolve(files)
        }
        else
        {
            rej(new Error("Could not find files in that directory."))
        }
    }).then((val) => 
    { 
        res.append('files', val)
        res.end()
    }).catch((e) => 
        console.error(e)
    )

})