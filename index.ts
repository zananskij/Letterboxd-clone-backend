import express, { Express, Request, Response } from "express"
import Axios from "axios"
// import Cors from "cors"
import fetch from "node-fetch"

import dotenv from "dotenv"
dotenv.config()

const BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = process.env.API_KEY

const app: Express = express()
const port = 8000

app.get("/", (req: Request, res: Response) => {
  res.send("main page")
})

app.get("/profile", (req: Request, res: Response) => {
  res.send("profile page")
})

app.listen(port, () => {
  console.log(`listening on port ${port} `)
})

const requests = {
  fetchTrending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_networks=213`,
}
app.get("/trending", async (req, res) => {
  const response = await Axios.get(requests.fetchTrending)
  res.json(response.data)
})
app.get("/originals", async (req, res) => {
  const response = await Axios.get(requests.fetchNetflixOriginals)
  res.json(response.data)
})

app.get("/test", async (req, res) => {
  Promise.all([Axios.get(requests.fetchTrending), Axios.get(requests.fetchNetflixOriginals)])
    .then(([response1, response2]) => {
      const data = {
        trending: response1.data,
        netflixOriginals: response2.data,
      }
      res.json(data)
    })
    .catch((error) => {
      res.status(500).json({ message: "could not fetch data" })
    })
})
