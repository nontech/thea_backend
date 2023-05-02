# Thea _ backend

**Thea** is a web application that allows users (epileptic patients) to upload videos and have them assessed for epileptic episodes by AI and verified by a doctor. 

This is the backend API for the __Thea__ application built using __ExpressJS__.

## Table of Contents

- [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
- [API Endpoints](#api-endpoints)
  * [Videos](#videos)
  * [Error Responses](#error-responses)
- [Architecture](#architecture)
- [Production](#production)

## Getting Started

### Prerequisites

- NodeJS installed on your machine

### Installation

 1. Clone the repository
    ```
    git clone https://github.com/nontech/thea_backend.git
    ```
2. Install dependencies
    ```
    cd thea_backend
    npm install
    ```
3. Make sure MongoDB is installed and running locally on your computer. [Follow these steps](https://www.mongodb.com/docs/manual/administration/install-community/)

4. Create a `.env` file in the root of the project with the following variables
    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/thea_local
    CORS_ORIGIN=*
    ```
    Note: Change the MONGO_URI to your MongoDB connection string
    
5. Start the server
    ```
    npm start
    ```

## API Endpoints

### Videos

- `GET /api/videos` - Get list of all uploaded videos
- `POST /api/upload-video` - Upload a video
- `POST /api/videos/:id` - Get a video
- `POST /api/videos/:id/mark-episode` - Mark a video with an epileptic episode

### Error Responses

- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Authentication failed
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error occurred

## Architecture

![Thea Backend Architecture Diagram](https://user-images.githubusercontent.com/14184188/235120589-b24b95fa-45f4-42df-a9d8-b392d52b5383.png)

- The user interacts with the frontend website in their browser.
- The frontend website sends requests to the API server hosted on Render.
- The API server routes the requests to the appropriate handler function.
- The handler functions interact with the MongoDB database to perform CRUD operations on the data.
- The API server sends responses back to the frontend website.


## Production
 The website is hosted on render (a web hosting service)
 [Website Link](https://thea-backend.onrender.com/)
