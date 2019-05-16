const Posts = require("../data/db.js");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const post = await Posts.insert(req.body);

    if (req.body.title && req.body.contents) {
      res.status(201).json(post);
    } else {
      res.status(500).json({
        error: "Please provide title and contents for the post."
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "There was an error while saving the post to the database."
    });
  }
});

router.post("/:id/comments", async (req, res) => {
  const commentInfo = { ...req.body, post_id: req.params.id };

  try {
    const post = await Posts.insertComment(commentInfo);

    if (!req.body.text) {
      res
        .status(400)
        .json({ errorMessage: "Please provide text for the comment." });
    }

    if (post.length) {
      res.status(201).json(post);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({
      error: "There was an error while saving the comment to the database."
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find();
    res.status(201).json(posts);
  } catch (error) {
    res.status(500).json({
      error: "The posts information could not be retrieved."
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    console.log(post);
    if (post.length) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "The post information could not be retrieved."
    });
  }
});

router.get("/:id/comments", async (req, res) => {
  const { id } = req.params.id;

  try {
    const comments = await Posts.findCommentById(id);

    if (comments.length) {
      res.json(comments);
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({
      error: "The comments information could not be retrieved."
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const count = await Posts.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: "The post has been removed." });
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "The post could not be removed." });
  }
});

router.put("/:id", async (req, res) => {
  const postInfo = req.body;
  const { title, contents } = req.body;

  try {
    if (title && contents) {
      const post = await Posts.update(req.params.id, postInfo);
    } else {
      res
        .status(404)
        .json({ error: "The post with the specified ID does not exist." });
    }
    if (post) {
      res.status(200).json(post);
    } else {
      res
        .status(404)
        .json({ error: "The post information could not be modified." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "The post information could not be modified." });
  }
});

module.exports = router;
