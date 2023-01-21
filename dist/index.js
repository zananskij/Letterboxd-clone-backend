"use strict";
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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 8000;
app.use((0, cors_1.default)());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.API_KEY;
const { Client } = require("pg");
const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    URL: process.env.PG_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
client.connect((err) => {
    if (err) {
        console.error("connection error", err.stack);
    }
    else {
        console.log("connected");
    }
});
const jwt = require("jsonwebtoken");
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // verify
    const token = req.headers.authorization;
    // verify
    const { username, password } = req.body;
    try {
        const result = yield client.query("INSERT INTO users(username,password) VALUES($1, $2) RETURNING id", [
            username,
            password,
        ]);
        const token = jwt.sign({ userId: result.rows[0].id }, process.env.SECRET_KEY, {
            expiresIn: "24h",
        });
        res.status(201).json({ token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating user" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    jwt.verify(token, process.env.SECRET_KEY);
}));
// register
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract the user's information from the request body
    const { username, password } = req.body;
    try {
        // Insert the user into the database
        const result = yield client.query("INSERT INTO users(username,password) VALUES($1, $2) RETURNING id", [
            username,
            password,
        ]);
        // Create a new token
        const token = jwt.sign({ userId: result.rows[0].id }, process.env.SECRET_KEY, {
            expiresIn: "24h",
        });
        // associate the token with the user in the database
        yield client.query("INSERT INTO tokens (user_id, token) VALUES ($1, $2)", [result.rows[0].id, token]);
        // Send the token back in the response
        res.status(201).json({ token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating user" });
    }
}));
// login
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract the user's information from the request body
    const { username, password } = req.body;
    try {
        // Verify that the user's credentials are correct
        const result = yield client.query("SELECT * FROM users WHERE username=$1 AND password=$2", [username, password]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Create a new token
        const token = jwt.sign({ userId: result.rows[0].id }, process.env.SECRET_KEY, {
            expiresIn: "24h",
        });
        // associate the token with the user in the database
        yield client.query("INSERT INTO tokens (user_id, token) VALUES ($1, $2)", [result.rows[0].id, token]);
        // Send the token back in the response
        res.status(200).json({ token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error logging in" });
    }
}));
// app.use(
//   cors({
//     origin: "http://localhost:8000/test",
//   })
// )
// app.get("/", (req: Request, res: Response) => {
//   res.send("main page")
// })
app.get("/profile", (req, res) => {
    res.send("profile page");
});
app.listen(port, () => {
    console.log(`listening on port ${port} `);
});
app.get("/trending", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(requests.fetchTrending);
    res.json(response.data);
}));
app.get("/originals", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(requests.fetchNetflixOriginals);
    res.json(response.data);
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
