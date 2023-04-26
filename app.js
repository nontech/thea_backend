import express from 'express'
import { logger } from './middlewares/logger.js'

// Fake data
const videos = [
  {
    "id": "1",
    "title": "Big Buck Bunny",
    "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Big_Buck_Bunny_thumbnail_vlc.png/1200px-Big_Buck_Bunny_thumbnail_vlc.png",
    "duration": "8:18",
    "uploadTime": "May 9, 2011",
    "views": "24,969,123",
    "author": "Vlc Media Player",
    "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "isAvailable": true
  },
  {
    "id": "2",
    "title": "The first Blender Open Movie from 2006",
    "thumbnailUrl": "https://i.ytimg.com/vi_webp/gWw23EYM9VM/maxresdefault.webp",
    "duration": "12:18",
    "uploadTime": "May 9, 2011",
    "views": "24,969,123",
    "author": "Blender Inc.",
    "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "isAvailable": false

  },
  {
    "id": "3",
    "title": "For Bigger Blazes",
    "thumbnailUrl": "https://i.ytimg.com/vi/Dr9C2oswZfA/maxresdefault.jpg",
    "duration": "8:18",
    "uploadTime": "May 9, 2011",
    "views": "24,969,123",
    "author": "T-Series Regional",
    "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "isAvailable": true
  },
  {
    "id": "4",
    "title": "For Bigger Escape",
    "thumbnailUrl": "https://img.jakpost.net/c/2019/09/03/2019_09_03_78912_1567484272._large.jpg",
    "duration": "8:18",
    "uploadTime": "May 9, 2011",
    "views": "24,969,123",
    "author": "T-Series Regional",
    "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "isAvailable": false
  },
  {
    "id": "5",
    "title": "Big Buck Bunny",
    "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Big_Buck_Bunny_thumbnail_vlc.png/1200px-Big_Buck_Bunny_thumbnail_vlc.png",
    "duration": "8:18",
    "uploadTime": "May 9, 2011",
    "views": "24,969,123",
    "author": "Vlc Media Player",
    "videoUrl": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "isAvailable": true
  }
]

const videosSimpleList = ['Strawberry Fields Video', 'Penguin Love', 'Bunnys Hopping']

const app = express()
const PORT = 5000


// Middlewares

// logs to the terminal
// Wed, 26 Apr 2023 09:20:40 GMT Request from ::1 GET /cookies/chocolate-chip
app.use(logger)

// Allow requests from http://localhost:3000
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// serves static files from the 'public' folder
// localhost:3000/assets/landing.html
// uses virtual path prefix '/assets'
app.use('/assets', express.static('public'))

// parses JSON bodies
app.use(express.urlencoded({ extended: true }))


// Configurations 
app.set('view engine', 'ejs')


// Routes

// GET / => Home Page
app.get('/', (request, response) => {
  const numberOfVideos = 10

  // Rendering HTML for now
  // Might be useless if frontend renders the page
  response.render('index', { numberOfVideos: numberOfVideos })
})

// GET /videos => All Videos Page
app.get('/videos', (request, response) => {
  console.log(request.query)

  // [TODO]
  // 1. Fetch videos list from database
  // 2. Send as JSON response

  // Rendering HTML for now
  response.render('videos/index', { videos: videos})
})

// GET /videos/1 => Individual Video Page
app.get('/videos/:id', (request, response) => {
  const { id } = request.params

  // [TODO]
  // 1. Fetch video data from database using id
  // 2. Send as JSON response

  response.send('Individual Video Page with id ' + id)
})

// API endpoints

// Create a new episode
// POST /videos/1/mark-episode
// Route that requires JSON parsing middleware
app.post('/api/v1/videos/1/mark-episode', express.json(), (request, response) => {
  const incomingData = request.body

  // Log to console
  console.log(incomingData)

  // [TODO] 
  // 1: Save the incoming data to a database
  // 2: Respond with an updated video data object

  // Response fake data
  const data = {
    name: 'John Doe',
    age: 30,
    email: 'johndoe@example.com'
  };

  // Sends JSON response
  response
    .status(200)
    .json(data);
})

// Other APIs
// Edit an episode
// Delete an episode


// Start the server
app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`)
})