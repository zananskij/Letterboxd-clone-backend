// imports + setup
import express, { Express, Request, Response } from "express"
import Axios from "axios"
import fetch from "node-fetch"
import cors from "cors"
import pgPromise from "pg-promise"
import dotenv from "dotenv"
import pool from "./db"

dotenv.config()
const app: Express = express()

const BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = process.env.API_KEY
const SECRET_KEY = process.env.SECRET_KEY

const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())
app.use(express.json()) // to parse JSON request bodies

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})

const pgp = pgPromise()

const isProduction = process.env.NODE_ENV === "production"
const connectionString = isProduction
  ? process.env.DATABASE_URL
  : `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`

const db = pgp({
  connectionString: connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
})

import {
  createUser,
  getUserByUsername,
  addMediaToWatched,
  removeMediaFromWatched,
  getWatchLaterByUser,
  addMediaToWatchLater,
  removeMediaFromWatchLater,
  getWatchedByUser,
} from "./models/users"

// Endpoints
app.post("/register", async (req, res) => {
  const { username, password } = req.body
  try {
    const newUser = await createUser(username, password)
    res.status(201).send({ message: "User created successfully", user: newUser })
  } catch (err) {
    res.status(500).send({ message: "An error occurred", error: err })
  }
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await getUserByUsername(username)

    if (!user) {
      return res.status(400).send({ message: "Invalid username or password" })
    }

    if (user.password !== password) {
      return res.status(400).send({ message: "Invalid username or password" })
    }

    res.status(200).send({ message: "Login successful", user: user })
  } catch (err) {
    res.status(500).send({ message: "An error occurred", error: err })
  }
})

app.get("/users/:username", async (req, res) => {
  const { username } = req.params
  try {
    const user = await getUserByUsername(username)
    if (user) {
      res.send(user)
    } else {
      res.status(404).send({ message: "User not found" })
    }
  } catch (err) {
    res.status(500).send({ message: "An error occurred", error: err })
  }
})

app.post("/users/:username/watched", async (req, res) => {
  const { username } = req.params
  const { media_id } = req.body

  try {
    const user = await getUserByUsername(username)

    if (!user) {
      return res.status(404).send({ message: "User not found" })
    }

    // Add media to the user's watched list
    await addMediaToWatched(user.id, media_id)

    res.status(200).send({ message: "Media added to watched list successfully" })
  } catch (err) {
    res.status(500).send({ message: "An error occurred", error: err })
  }
})

app.delete("/users/:username/watched", async (req, res) => {
  const { username } = req.params
  const { media_id } = req.body

  try {
    const user = await getUserByUsername(username)

    if (!user) {
      return res.status(404).send({ message: "User not found" })
    }

    // Remove media from the user's watched list
    await removeMediaFromWatched(user.id, media_id)

    res.status(200).send({ message: "Media removed from watched list successfully" })
  } catch (err) {
    res.status(500).send({ message: "An error occurred", error: err })
  }
})

app.get("/users/:username/watched", async (req, res) => {
  const { username } = req.params
  console.log(`Received request to fetch watched list for ${username}`)

  try {
    const user = await getUserByUsername(username)

    if (!user) {
      return res.status(404).send({ message: "User not found" })
    }

    const watched = await getWatchedByUser(user.id)

    console.log(`Returning watched list: ${JSON.stringify(watched)}`)
    res.status(200).send(watched)
  } catch (err) {
    res.status(500).send({ message: "An error occurred", error: err })
  }
})

app.post("/users/:username/watchlater", async (req, res) => {
  const { username } = req.params
  const { media_id } = req.body

  try {
    console.log(`Username: ${username}, Media ID: ${media_id}`)

    const user = await getUserByUsername(username)

    if (!user) {
      return res.status(404).send({ message: "User not found" })
    }
    console.log(`User: ${JSON.stringify(user)}`)

    // Add media to the user's watchlater list
    await addMediaToWatchLater(user.id, media_id)

    console.log(`Media added to watchlater list for user ${username}`)

    res.status(200).send({ message: "Media added to watchlater list successfully" })
  } catch (err) {
    console.log(`Error in /users/:username/watchlater: ${err}`)

    res.status(500).send({ message: "An error occurred", error: err })
  }
})

// Remove media from watchlater list
app.delete("/users/:username/watchlater", async (req, res) => {
  const { username } = req.params
  const { media_id } = req.body

  try {
    const user = await getUserByUsername(username)

    if (!user) {
      return res.status(404).send({ message: "User not found" })
    }

    // Remove media from the user's watchlater list
    await removeMediaFromWatchLater(user.id, media_id)

    res.status(200).send({ message: "Media removed from watchlater list successfully" })
  } catch (err) {
    res.status(500).send({ message: "An error occurred", error: err })
  }
})

app.get("/users/:username/watchlater", async (req, res) => {
  const { username } = req.params

  try {
    const user = await getUserByUsername(username)
    if (!user) {
      return res.status(404).send({ message: "User not found" })
    }

    // Get user's watchlater list
    const watchlaterList = await getWatchLaterByUser(user.id)

    res.status(200).send(watchlaterList)
  } catch (err) {
    res.status(500).send({ message: "An error occurred", error: err })
  }
})

app.get("/profile", (req: Request, res: Response) => {
  res.send("profile page")
})

app.get("/trending", async (req, res) => {
  const response = await Axios.get(requests.fetchTrending)
  res.json(response.data)
})
app.get("/originals", async (req, res) => {
  const response = await Axios.get(requests.fetchNetflixOriginals)
  res.json(response.data)
})

const requests = {
  fetchTrending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_networks=213`,
  fetchTopRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchHorrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=27`,
  fetchComedyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=35`,
  fetchActionMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=28`,
  fetchDocumentaries: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=99`,
}

// fetches data for the homepage
app.get("/", async (req, res) => {
  Promise.all([
    Axios.get(requests.fetchTrending),
    Axios.get(requests.fetchNetflixOriginals),
    Axios.get(requests.fetchTopRated),
    Axios.get(requests.fetchHorrorMovies),
    Axios.get(requests.fetchComedyMovies),
    Axios.get(requests.fetchActionMovies),
    Axios.get(requests.fetchDocumentaries),
  ])
    // destructured into responses
    .then(([response1, response2, response3, response4, response5, response6, response7]) => {
      // data from each of the responses combined into a variable
      const data = {
        trending: response1.data,
        netflixOriginals: response2.data,
        topRated: response3.data,
        horror: response4.data,
        comedy: response5.data,
        action: response6.data,
        documentaries: response7.data,
      }
      res.json(data)
    })
    .catch((error) => {
      res.status(500).json({ message: "could not fetch data" })
    })
})

const SEARCH_BASE_URL = "https://api.themoviedb.org/3/search/movie"

interface Media {
  title: string
  original_title: string

  [propName: string]: any
}

app.get("/search/:term", async (req, res) => {
  const searchTerm = req.params.term

  if (typeof searchTerm !== "string") {
    res.status(400).json({ message: "Bad request" })
    return
  }

  try {
    const response = await Axios.get(`${SEARCH_BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`)

    const filteredData = response.data.results.filter(
      (media: Media) =>
        media.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        media.original_title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    res.json({ ...response.data, results: filteredData })
  } catch (error) {
    res.status(500).json({ message: "Could not fetch data" })
  }
})

// const port = 8000

// app.listen(port, () => {
//   console.log(`listening on port ${port} `)
// })

// fetching trailer attempt
// app.get("/movie/:id", async (req, res) => {
//   try {
//     // Fetch movie data...
//     const movieResponse = await Axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${API_KEY}`)
//     const movieData = movieResponse.data

//     interface VideoData {
//       id: string
//       iso_639_1: string
//       iso_3166_1: string
//       key: string
//       name: string
//       site: string
//       size: number
//       type: string
//     }

// Fetch movie trailer...
//     const trailerResponse = await Axios.get(
//       `https://api.themoviedb.org/3/movie/${req.params.id}/videos?api_key=${API_KEY}`
//     )
//     const trailerVideos = trailerResponse.data.results
//     const trailer = trailerVideos.find((video: VideoData) => video.type === "Trailer")

//     const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null

//     // Add trailer URL to movie data and send response
//     movieData.trailerUrl = trailerUrl
//     res.json(movieData)
//   } catch (error) {
//     console.error(error)
//     res.status(500).send("Server error")
//   }
// })
// Fetch movie trailer...

// v2
// app.post("/login", async (req, res) => {
//   // get the user's information from the request body
//   const { username, password } = req.body
//   try {
//     // confirm that the user's credentials are correct
//     const result = await client.query("SELECT * FROM users WHERE username=$1 AND password=$2", [username, password])
//     if (result.rows.length === 0) {
//       return res.status(401).json({ message: "invalid info" })
//     }
//     // Create a new token
//     const newToken = jwt.sign({ userId: result.rows[0].id }, process.env.SECRET_KEY, {
//       expiresIn: "24h",
//     })
//     // associate the new token with the user in the database
//     await client.query("INSERT INTO tokens (user_id, token) VALUES ($1, $2)", [result.rows[0].id, newToken])
//     // Send the token + userID back in the response
//     res.status(200).json({ newToken, userId: result.rows[0].id })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: "Error logging in" })
//   }
// })

// v2
// app.post("/watchlater", async (req, res) => {
//   try {
//     const { media_id, user_id } = req.body
//     const result = await client.query("INSERT INTO watch_later(user_id, media_id) VALUES($1, $2)", [user_id, media_id])
//     res.status(201).json({ message: "Media added to watch later list" })
//     console.log(req.body)
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: "Error adding media to watch later list" })
//   }
// })

// v2222
// app.get("/watchlater/:user_id", async (req, res) => {
//   try {
//     const result = await client.query("SELECT * FROM watch_later WHERE user_id=$1", [req.params.user_id])
//     res.status(200).json(result.rows)
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: "Error retrieving watch later list" })
//   }
// })

// v2
// app.post("/mylist", async (req, res) => {
//   try {
//     const { media_id, user_id } = req.body
//     const result = await client.query("INSERT INTO my_list(user_id, media_id) VALUES($1, $2)", [user_id, media_id])
//     res.status(201).json({ message: "Media added to my list" })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: "Error adding media to my list" })
//   }
// })

// v222
// app.post("/register", async (req, res) => {
//   const { username, password } = req.body
//   try {
//     const result = await client.query("INSERT INTO users(username,password) VALUES($1, $2) RETURNING id", [
//       username,
//       password,
//     ])
//     res.status(201).json({ message: "User created successfully" })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: "Error creating user" })
//   }
// })

// app.post("/login", async (req, res) => {
//   // get the user's information from the request body
//   const { username, password } = req.body
//   try {
//     // Verify that the user's credentials are correct
//     const result = await client.query("SELECT * FROM users WHERE username=$1 AND password=$2", [username, password])
//     if (result.rows.length === 0) {
//       return res.status(401).json({ message: "invalid info" })
//     }
//     // Send the userId in the response
//     res.status(200).json({ userId: result.rows[0].id })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: "Error logging in" })
//   }
// })

// const { Client } = require("pg")
// const client = new Client({
//   host: process.env.PG_HOST,
//   port: process.env.PORT,
//   user: process.env.PG_USER,
//   password: process.env.PG_PASSWORD,
//   database: process.env.PG_DATABASE,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// })
// client.connect((err: Error) => {
//   if (err) {
//     console.error("connection error", err.stack)
//   } else {
//     console.log("connected")
//   }
// })

// v2
// const { Client } = require("pg")
// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// })
// client.connect((err: Error) => {
//   if (err) {
//     console.error("connection error", err.stack)
//   } else {
//     console.log("connected")
//   }
// })

const jwt = require("jsonwebtoken")

// register request
// v2
// app.post("/register", async (req, res) => {
//   const { username, password } = req.body
//   try {
//     const result = await client.query("INSERT INTO users(username,password) VALUES($1, $2) RETURNING id", [
//       username,
//       password,
//     ])
//     const newToken = jwt.sign({ userId: result.rows[0].id }, process.env.SECRET_KEY, {
//       expiresIn: "24h",
//     })
//     await client.query("INSERT INTO tokens (user_id, token) VALUES ($1, $2)", [result.rows[0].id, newToken])

//     res.status(201).json({ newToken })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: "Error creating user" })
//   }
// })
