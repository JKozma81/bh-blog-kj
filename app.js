const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();

const { DBPath } = require('./config/config.json');
const messages = require('./mocks/Messages');

const LoginController = require('./controllers/LoginController');
const AdminController = require('./controllers/AdminController');
const UserAuthenticationMiddleware = require('./middlewares/Authentication');
const PostController = require('./controllers/PostController');

const MessageProviderService = require('./services/MessageProviderService');
const BlogPostServive = require('./services/BlogPostService');
const PostRepository = require('./repositories/PostRepository');
const DBService = require('./services/DatabaseService');
const DataFormatingService = require('./services/DataFormatingService');
const BlogPost = require('./domains/BlogPost');

const db = new sqlite3.Database(DBPath);

const dbService = new DBService(db);
const dataFormatingService = new DataFormatingService();
const postRepository = new PostRepository(dbService, dataFormatingService);
const blogPostService = new BlogPostServive(BlogPost, postRepository);
const messageProviderService = new MessageProviderService(messages);

const app = express();
const port = 3000;

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get(
  '/',
  PostController.showHome({
    blogPostService
  })
);

app.get(
  '/login',
  LoginController.showLogin({
    messageProviderService
  })
);

// app.post("/login", LoginController.post, LoginController.logUserIn);

// app.get("/logout", LoginController.logUserOut);

// app.get(
//   "/admin",
//   UserAuthenticationMiddleware.authenticate,
//   AdminController.get
// );

// app.get(
//   "/admin/list",
//   UserAuthenticationMiddleware.authenticate,
//   AdminController.adminBlogPostList
// );

// app.get(
//   "/admin/list/:id",
//   UserAuthenticationMiddleware.authenticate,
//   AdminController.editBlogPost
// );

// app.post(
//   "/admin/list/:id",
//   UserAuthenticationMiddleware.authenticate,
//   AdminController.modifyBlogPost
// );

// app.get(
//   "/posts",
//   UserAuthenticationMiddleware.authenticate,
//   PostController.get
// );

// app.get("/posts/:idOrSlug", PostController.showBlogPost);

// app.post(
//   "/posts",
//   UserAuthenticationMiddleware.authenticate,
//   PostController.post
// );

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
