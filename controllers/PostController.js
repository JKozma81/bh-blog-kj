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
      if (req.query.error === "title-content-slug") {
        postError = "Title, Content and Slug are Mandatory!";
      }
      if (req.query.error === "title-and-slug") {
        postError = "Title and Slug are Mandatory!";
      }
      if (req.query.error === "content-and-slug") {
        postError = "Content and Slug are Mandatory!";
      }
      if (req.query.error === "title-and-content") {
        postError = "Title and Content are Mandatory!";
      }

      if (req.query.error === "title") postError = "Title is Mandatory!";
      if (req.query.error === "content") postError = "Content is Mandatory!";
      if (req.query.error === "slug") postError = "Slug is Mandatory!";
    }

    res.render("newPost", {
      siteTitle: "Bishops First Blog",
      submenuTitle: "New Post",
      username: user.username,
      postError,
      title: req.query.title ? req.query.title : "",
      content: req.query.content ? req.query.content : "",
      slug: req.query.slug ? req.query.slug : ""
    });
  }

  post(req, res) {
    const { title, content, slug, draft } = req.body;

    if (!title && !content && !slug) {
      res.redirect("/posts?error=title-content-slug");
      return;
    }
    if (!title && !slug) {
      res.redirect(`/posts?error=title-and-slug&content=${content}`);
      return;
    }
    if (!slug && !content) {
      res.redirect(`/posts?error=content-and-slug&title=${title}`);
      return;
    }
    if (!title) {
      res.redirect(`/posts?error=title&content=${content}&slug=${slug}`);
      return;
    }
    if (!content) {
      res.redirect(`/posts?error=content&title=${title}&slug=${slug}`);
      return;
    }
    if (!slug) {
      res.redirect(`/posts?error=content&title=${title}&content=${content}`);
      return;
    }

    const SID = Number(req.cookies[this.cookieController.getCookie()]);
    const user = this.sessionController.getSession(SID).user;

    const newPost = {
      title,
      author: user.username,
      content,
      slug,
      draft
    };
    PostsDAO.addPost(newPost);
    res.redirect("/admin");
  }

  async showBlogPost(req, res) {
    const searchParameter = Number(req.params.idOrSlug);

    const blogPost = await PostsDAO.getPost(
      isNaN(searchParameter) ? req.params.idOrSlug : searchParameter
    );

    if (!blogPost) {
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
