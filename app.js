import express from 'express'
import { logger } from './middlewares/logger.js'

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


// Routes

// GET / => Home Page
app.get('/', (request, response) => {
  response.send('Thea Home Page')
})

// GET /videos => All Videos Page
app.get('/videos', (request, response) => {
  console.log(request.query)
  response.send('All Videos')
})

// GET /videos/1 => Individual Video Page
app.get('/videos/:id', (request, response) => {
  const { id } = request.params
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


// For practice

const cookies = [
  {
    "id": 1,
    "name": "Chocolate Chip",
    "description": "A delicious chocolate chip cookie",
    "price": 1.99,
    "slug": "chocolate-chip",
  },
  {
    "id": 2,
    "name": "Chesse Cake",
    "description": "A delicious chocolate chip cookie",
    "price": 2,
    "slug": "cheese",
  },
  {
    "id": 3,
    "name": "Vanilla Strawberry",
    "description": "A delicious chocolate chip cookie",
    "price": 3.50,
    "slug": "vanilla-strawberry",
  }
]

app.get('/cookies', (request, response) => {
  response.send(cookies)
})

app.get('/cookies/:slug', (request, response) => {
  const { slug } = request.params
  for (const cookie of cookies) {
    if (cookie.slug === slug) {
      response.send(cookie)
      return
    }
  }
  response.send("No cookie found")
})


// Start the server
app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`)
})