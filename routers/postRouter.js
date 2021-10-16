const express = require("express");
const jwtDecode = require("jwt-decode");

const { verifyToken } = require("../utils/common");

const PostService = require("../services/postService");
const postService = new PostService();

const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
  try {
    const queryResults = await postService.getPosts();
    const posts = queryResults;

    res.status(200).json({ posts });
  } catch (err) {
    return res.status(500).json({ message: "something went wrong! sorry." });
  }
});

postRouter.get("/:id", async (req, res) => {
  const {
    params: { id },
  } = req;

  const postId = id;

  try {
    const queryResults = await postService.getPost(postId);
    const post = queryResults[0];

    res.status(200).json({ post });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong! sorry." });
  }
});

postRouter.post("/write", verifyToken, async (req, res) => {
  const {
    body: { title, post },
    user: { sub },
  } = req;

  // FIXME dongeun: Check expiration time of the token!

  try {
    const insertId = await postService.writePost(title, sub, post);
    if (insertId) {
      // FIXME dongeun: do something here, or don't make the insertId variable
    }
    res.status(200).json({ message: "Upload success!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong! sorry." });
  }
});

postRouter.post("/edit", verifyToken, async (req, res) => {
  const {
    body: { title, post, postId },
  } = req;

  try {
    const insertId = await postService.editPost(title, post, postId);
    if (insertId) {
      // FIXME dongeun: do something here, or don't make the insertId variable
    }
    res.status(200).json({ message: "Edit success!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong! sorry." });
  }
});

postRouter.post("/delete", verifyToken, async (req, res) => {
  const {
    body: { postId },
  } = req;

  try {
    const insertId = await postService.deletePost(postId);
    if (insertId) {
      // FIXME dongeun: do something here, or don't make the insertId variable
    }
    res.status(200).json({ message: "Delete success!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong! sorry." });
  }
});

module.exports = postRouter;
