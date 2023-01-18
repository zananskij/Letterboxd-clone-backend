import express, { Express, Request, Response } from "express"
import Axios from "axios"
import cors from "cors"
import fetch from "node-fetch"

import dotenv from "dotenv"
dotenv.config()

const BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = process.env.API_KEY

const app: Express = express()
const port = 8000
app.use(cors())

// app.use(
//   cors({
//     origin: "http://localhost:8000/test",
//   })
// )

app.get("/", (req: Request, res: Response) => {
  res.send("main page")
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
  fetchHorrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=27`,
}

app.get("/test", async (req, res) => {
  Promise.all([
    Axios.get(requests.fetchTrending),
    Axios.get(requests.fetchNetflixOriginals),
    Axios.get(requests.fetchHorrorMovies),
  ])
    .then(([response1, response2, response3]) => {
      const data = {
        trending: response1.data,
        netflixOriginals: response2.data,
        horror: response3.data,
      }
      res.json(data)
    })
    .catch((error) => {
      res.status(500).json({ message: "could not fetch data" })
    })
})

// app.get("/testing", (req, res) => {
//   res.json({ message: "Hello from the backend!" })
// })

// const [trendingNow, netflixOriginals] = await Promise.all([
//   fetch(requests.fetchTrending).then((res) => res.json()),
//   fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
// ])

// return {
//   props: {
//     trendingNow: trendingNow.results,
//     netflixOriginals: netflixOriginals.results,
//   },
// }
