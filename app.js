const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();

const { DBPath, AUTH_COOKIE } = require('./config/config.json');
const users = require('./mocks/Users');

const db = new sqlite3.Database(DBPath);

const PostController = require('./controllers/PostController');
const BlogPostServive = require('./services/BlogPostService');
const PostRepository = require('./repositories/PostRepository');
const DBAdapter = require('./repositories/DatabaseAdapter');
const BlogPost = require('./domains/BlogPost');
const ArchiveMap = require('./domains/ArchiveMap');
const LoginController = require('./controllers/LoginController');
const {
  MessageProviderService,
  messages
} = require('./services/MessageProviderService');
const { SessionServices, sessions } = require('./services/SessionServices');
const AdminController = require('./controllers/AdminController');
const UserAuthentication = require('./middlewares/Authentication');

const dbAdapter = new DBAdapter(db);
const postRepository = new PostRepository(dbAdapter, BlogPost, ArchiveMap);
const blogPostService = new BlogPostServive(postRepository);
const sessionService = new SessionServices(sessions);
const userAuthentication = new UserAuthentication();

/////

const DataFormatingService = require('./services/DataFormatingService');

const dataFormatingService = new DataFormatingService();
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

app.post(
  '/login',
  userAuthentication.login({ users }),
  LoginController.login({
    authCookie: AUTH_COOKIE,
    sessionService
  })
);

app.get(
  '/logout',
  LoginController.logout({
    authCookie: AUTH_COOKIE,
    sessionService
  })
);

app.get(
  '/admin',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE
  }),
  AdminController.showDashboard
);

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
