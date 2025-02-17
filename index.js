import express from "express";
import { dirname } from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const blogs = [];

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/newBlog", (req, res) => {
  res.render("newBlog.ejs");
});

app.post("/submit", (req, res) => {
  const titleOfTheStory = req.body.title;
  const contentOfTheStory = req.body.content;

  blogs.push({ title: titleOfTheStory, content: contentOfTheStory });
  res.redirect("/writtenBlogs");
});

app.get("/writtenBlogs", (req, res) => {
  res.render("writtenBlogs.ejs", { blogs: blogs });
});

app.post("/delete", (req, res) => {
  let index = req.body.index;

  if (index !== undefined && index < blogs.length) {
    blogs.splice(index, 1);
  }

  res.redirect("/writtenBlogs"); // ✅ Corrected redirect
});

app.get("/edit", (req, res) => {
  const index = req.query.index;
  console.log("Editing Blog at Index:", index);

  // If index is missing or invalid, redirect to home page or show an error
  if (index === undefined || isNaN(index) || !blogs[index]) {
    return res.redirect("/"); // Redirects to home page (or change this to an error page)
  }

  const blog = blogs[index];  
  res.render("editBlogs.ejs", { blog, index });  
});



app.post("/update", (req, res) => {
  const index = req.body.index;  // Get the index from the form
  const updatedTitle = req.body.title;  // Get the updated title
  const updatedContent = req.body.content;  // Get the updated content

  // Update the blog at the given index
  blogs[index] = { title: updatedTitle, content: updatedContent };

  // Redirect to the page showing all blogs
  res.redirect("/writtenBlogs");
});


app.get("/editblogs", (req, res) => {
  res.render("editBlogs.ejs");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
