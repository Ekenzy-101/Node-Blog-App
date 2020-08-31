#!/usr/bin/env node

/**
 * Module dependencies.
 */

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  let addr = server.address();
  let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
};

const app = require("../app");
const debug = require("debug")("node-blog-app:server");
const http = require("http");

/**
 * Get port from environment and store in Express.
 */

const PORT = normalizePort(process.env.PORT || "4000");
app.set("port", PORT);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.on("error", onError);
server.on("listening", onListening);
