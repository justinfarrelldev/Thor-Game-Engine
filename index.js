//Start the engine from this file. This is where the magic will happen from.


const fs = require('fs')

const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const PORT = 80

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

app.listen(PORT,'0.0.0.0', () =>
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

//Saving projects for the engine
app.post('/projects', upload.single('project-save'), (req, res) => 
{
    //Will account for users eventually, for now 
    //simply works for the end user

    console.log('Got request');

    let data = req.body['project-save']

    fs.mkdir(__dirname + req.url, () => {console.log('Resolved directory.');})

    fs.writeFile( __dirname + req.url + '/save.project', data, () => 
    {
        console.log('Should have written to file.');
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

app.delete('/upload/resources/:fileName', (req, res) => 
{
    console.log("Server got the request for deletion for " + req.url)

    fs.unlink(__dirname + req.url, (err) => 
    {
        if (err)
        {
            console.error(err);
            res.end()
        }
        console.log(req.url + ' has been deleted. ');
        res.end()
    })
})

exports.app = app