import express, { Express, Request, Response } from "express"
import Axios from "axios"
import fetch from "node-fetch"
import cors from "cors"

import dotenv from "dotenv"
dotenv.config()

const app: Express = express()
const port = 8000

const BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = process.env.API_KEY
const SECRET_KEY = process.env.SECRET_KEY

const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

const PORT = process.env.PORT
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})

const { Client } = require("pg")
const client = new Client({
  host: process.env.PG_HOST,
  port: process.env.PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
})
client.connect((err: Error) => {
  if (err) {
    console.error("connection error", err.stack)
  } else {
    console.log("connected")
  }
})

const jwt = require("jsonwebtoken")

app.post("/register", async (req, res) => {
  const { username, password } = req.body
  try {
    const result = await client.query("INSERT INTO users(username,password) VALUES($1, $2) RETURNING id", [
      username,
      password,
    ])
    const newToken = jwt.sign({ userId: result.rows[0].id }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    })
    await client.query("INSERT INTO tokens (user_id, token) VALUES ($1, $2)", [result.rows[0].id, newToken])

    res.status(201).json({ newToken })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error creating user" })
  }
})

app.get("/profile", (req: Request, res: Response) => {
  res.send("profile page")
})

app.listen(port, () => {
  console.log(`listening on port ${port} `)
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
    .then(([response1, response2, response3, response4, response5, response6, response7]) => {
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

app.post("/login", async (req, res) => {
  // get the user's information from the request body
  const { username, password } = req.body
  try {
    // confirm that the user's credentials are correct
    const result = await client.query("SELECT * FROM users WHERE username=$1 AND password=$2", [username, password])
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "invalid info" })
    }
    // Create a new token
    const newToken = jwt.sign({ userId: result.rows[0].id }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    })
    // associate the token with the user in the database
    await client.query("INSERT INTO tokens (user_id, token) VALUES ($1, $2)", [result.rows[0].id, newToken])
    // Send the token back in the response
    res.status(200).json({ newToken, userId: result.rows[0].id })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error logging in" })
  }
})

app.post("/watchlater", async (req, res) => {
  try {
    const { media_id, user_id } = req.body
    const result = await client.query("INSERT INTO watch_later(user_id, media_id) VALUES($1, $2)", [user_id, media_id])
    res.status(201).json({ message: "Media added to watch later list" })
    console.log(req.body)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error adding media to watch later list" })
  }
})

app.get("/watchlater/:user_id", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM watch_later WHERE user_id=$1", [req.params.user_id])
    res.status(200).json(result.rows)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error retrieving watch later list" })
  }
})

app.post("/mylist", async (req, res) => {
  try {
    const { media_id, user_id } = req.body
    const result = await client.query("INSERT INTO my_list(user_id, media_id) VALUES($1, $2)", [user_id, media_id])
    res.status(201).json({ message: "Media added to my list" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error adding media to my list" })
  }
})

app.post("/register", async (req, res) => {
  const { username, password } = req.body
  try {
    const result = await client.query("INSERT INTO users(username,password) VALUES($1, $2) RETURNING id", [
      username,
      password,
    ])
    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error creating user" })
  }
})

app.post("/login", async (req, res) => {
  // get the user's information from the request body
  const { username, password } = req.body
  try {
    // Verify that the user's credentials are correct
    const result = await client.query("SELECT * FROM users WHERE username=$1 AND password=$2", [username, password])
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "invalid info" })
    }
    // Send the userId in the response
    res.status(200).json({ userId: result.rows[0].id })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error logging in" })
  }
})
