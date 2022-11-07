const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const port = 3000;
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://<USERNAME>:<PASSWORD>@localhost:27017/blogPage");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

// *----------------- Schema & Model *----------------- //
const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add title."],
  },
  body: {
    type: String,
  },
});

const Post = mongoose.model("Post", postSchema);

// *----------------- End Schema & Model *----------------- //
app.get("/", (req, res) => {
  Post.find({}, (err, found) => {
    if (!err) {
      res.render("home", { home: homeStartingContent, posts: found });
    }
  });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody,
  });
  post.save();
  res.redirect("/");
});

app.get("/posts", (req, res) => {
  Post.find({}, (err, founded) => {
    if (!err) {
      res.render("posts", { posts: founded });
    }
  });
});

app.get("/posts/:postId", (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId, (err, founded) => {
    if (!err) {
      res.render("post", { post: founded });
    }
  });
});

app.post("/delete", (req, res) => {
  const buttonValue = req.body.deleteButton;
  Post.findOneAndRemove(buttonValue, (err, result) => {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.post("/update", (req, res) => {
  const buttonValue = req.body.updateButton;
  Post.findById(buttonValue, (err, foundedPost) => {
    if (!err) {
      res.render("update", { post: foundedPost });
    }
  });
});

app.post("/updated", (req, res) => {
  const buttonValue = req.body.updateButton;
  Post.findByIdAndUpdate(
    buttonValue,
    {
      title: req.body.updatedTitle,
      body: req.body.updatedBody,
    },
    (err) => {
      if (!err) {
        res.redirect(`/posts/${buttonValue}`);
      }
    }
  );
});

app.listen(process.env.PORT || port, () => {
  console.log(`Working on http://localhost:${port}`);
});
