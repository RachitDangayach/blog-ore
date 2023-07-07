//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);


const homeContent = `BLOG ORE is a website developed for composing your day-to-day blogs. You can compose different blogs by going at the compose page. Your blogs will be displyed at the home page, truncated to 100 words, with a 'Read More' link. The link will take you to the respective pages of the blog, where you will be able to see the whole blog.`;
const aboutContent = `Hello there, I'm Rachit Dangayach. I'm a multifaceted individual with a diverse range of interests and a deep passion for learning. Proficient in C++ and data structures, HTML, CSS, JS & ReactJS. I relish exploring the intricacies of coding. Currently, I'm immersing myself in Software and Web Development. I'm constantly seeking opportunities to expand my knowledge and skills in various domains.`;
const contactContent = "Contact us at rachitdangayach@blogore.in.";
const currDate = new Date();
const currYear = currDate.getFullYear();
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {
  title: {
    type: String,
    required: [true, "Enter Title."]
  },
  content: {
    type: String,
    required: [true, "Enter Content."]
  }
};

const Post = mongoose.model("Post", postSchema);

app.get("/", async (req, res) => {
  const posts = await Post.find({});
  res.render("home", {homeText: homeContent, year: currYear, postsList: posts});
});

app.get("/about", (req, res) => {
  res.render("about", {aboutText: aboutContent, year: currYear});
});

app.get("/contact", (req, res) => {
  res.render("contact", {contactText: contactContent, year: currYear});
});

app.get("/compose", (req, res) => {
  res.render("compose", {year: currYear});
});

app.get("/posts/:id", async (req, res) => {
  let id = req.params.id;
  const wantedPost = await Post.findOne({_id: id});
  res.render("post", {title: wantedPost.title, content: wantedPost.content, year: currYear});
});

app.post("/compose", (req, res) => {
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postContent
  });
  post.save();
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
