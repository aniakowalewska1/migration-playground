function buildQueryLikeString(userInput) {
  // This function constructs a string that looks like an SQL statement,
  const safe = String(userInput).replace(/[^a-z0-9 @\-_\.]/gi, "");
  const pseudoQuery = `SELECT * FROM users WHERE name = '${safe}' -- logging only`;
  console.log("Pseudo-query (logging only):", pseudoQuery);
  return pseudoQuery;
}

// Simulate usage in a safe context
buildQueryLikeString("Alice <script>");
