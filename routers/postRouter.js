const express = require("express");
const jwtDecode = require("jwt-decode");

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

// FIXME dongeun: finish this service
postRouter.post("/", async (req, res) => {
  const {
    body: { title, post, accessToken },
  } = req;

  const { email } = jwtDecode(accessToken);
  // FIXME dongeun: Check expiration time of the token!

  try {
    const insertId = await postService.writePost(title, email, post);
    if (insertId) {
      // FIXME dongeun: do something here, or don't make the insertId variable
    }
    res.status(200).json({ message: "Upload success!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "something went wrong! sorry." });
  }
});

module.exports = postRouter;
