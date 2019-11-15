//Start the engine from this file. This is where the magic will happen from.

const fs = require('fs')

const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const PORT = 1337
const formidable = require('formidable')

var app = express()

var upload = multer({dest: '/upload/resources'})

//app.use(upload.array())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/')))
app.use(express.static(path.join(__dirname, '/upload/resources')))

app.get('/', (req, res) =>  
{
    res.sendFile(__dirname + '/index.html')
})

app.get('/upload/resources/',upload.single('/upload/resources'), (req, res) => 
{ 
    console.log("It's asking for that resource");
})

app.listen(PORT, () =>
{ 
    console.log("Server started on port " + PORT)
})

app.put('/upload/resources',upload.single('resources'), (req, res) => 
{ 
    
    var form = new formidable.IncomingForm()

    console.log("Got a new form")

    let data = [Buffer.alloc(0)]
    let fullData

    let prom = new Promise(async (res, rej) => 
    {
        req.on('data', (d) => 
        {
            //console.log(d)
            data.push(d)
        })

        req.on('end', () => 
        {
            res(data)

        })
    }).then((val) => 
    {
        fullData = Buffer.concat(data)

        console.log(fullData)

        fs.writeFile(__dirname + '/upload/resources/' + 'Battlefield.jpg', fullData, {}, (err) => 
        {
            if (err)
            {
                console.error(err)
            }
            console.log(__dirname + '/uploads/resources/Battlefield.jpg')
        })
    })

    
    //console.log(req)
    
    //fs.writeFile()
    

    /*
    
    form.parse(req, (err, field, file) => 
    {
        if (err)
        {
            console.error(err)
        }
        console.log("It's parsing it")
    })

    form.on('fileBegin', (name, file) => 
    {
        console.log("beginning file parse")
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
    */

       /*
    fs.writeFile(__dirname + '/upload/resources/' + req.fileName, req.body, {}, () => 
    {
        console.log("Wrote it")
    })
*/

    if (req.file)
    {
        console.log("There is a file")
    }

    res.sendFile(__dirname + "/index.html")
    

    /*
    console.log("It's made its way into the request")
    if (req.file)
    {
        console.log("It's working")
        console.log(req.file)
    }
    */
})

app.post('/download', (req, res) => 
{
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
                console.error(err)
            }

            res(files)
        })
    })
}

app.post('/imgfiles',upload.array('path'), (req, res) =>  
{
    console.log(req.body.path)

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
        console.log("From POST")
        console.log(val)
 
        res.append('files', val)
        res.end()
    }).catch((e) => 
    console.error(e)
    )

})