const express = require("express");

const PostsRouter = require("./posts/posts-router.js");

const server = express();

server.use(express.json());
server.use("/api/posts", PostsRouter);

server.get("/", (req, res) => {
  res.send(`
    <p>Welcome to the WEB II Challenge API</p>
  `);
});

server.use(express.json());

module.exports = server;
