import express from 'express'
import { logger } from './middlewares/logger.js'
import mongoose from 'mongoose'
import mongodb from 'mongodb';
import { GridFSBucket } from 'mongodb';
import fileUpload from 'express-fileupload';
import 'dotenv/config'
import cors from 'cors';
import { Readable } from 'stream';


const app = express()

// Create a Mongoose connection to the MongoDB database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to MongoDB');

  // Start the server
  app.listen(process.env.PORT, () => {
    console.log(`👋 Started server on port ${process.env.PORT}`)
  });
})
.catch(err => {
  console.log('Error connecting to MongoDB', err);
  process.exit(1);
});

// SCHEMA example
// const videoSchema = new mongoose.Schema({
//   filename: { type: String, required: true },
//   size: Number,
//   videoUrl: String,
//   thumbnailUrl: String,
//   duration: { type: Number, required: true },
//   recordedOn: String,
//   recordedBy: String,
//   reviewStatus: { type: [String], default: ["uploaded"] },
//   events: { type: [Number], default: [] },
//   uploadedOn: String,
//   uploadedBy: String,
//   // data: Buffer
// })

// MODEL

// A third parameter can be given for the collection name
// const Video = mongoose.model('Video', videoSchema, 'myvideos');
// Else Mongoose generates a collection name by pluralizing 
// the model name 'Video' to 'videos'
// const Video = mongoose.model('Video', videoSchema)


// MIDDLEWARES

// logs to the terminal
// Wed, 26 Apr 2023 09:20:40 GMT Request from ::1 GET /cookies/chocolate-chip
app.use(logger)

//  Cross-Origin Resource Sharing (CORS) setup
app.use(cors({
  origin: process.env.CORS_ORIGIN
}))

// serves static files from the 'public' folder
// localhost:5000/assets/landing.html
// uses virtual path prefix '/assets'
app.use('/assets', express.static('public'))

// parses JSON bodies
app.use(express.urlencoded({ extended: true }))

// Configurations 
app.set('view engine', 'ejs')

// File Uploads
app.use(fileUpload());

// Routes

// GET / => Home Page
app.get('/', (request, response) => {
  const numberOfVideos = 10

  // Rendering HTML for now
  // Might be useless if frontend renders the page
  response.render('index', { numberOfVideos: numberOfVideos })
})


// API - Get All Videos
app.get('/api/videos', async (request, response) => {
  try {
    const db = mongoose.connection.db
    const bucket = new GridFSBucket(db);
    const cursor = bucket.find({});

    // videos is an array of objects
    // precisely from 'fs.files' GridFS collection
    // [
    //   {
    //     _id: new ObjectId("6450620edbf68b6f07bc801c"),
    //     length: 33157948,
    //     chunkSize: 261120,
    //     uploadDate: 2023-05-02T01:06:23.999Z,
    //     filename: 'LABORATORIES-SCIENCE_12',
    //     metadata: {
    //       thumbnailUrl: '',
    //       description: '',
    //       duration: 180,
    //       recordedOn: 'May 9, 2011',
    //       recordedBy: 'Christian Meisel',
    //       reviewStatus: [Array],
    //       events: [],
    //       uploadedBy: 'Gadi Miron'
    //     }
    //   }, ...
    // ]
    const videos = await cursor.toArray()

    response.send(videos)

  }catch (error) {

    console.log(error)
    response.status(500).send('Error fetching videos')

  }
})

// API - Upload Video
app.post('/api/upload-video', async (req, res) => {
  // videoFile (req.files.video) is an object with the following properties
  // {
  //   name: 'Big_Bunny.mp4',
  //   data: <Buffer 00 00 00 20 06 ... 10546570 more bytes>,
  //   size: 10546620,
  //   encoding: '7bit',
  //   tempFilePath: '',
  //   truncated: false,
  //   mimetype: 'video/mp4',
  //   md5: '5021b3b7c402468d5b018a8b4a2b448a',
  //   mv: [Function: mv]
  // }
  const { name, data } = req.files.video

  const db = mongoose.connection.db
  const bucket = new mongodb.GridFSBucket(db);

  // create upload stream using GridFS bucket
  const videoUploadStream = bucket.openUploadStream(name.split(".")[0], {
    // Add extra details about the video file
    metadata: {
      thumbnailUrl: '',
      description: '',
      duration: 180,
      recordedOn: 'May 9, 2011',
      recordedBy: 'Christian Meisel',
      reviewStatus: ["uploaded"],
      events: [],
      uploadedBy: 'Gadi Miron'
    },
  });

  // create read stream from video file buffer
  const videoReadStream = new Readable();
  videoReadStream.push(data);
  videoReadStream.push(null);

  // Finally Upload!
  videoReadStream.pipe(videoUploadStream)
    .on('error', () => {
      res.status(500).send({ message: 'Error uploading file' });
    })
    .on('finish', () => {
      // All done!
      res.status(200).send({ message: 'File uploaded successfully' });
    });
});

// API - Get Video by ID
app.get('/api/video/:id', async (req, res) => {
  const id = req.params.id;
  
  const db = mongoose.connection.db;
  const bucket = new mongodb.GridFSBucket(db);

  // Get the file stream from GridFS
  const downloadStream = bucket.openDownloadStream(new mongodb.ObjectId(id));

  // Set the content type header
  res.set('Content-Type', 'video/mp4');

  // Pipe the file stream to the response object
  downloadStream.pipe(res)
    .on('error', () => {
      res.status(404).send({ message: 'File not found' });
    })
    .on('finish', () => {
      res.end();
    });
});

// [LATER] Other APIs
// Delete a video
// Rename it's title or filename

// API - Create Episode on a video
// Route that requires JSON parsing middleware
app.post('/api/videos/:id/mark-episode', express.json(), (request, response) => {
})

// [LATER] Other APIs
// Edit an episode
// Delete an episode


// Start the server
// app.listen(process.env.PORT, () => {
//   console.log(`👋 Started server on port ${process.env.PORT}`)
// })