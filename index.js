const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
app.use(express.json()) //If the data was sent as JSON, using Content-Type: application/json, you will use the express.json() middleware:
app.use(express.urlencoded()) //If the data was sent using Content-Type: application/x-www-form-urlencoded, you will use the express.urlencoded() middleware:

const url = 'mongodb://127.0.0.1:27017';

MongoClient.connect(url, function (err, client) {
    //assert.equal(null, err);
    console.log("Connected successfully to server");

    //const db = client.db(dbName);

    client.close();
});
app.listen(3001, () => {
    console.log('Server started');
});

/** GET Simple Hello World */
app.get('/', (req, res) => {
    res.send('Hi');
});

/** GET test for single user insert static */
app.get('/test', async (req, res) => {
    try {
        MongoClient.connect(url, async function (err, client) {
            //assert.equal(null, err);
            console.log("Connected successfully to server");

            const db = client.db('my-db');

            db.collection('users').insertOne({ name: 'Shailendra' }).then((result) => {
                return res.send({
                    status: 'OK',
                    data: result.result
                });
            }).catch((err) => {
                return res.send({
                    status: 'ERR',
                    data: err
                });
            });
        });
    } catch (err) {
        return res.send('Error');
    }
});

/** GET Read All Users List From Collection */
app.get('/users', async (req, res) => {
    try {
        MongoClient.connect(url, async function (err, client) {
            //assert.equal(null, err);
            console.log("Connected successfully to server");

            const db = client.db('my-db');
            //find({ name: 'Shailendra' })
            db.collection('users').find().toArray().then((result) => {
                return res.send({
                    status: 'OK',
                    data: result
                });
            }).catch((err) => {
                return res.send({
                    status: 'ERR',
                    data: err
                });
            });


        });
    } catch (err) {
        return res.send('Error');
    }
});

/** POST Insert User Input from body(Body or FormUrlEncoder) */
app.post('/users', async (req, res) => {
    try {
        MongoClient.connect(url, async function (err, client) {
            const db = client.db('my-db');

            const _name = req.body.name
            if (_name) {
                db.collection("users").insertOne({ name: _name }).then((result) => {
                    return res.send({
                        status: 'Ok',
                        data: result.result
                    });
                }).catch((err) => {
                    return res.send({
                        status: 'Error',
                        data: err
                    });
                });
            } else {
                return res.send({
                    status: 'errOfIf',
                    data: err + _name
                });
            }
        });
    } catch (error) {
        return res.send({
            status: 'errOfTry',
            data: error
        });
    }
});

/** DELETE delete user Input from body(Body or FormUrlEncoder) */
app.delete('/users', async (req, res) => {
    try {
        MongoClient.connect(url, async function (err, client) {
            const db = client.db('my-db');

            const _name = req.body.name;

            if (_name) {
                db.collection('users').deleteOne({ name: _name }).then((result) => {
                    return res.send({
                        status: 'Ok',
                        data: result.result
                    });
                }).catch((err) => {
                    return res.send({
                        status: 'Error',
                        data: err
                    });
                });
            } else {
                return res.send({
                    status: 'errOfIf',
                    data: err + _name
                });
            }
        });

    } catch (error) {
        return res.send({
            status: 'errOfTry',
            data: error
        });
    }
});

/** PUT Insert User Input from body(Body or FormUrlEncoder) */
app.put('/users', async (req, res) => {
    try {
        MongoClient.connect(url, async function (err, client) {
            const db = client.db('my-db');

            const _name = req.body.name;
            const _updatedValue = String(_name + 'updated');
            if (_name) {
                db.collection("users").update({ name: _name }, { $set: { name: _updatedValue, age: 50 } }).then((result) => {
                    return res.send({
                        status: 'Ok',
                        data: result.result
                    });
                }).catch((err) => {
                    return res.send({
                        status: 'Error',
                        data: err
                    });
                });
            } else {
                return res.send({
                    status: 'errOfIf',
                    data: err + _name
                });
            }
        });
    } catch (error) {
        return res.send({
            status: 'errOfTry',
            data: error
        });
    }
});


const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './files/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
  })

const upload = multer({ storage: storage })
const fs = require('fs')

app.post('/uploadphoto', upload.single('picture'), async (req, res) => {
    try {
        MongoClient.connect(url, async function (err, client) {
            const db = client.db('my-db');

            var img = fs.readFileSync(req.file.path);
            var encode_image = img.toString('base64');
            // Define a JSONobject for the image attributes for saving to database

            var finalImg = {
                contentType: req.file.mimetype,
                image: new Buffer(encode_image, 'base64')
            };
            if (finalImg) {
                db.collection('photos').insertOne(finalImg).then((result) => {
                    return res.send({
                        status: 'Ok',
                        data: result.result
                    });
                }).catch((err) => {
                    return res.send({
                        status: 'Error',
                        data: err
                    });
                });
            } else {
                return res.send({
                    status: 'errOfIf',
                    data: err + _name
                });
            }
        });
    } catch (error) {
        return res.send({
            status: 'errOfTry',
            data: error
        });
    }
});

// const multer = require('multer');
// const path   = require('path');
// /** Storage Engine */
// const storageEngine = multer.diskStorage({
//   destination: './public/files',
//   filename: function(req, file, fn){
//     fn(null,  new Date().getTime().toString()+'-'+file.fieldname+path.extname(file.originalname));
//   }
// }); 
// //init
// const upload =  multer({
//   storage: storageEngine,
//   limits: { fileSize:200000 },
//   fileFilter: function(req, file, callback){
//     validateFile(file, callback);
//   }
// }).single('photo');
// var validateFile = function(file, cb ){
//   allowedFileTypes = /jpeg|jpg|png|gif/;
//   const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimeType  = allowedFileTypes.test(file.mimetype);
//   if(extension && mimeType){
//     return cb(null, true);
//   }else{
//     cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
//   }
// }

// upload(req, res,(error) => {
//     if(error){
//        res.redirect('/?msg=3');
//     }else{
//       if(req.file == undefined){

//         res.redirect('/?msg=2');
//       }else{

//           /**
//            * Create new record in mongoDB
//            */
//           var fullPath = "files/"+req.file.filename;
//           var document = {
//             path:     fullPath, 
//             caption:   req.body.caption
//           };

//         var photo = new Photo(document); 
//         photo.save(function(error){
//           if(error){ 
//             throw error;
//           } 
//           res.redirect('/?msg=1');
//        });
//     }
//   }
// });

