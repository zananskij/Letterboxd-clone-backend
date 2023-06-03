import pool from "../db"

// Users
export async function createUser(username: string, password: string) {
  const newUser = await pool.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id;", [
    username,
    password,
  ])
  return newUser.rows[0]
}

export async function getUserByUsername(username: string) {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username])
  return result.rows[0]
}

// Watched
export async function addMediaToWatched(userId: number, mediaId: number) {
  await pool.query("INSERT INTO watched (user_id, media_id) VALUES ($1, $2);", [userId, mediaId])
}

export async function removeMediaFromWatched(userId: number, mediaId: number) {
  await pool.query("DELETE FROM watched WHERE user_id = $1 AND media_id = $2;", [userId, mediaId])
}

export async function getWatchedByUser(userId: number) {
  console.log(`Fetching watched list for user ${userId}`)
  const result = await pool.query("SELECT * FROM watched WHERE user_id = $1", [userId])
  console.log(`Fetched ${result.rowCount} items`)
  return result.rows
}

// WatchLater
export async function addMediaToWatchLater(userId: number, mediaId: number) {
  await pool.query("INSERT INTO watchlater (user_id, media_id) VALUES ($1, $2);", [userId, mediaId])
}

export async function removeMediaFromWatchLater(userId: number, mediaId: number) {
  await pool.query("DELETE FROM watchlater WHERE user_id = $1 AND media_id = $2;", [userId, mediaId])
}

export async function getWatchLaterByUser(userId: number) {
  console.log(`Fetching watchLater list for user ${userId}`)
  const result = await pool.query("SELECT * FROM watchlater WHERE user_id = $1", [userId])
  console.log(`Fetched ${result.rowCount} items`)
  return result.rows
}
