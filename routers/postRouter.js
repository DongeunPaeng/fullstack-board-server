const express = require("express");

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

postRouter.post("/draft", verifyToken, async (req, res) => {
    try {
        const queryResults = await postService.getDrafts();
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

    try {
        const queryResults = await postService.getPost(id);
        const post = queryResults[0];
        const previousPostQueryResult = await postService.getPreviousPost(post);
        const previousPost = previousPostQueryResult[0];
        const nextPostQueryResult = await postService.getNextPost(post);
        const nextPost = nextPostQueryResult[0];
        res.status(200).json({ post, previousPost, nextPost });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "something went wrong! sorry." });
    }
});

postRouter.get("/draft/:id", async (req, res) => {
    const {
        params: { id },
    } = req;

    const postId = id;

    try {
        const queryResults = await postService.getDraft(postId);
        const post = queryResults[0];

        res.status(200).json({ post });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "something went wrong! sorry." });
    }
});

postRouter.post("/write", verifyToken, async (req, res) => {
    const {
        body: { title, post, type, status },
        user: { sub },
    } = req;

    try {
        await postService.writePost(title, sub, post, type, status);
        res.status(200).json({ message: "Upload success!" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "something went wrong! sorry." });
    }
});

postRouter.post("/edit", verifyToken, async (req, res) => {
    const {
        body: { title, post, postId, type, status },
    } = req;

    try {
        await postService.editPost(title, post, postId, type, status);
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
