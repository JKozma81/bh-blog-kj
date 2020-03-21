const PostsDAO = require("../services/PostsDAO");

class PostController {
  constructor(sessionController, cookieController) {
    this.sessionController = sessionController;
    this.cookieController = cookieController;
  }

  get(req, res) {
    const user = req.user;
    let postError = "";

    if (req.query.error) {
      if (req.query.error === "title") postError = "Title is Mandatory!";
      if (req.query.error === "content") postError = "Content is Mandatory!";
      if (req.query.error === "title-and-content")
        postError = "Title and Content are Mandatory!";
    }

    res.render("newPost", {
      siteTitle: "Bishops First Blog",
      username: user.username,
      postError,
      title: req.query.title ? req.query.title : "",
      content: req.query.content ? req.query.content : ""
    });
  }

  post(req, res) {
    const { title, content } = req.body;

    if (!title && !content) {
      res.redirect("/posts?error=title-and-content");
      return;
    }
    if (!title) {
      res.redirect(`/posts?error=title&content=${content}`);
      return;
    }
    if (!content) {
      res.redirect(`/posts?error=content&title=${title}`);
      return;
    }

    const date = new Date().toLocaleString();
    const SID = Number(req.cookies[this.cookieController.getCookie()]);
    const user = this.sessionController.getSession(SID).user;

    const newPost = {
      title,
      author: user.username,
      created_at: date,
      content
    };
    PostsDAO.addPost(newPost);
    res.redirect("/admin");
  }

  async getBlogPost(req, res) {
    const postID = Number(req.params.id);
    const blogPost = await PostsDAO.getPost(postID);

    if (!postID || !blogPost) {
      res.render("custom404", {
        siteTitle: "Bishops First Blog"
      });
      return;
    }

    res.render("readPost", {
      siteTitle: "Bishops First Blog",
      post: blogPost
    });
  }
}

module.exports = PostController;
