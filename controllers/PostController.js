class PostController {
  constructor(postList, sessionController, cookieController) {
    this.postList = postList;
    this.sessionController = sessionController;
    this.cookieController = cookieController;
  }

  get(req, res) {
    const user = req.user;
    res.render("newPost", {
      siteTitle: "Bishops First Blog",
      username: user.username
    });
  }

  post(req, res) {
    const { title, content } = req.body;
    const date = new Date();
    const SID = Number(req.cookies[this.cookieController.getCookie()]);
    const user = this.sessionController.getSession(SID).user;

    const newPost = {
      id: this.postList.length + 1,
      title,
      author: user.username,
      created_at: `${date.getFullYear()}. ${date.getMonth()}. ${date.getDay()}`,
      date: `${date.getFullYear()}. ${date.getMonth()}. ${date.getDay()}`,
      text: content
    };
    this.postList.push(newPost);
    res.redirect("/admin");
  }
}

module.exports = PostController;
