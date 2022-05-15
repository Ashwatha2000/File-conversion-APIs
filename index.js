const express = require("express");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require('multer');
var path = require('path');
const gTTS = require('gtts');
const fs = require('fs');
const {exec} = require('child_process');


const app = express();
app.use(cookieParser());

const port = process.env.PORT || 8080;

//storage for uploading file
var storage = multer.diskStorage({   
  destination: function(req, file, cb) { 
     cb(null, './uploads');    
  }, 
  filename: function (req, file, cb) { 
     cb(null , file.originalname);   
  }
});
var upload = multer({ storage: storage }).single("my_file");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//to store token in cookie  to identify uploaded file
app.post("/create_new_storage", (req, res) => {
  const token = jwt.sign({ id: 7, role: "captain" }, "YOUR_SECRET_KEY");
  return res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({status:"ok", message: "Storage Created Successfully" });
});

// to upload file 
app.post("/upload_file", (req, res) => {
  upload(req, res, (err) => {
   if(err) {
     console.log(err)
     res.status(400).send("Something went wrong!");
   }
   return res
   .status(200)
   .json({status:"ok",file_path:req.file.path});
 });
});

//accessing the uploaded
app.get("/\*uploads*/", (req, res) => {
  try{
    // console.log(req.url)
    var options = {
      root: path.join(__dirname + "/uploads")
    };
    
    var file = String(req.url) ;
    var filePathSplit=file.split("/");
    // console.log(filen);
    // console.log(filePathSplit.pop());
    var fileName=filePathSplit.pop();
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log(err);
            return res
            .status(400)
            .json({status:"error",message:"Something wrong"});
        } else {
            console.log('Sent:', fileName);
            return;
        }
    });
  }catch(err){
    console.log(err)
  }
 });

//to convert text to audio  
app.post("/text_file_to_audio", (req,res) =>{
  try{
    var filePath="uploads/"+ req.body.file_path;
    // console.log(filePath);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);
      var gtts = new gTTS(data, 'en');
      var audioPath= "audio/"+filePath.split(".")[1]+".mp3";
      gtts.save(audioPath, function (err, result){
          if(err) { throw new Error(err); }
          return res
          .status(400)
          .json({status:"ok",message:"text to speech converted","audio_file_path":audioPath});
      });;
  });
    console.log(req.body.file_path)
  }catch(err){
    console.log(err);
    return res
    .status(400)
    .json({status:"error",message:"Something wrong!"});
  }
});

//to merge image + audio to video 
app.post("/merge_image_and_audio", (req,res) =>{
  try{
    var cmd="ffmpeg -i "+ __dirname +req.body.image_file_path+" -i "+ __dirname + req.body.audio_file_path + " -acodec copy result.avi";
    
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
          // console.log(`error: ${error.message}`);
          console.log("cmd")
          return res
          .status(404)
          .json({status:"error",message:"Something wrong!"});
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return res
          .status(400)
          .json({status:"error",message:"Something wrong!"});
      }
      console.log(`stdout: ${stdout}`);
    });
    return res
        .status(200)
        .json({status:"ok",message:"Video Created Successfully",video_file_path: "F:/api_assignment/result.avi"});
  }catch(err){
    console.log(err);
    return res
    .status(400)
    .json({status:"error",message:"Something wrong!"});
  }
});

//to merge video  + audio to video 
app.post("/merge_video_and_audio", (req,res) =>{
  try{
    var cmd="ffmpeg -i "+ __dirname +req.body.video_file_path+" -i "+ __dirname + req.body.audio_file_path + " -c:v copy -map 0:v:0 -map 1:a:0 new.mp4";
    
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return ;
      }
      console.log(`stdout: ${stdout}`);
    });
    return res
        .status(200)
        .json({status:"ok",message:"Video and Audio Merged Successfully",video_file_path: "F:/api_assignment/new.mp4"});
  }catch(err){
    console.log(err);
    return res
    .status(400)
    .json({status:"error",message:"Something wrong!"});
  }
  
});

//to merge video  + audio to video 
app.post("/merge_all_video", (req,res) =>{
  try{
    var filePathList=req.body.video_file_path;
    // console.log(arr)
    var file = fs.createWriteStream('array.txt');
    file.on('error', function(err) { /* error handling */ });
    filePathList.forEach(function(v) { file.write("file " + v + '\n'); });
    file.end();
    var cmd="ffmpeg -f concat -safe 0 -i array.txt -c copy output8.mp4 ";
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return ;
      }
      console.log(`stdout: ${stdout}`);
    });
    return res
        .status(200)
        .json({status:"ok",message:"Video and Audio Merged Successfully",video_file_path: "F:/api_assignment/output8.mp4"});
    
  }catch(err){
    console.log(err);
    return res
    .status(400)
    .json({status:"error",message:"Something wrong!"});
  }
});

//to download any file from server
app.get('/download_file', (req,res) =>{
  try{
    const fileName=__dirname + "\\" + req.query.file_path;
    console.log(fileName);
    res.download(fileName);
  }catch(err){
    console.log(err);
    return res
    .status(400)
    .json({status:"error",message:"Something wrong!"});  
} 
});

//get list of uploaded file 
app.get('/my_upload_file', (req,res) =>{
  try{
    const filePaths=[];
    const directoryPath = path.join(__dirname, 'uploads');
    console.log("kkk",directoryPath);
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
          return res.json({message:'Unable to scan directory: '});
      } 
      files.forEach(function (file) {
          // console.log(file);
          filePaths.push("uploads/"+file); 
      });
      return res
      .status(200)
      .json({status:"ok",data:filePaths}); 
    });
  }catch(err){
    console.log(err);
    return res
    .status(400)
    .json({status:"error",message:"Something wrong!"}); 
  }
});

app.listen(port);
console.log('Server started at http://localhost:' + port);
