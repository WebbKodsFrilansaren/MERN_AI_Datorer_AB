// CORS Options where we ONLY accept requests from "localhost:3000" (the ReactJS app, however ThunderClient bypasses it!)
// This file is used by "server.js"
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,POST,DELETE,OPTIONS", // Allow only the following HTTP request methods!
  credentials: true, // Allow cookies
  optionsSuccessStatus: 204,
  allowedHeaders: "Content-Type, Authorization",
};

// Export it for use!
module.exports = { corsOptions };
