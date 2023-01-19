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
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.API_KEY;
const app = (0, express_1.default)();
const port = 8000;
app.use((0, cors_1.default)());
const { Client } = require("pg");
const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});
client.connect((err) => {
    if (err) {
        console.error("connection error", err.stack);
    }
    else {
        console.log("connected");
    }
});
// app.use(
//   cors({
//     origin: "http://localhost:8000/test",
//   })
// )
app.get("/", (req, res) => {
    res.send("main page");
});
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
    fetchHorrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=27`,
};
app.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Promise.all([
        axios_1.default.get(requests.fetchTrending),
        axios_1.default.get(requests.fetchNetflixOriginals),
        axios_1.default.get(requests.fetchHorrorMovies),
    ])
        .then(([response1, response2, response3]) => {
        const data = {
            trending: response1.data,
            netflixOriginals: response2.data,
            horror: response3.data,
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
