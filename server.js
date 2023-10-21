// CYCLIC Link: https://green-boa-coat.cyclic.app

/*********************************************************************************
*  BTI325 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _______Anurag Das__________ Student ID: _______126031228______ Date: ___20/10/2023_____________
*
*  
*
********************************************************************************/ 


const express = require('express');
const blogData = require("./blog-service");
const path = require("path");

const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({
    cloud_name: 'dgv3isq6f',
    api_key: '579187953213367',
    api_secret: '-umWDL51BLC7ipaDYQwiXFKiZXA',
    secure: true
});

const upload = multer(); 
const app = express(); 
const HTTP_PORT = process.env.PORT || 8080; 
const blogService = require("./blog-service.js");
app.post("/posts/add", upload.single("featureImage"), async (req, res) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function uploadImage(req) {
    try {
      let uploaded = await streamUpload(req);
      return uploaded;
    } catch (error) {
      throw error;
    }
  }

  try {
    const uploaded = await uploadImage(req);
    req.body.featureImage = uploaded.url;

    const newPost = {
      title: req.body.title,
      body: req.body.body,
      category: parseInt(req.body.category),
      published: req.body.published === 'on',
      featureImage: req.body.featureImage,
    };

    blogService.addPost(newPost)
      .then((addedPost) => {
        console.log({ addedPost });
        res.redirect('/posts');
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
      });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading image to Cloudinary');
  }
});


app.get('/', (req, res) => {
    res.redirect('/about');
  });
  app.get("/about", (req, res) => {
    res.sendFile(__dirname + "/views/about.html");
  });
app.use(express.static('public'));
app.get("/blog", (req, res) => {
  blogService
    .getPublishedPosts()
    .then((data) => {
      res.json(data);
    })
    .catch(function (err) {
      console.log("Unable to open the file: " + err);
    });
});
app.get("/posts/add",(req,res)=>{
 res.sendFile(__dirname + "/views/addPost.html");
 upload.single("featureImage");
});

app.get("/posts", (req, res) => {
  const { category, minDate } = req.query;
    
  if (category) {
    blogService
      .getPostsByCategory(category)
      .then((data) => {
        res.json(data);
      })
      .catch(function (err) {
        console.log("Unable to fetch posts by category: " + err);
        res.status(500).send('Internal Server Error');
      });
  } else if (minDate) {
    blogService
      .getPostsByMinDate(minDate) 
      .then((data) => {
        res.json(data);
      })
      .catch(function (err) {
        console.log("Unable to fetch posts by minDate: " + err);
        res.status(500).send('Internal Server Error');
      });
  } else {
    blogService
      .getAllPosts()
      .then((data) => {
        res.json(data);
      })
      .catch(function (err) {
        console.log("Unable to open: " + err);
        res.status(500).send('Internal Server Error');
      });
  }
});

app.get("/categories", (req, res) => {
  blogService
    .getCategories()
    .then((data) => {
      res.json(data);
    })
    .catch(function (err) {
      console.log("Unable to open the file: " + err);
    });
});

app.get("*", (req, res) => {
  res.status(404).sendFile(__dirname + "/views/404/error.html");
});

blogService
.initialize()
.then(function(){
  app.listen(HTTP_PORT, () => console.log(`Express http server listening on: ${HTTP_PORT}`));
  })
  .catch(function(err){
    console.log("Unable to open file: "+ err);
  })
