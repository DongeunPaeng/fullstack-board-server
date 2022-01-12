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
    body: { title, post, isPrivate },
    user: { sub },
  } = req;

  try {
    await postService.writePost(title, sub, post, isPrivate);
    res.status(200).json({ message: "Upload success!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong! sorry." });
  }
});

postRouter.post("/edit", verifyToken, async (req, res) => {
  const {
    body: { title, post, postId, isPrivate },
  } = req;

  try {
    await postService.editPost(title, post, postId, isPrivate);
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
    await postService.deletePost(postId);
    res.status(200).json({ message: "Delete success!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong! sorry." });
  }
});

module.exports = postRouter;
