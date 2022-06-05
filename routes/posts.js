const router = require("express").Router();
const Post = require("../model/Post");
const User = require("../model/User");
const isAuth = require("../middlewares/auth.middlewares")
const updateOnline = require("../middlewares/updateUserOnline.middlewares")

//create a post

router.post("/", isAuth, async(req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});
//update a post


// Delete Post
router.delete("/:id", [isAuth, updateOnline], async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.delete();
            res.status(200).json("Bài viết đã bị xóa");

        } else {
            alert("Không thể xóa bài viết của người khác");
            res.status(403).json("Không thể xóa bài viết của người khác");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//like / dislike a post

router.put("/:id/like", [isAuth, updateOnline], async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: {
                    likes: req.body.userId
                }
            });
            res.status(200).json("Bạn đã thích bài viết");
        } else {
            await post.updateOne({
                $pull: {
                    likes: req.body.userId
                }
            });
            res.status(200).json("Bạn đã hủy thích bài viết");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
//get a post

router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get timeline posts

router.get("/timeline/:userId", isAuth, async(req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({
            userId: currentUser._id
        });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({
                    userId: friendId
                });
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
});
//get user's all posts

router.get("/profile/:username", [isAuth, updateOnline], async(req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username
        });
        const posts = await Post.find({
            userId: user._id
        });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;