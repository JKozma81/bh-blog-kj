const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");
const cookieParser = require("cookie-parser");

const users = [
  {
    username: "admin",
    password: "admin"
  }
];

const LoginController = require("./controllers/LoginController");
const AdminController = require("./controllers/AdminController");
const SessionController = require("./controllers/SessionController");
const CookieController = require("./controllers/CookieController");
const Authentication = require("./utils/Authentication");
const PostController = require("./controllers/PostController");

const PostsDAO = require("./services/PostsDAO");

const adminController = new AdminController();
const sessionCotroller = new SessionController();
const cookieController = new CookieController();
const postController = new PostController(sessionCotroller, cookieController);
const loginCotroller = new LoginController(
  users,
  sessionCotroller,
  cookieController
);
const authMiddleware = new Authentication(sessionCotroller, cookieController);

const app = express();
const port = 3000;

app.engine("handlebars", hbs());
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", async (req, res) => {
  res.render("home", {
    siteTitle: "Bishops First Blog",
    postList: await PostsDAO.getAllPosts()
  });
});

app.get("/login", loginCotroller.get);

app.post(
  "/login",
  loginCotroller.post.bind(loginCotroller),
  loginCotroller.logUserIn.bind(loginCotroller)
);

app.get("/logout", loginCotroller.logUserOut.bind(loginCotroller));

app.get(
  "/admin",
  authMiddleware.authenticate.bind(authMiddleware),
  adminController.get
);

app.get(
  "/admin/list",
  authMiddleware.authenticate.bind(authMiddleware),
  adminController.adminBlogPostList
);

app.get(
  "/admin/list/:id",
  authMiddleware.authenticate.bind(authMiddleware),
  adminController.editBlogPost
);

app.post(
  "/admin/list/:id",
  authMiddleware.authenticate.bind(authMiddleware),
  adminController.modifyBlogPost
);

app.get(
  "/posts",
  authMiddleware.authenticate.bind(authMiddleware),
  postController.get.bind(postController)
);

app.get("/posts/:idOrSlug", postController.showBlogPost);

app.post(
  "/posts",
  authMiddleware.authenticate.bind(authMiddleware),
  postController.post.bind(postController)
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
