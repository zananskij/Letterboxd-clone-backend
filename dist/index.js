"use strict";
// import cors from "cors"
// const port = process.env.PORT || 8000
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const PORT = parseInt(process.env.PORT || "5432", 10)
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.API_KEY;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT;
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
app.listen(3000, () => {
    console.log("listening");
});
app.listen(3001, () => {
    console.log("listening to port 3001");
});
// app.listen(5432, () => {
//   console.log("listening")
// })
const { Pool } = require("pg");
const pool = new Pool({
    connectionString: `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PORT}/${process.env.PG_DATABASE}`,
    ssl: {
        rejectUnauthorized: false,
    },
});
pool.connect((err) => {
    if (err) {
        console.log("Error connecting to the database:", err);
    }
    else {
        console.log("Connected to the database");
    }
});
app.post("https://letterboxd-clone-backend.herokuapp.com/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const text = "INSERT INTO users (id, username, password) VALUES (DEFAULT, $1, $2) RETURNING *";
        const values = [username, password];
        const { rows } = yield pool.query(text, values);
        res.status(201).json(rows[0]);
        console.log(req.body);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering user" });
    }
}));
const requests = {
    fetchTrending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
    fetchNetflixOriginals: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_networks=213`,
    fetchTopRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
    fetchHorrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=27`,
    fetchComedyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=35`,
    fetchActionMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=28`,
    fetchDocumentaries: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=99`,
};
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Promise.all([
        axios_1.default.get(requests.fetchTrending),
        axios_1.default.get(requests.fetchNetflixOriginals),
        axios_1.default.get(requests.fetchTopRated),
        axios_1.default.get(requests.fetchHorrorMovies),
        axios_1.default.get(requests.fetchComedyMovies),
        axios_1.default.get(requests.fetchActionMovies),
        axios_1.default.get(requests.fetchDocumentaries),
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
        };
        res.json(data);
    })
        .catch((error) => {
        res.status(500).json({ message: "could not fetch data" });
    });
}));
// const { Client } = require("pg")
// const port = parseInt(process.env.PORT || "5432", 10)
// const client = new Client({
//   host: process.env.PG_HOST,
//   port: port,
//   user: process.env.PG_USER,
//   password: process.env.PG_PASSWORD,
//   database: process.env.PG_DATABASE,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// })
// client.connect()
// if (client.connected) {
//   console.log("Connected to the database")
// } else {
//   console.log("Error connecting to the database")
// }
// const { Client } = require("pg")
// const client = new Client({
//   host: process.env.PG_HOST,
//   port: process.env.PORT,
//   user: process.env.PG_USER,
//   password: process.env.PG_PASSWORD,
//   database: process.env.PG_DATABASE,
//   URL: process.env.PG_URL,
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
// const port = process.env.PORT || "5432"
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//   next()
// })
// app.listen(port, () => {
//   console.log(`listening on this port ${port} || process.env.PG_PORT`)
// })
// v1
// app.post("/register", async (req, res) => {
//   // verify
//   const token = req.headers.authorization
//   // verify
//   const { username, password } = req.body
//   try {
//     const result = await client.query("INSERT INTO users(username,password) VALUES($1, $2) RETURNING id", [
//       username,
//       password,
//     ])
//     const token = jwt.sign({ userId: result.rows[0].id }, process.env.SECRET_KEY, {
//       expiresIn: "24h",
//     })
//     res.status(201).json({ token })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: "Error creating user" })
//   }
//   const decoded = jwt.verify(token, process.env.SECRET_KEY)
//   jwt.verify(token, process.env.SECRET_KEY)
// })
// registerrr v2
// app.post("/register", async (req, res) => {
// Extract the user's information from the request body
// const { username, password } = req.body
// try {
//   // Insert the user into the database
//   const result = await client.query("INSERT INTO users(username,password) VALUES($1, $2) RETURNING id", [
//     username,
//     password,
//   ])
//   // Create a new token
//   const tokenToSend = jwt.sign({ userId: result.rows[0].id }, process.env.SECRET_KEY, {
//     expiresIn: "24h",
//   })
//   // associate the token with the user in the database
//   await client.query("INSERT INTO tokens (user_id, token) VALUES ($1, $2)", [result.rows[0].id, tokenToSend])
//   // Send the token back in the response
//   res.status(201).json({ tokenToSend })
// } catch (error) {
//   console.log(error)
//   res.status(500).json({ message: "Error creating user" })
// }
// })
// after connected to db
// after connected to db
// after connected to db
// after connected to db
// after connected to db
// after connected to db
// after connected to db
// login v1
// app.post("/login", async (req, res) => {
//   // Extract the user's information from the request body
//   const { username, password } = req.body
//   try {
//     // Verify that the user's credentials are correct
//     const result = await client.query("SELECT * FROM users WHERE username=$1 AND password=$2", [username, password])
//     if (result.rows.length === 0) {
//       return res.status(401).json({ message: "Invalid credentials" })
//     }
//     // Create a new token
//     const token = jwt.sign({ userId: result.rows[0].id }, process.env.SECRET_KEY, {
//       expiresIn: "24h",
//     })
//     // associate the token with the user in the database
//     await client.query("INSERT INTO tokens (user_id, token) VALUES ($1, $2)", [result.rows[0].id, token])
//     // Send the token back in the response
//     res.status(200).json({ token })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: "Error logging in" })
//   }
// })
// login v2
// app.post("/login", async (req, res) => {
//   // Extract the user's information from the request body
//   const { username, password } = req.body
//   try {
//     // Verify that the user's credentials are correct
//     const result = await client.query("SELECT * FROM users WHERE username=$1 AND password=$2", [username, password])
//     if (result.rows.length === 0) {
//       return res.status(401).json({ message: "Invalid credentials" })
//     }
//     // Create a new token
//     const tokenToSend = jwt.sign({ userId: result.rows[0].id }, process.env.SECRET_KEY, {
//       expiresIn: "24h",
//     })
//     // associate the token with the user in the database
//     await client.query("INSERT INTO tokens (user_id, token) VALUES ($1, $2)", [result.rows[0].id, tokenToSend])
//     // Send the token back in the response
//     res.status(200).json({ tokenToSend })
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ message: "Error logging in" })
//   }
// })
// app.use(
//   cors({
//     origin: "http://localhost:8000/test",
//   })
// )
// app.get("/", (req: Request, res: Response) => {
//   res.send("main page")
// })
// just removed
// app.get("/profile", (req: Request, res: Response) => {
//   res.send("profile page")
// })
// app.get("/trending", async (req, res) => {
//   const response = await Axios.get(requests.fetchTrending)
//   res.json(response.data)
// })
// app.get("/originals", async (req, res) => {
//   const response = await Axios.get(requests.fetchNetflixOriginals)
//   res.json(response.data)
// })
// just removed
// const jwt = require("jsonwebtoken")
