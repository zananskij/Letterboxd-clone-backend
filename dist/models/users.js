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
exports.getWatchLaterByUser = exports.removeMediaFromWatchLater = exports.addMediaToWatchLater = exports.getWatchedByUser = exports.removeMediaFromWatched = exports.addMediaToWatched = exports.getUserByUsername = exports.createUser = void 0;
const db_1 = __importDefault(require("../db"));
// Users
function createUser(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = yield db_1.default.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id;", [
            username,
            password,
        ]);
        return newUser.rows[0];
    });
}
exports.createUser = createUser;
function getUserByUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield db_1.default.query("SELECT * FROM users WHERE username = $1", [username]);
        return result.rows[0];
    });
}
exports.getUserByUsername = getUserByUsername;
// Watched
function addMediaToWatched(userId, mediaId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.default.query("INSERT INTO watched (user_id, media_id) VALUES ($1, $2);", [userId, mediaId]);
    });
}
exports.addMediaToWatched = addMediaToWatched;
function removeMediaFromWatched(userId, mediaId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.default.query("DELETE FROM watched WHERE user_id = $1 AND media_id = $2;", [userId, mediaId]);
    });
}
exports.removeMediaFromWatched = removeMediaFromWatched;
function getWatchedByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Fetching watched list for user ${userId}`);
        const result = yield db_1.default.query("SELECT * FROM watched WHERE user_id = $1", [userId]);
        console.log(`Fetched ${result.rowCount} items`);
        return result.rows;
    });
}
exports.getWatchedByUser = getWatchedByUser;
// WatchLater
function addMediaToWatchLater(userId, mediaId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.default.query("INSERT INTO watchlater (user_id, media_id) VALUES ($1, $2);", [userId, mediaId]);
    });
}
exports.addMediaToWatchLater = addMediaToWatchLater;
function removeMediaFromWatchLater(userId, mediaId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.default.query("DELETE FROM watchlater WHERE user_id = $1 AND media_id = $2;", [userId, mediaId]);
    });
}
exports.removeMediaFromWatchLater = removeMediaFromWatchLater;
function getWatchLaterByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Fetching watchLater list for user ${userId}`);
        const result = yield db_1.default.query("SELECT * FROM watchlater WHERE user_id = $1", [userId]);
        console.log(`Fetched ${result.rowCount} items`);
        return result.rows;
    });
}
exports.getWatchLaterByUser = getWatchLaterByUser;
