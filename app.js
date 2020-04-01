const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();

const PostController = require('./controllers/PostController');
const BlogPostServive = require('./services/BlogPostService');
const PostRepository = require('./repositories/PostRepository');
const DBAdapter = require('./repositories/DatabaseAdapter');

const LoginController = require('./controllers/LoginController');
const {
  MessageProviderService,
  messages
} = require('./services/MessageProviderService');
const { SessionServices, sessions } = require('./services/SessionServices');
const AdminController = require('./controllers/AdminController');
const UserAuthentication = require('./middlewares/Authentication');
const ArchiveConfigService = require('./services/ArchiveConfigService');
const ArchiveConfigRepository = require('./repositories/ArchiveRepository');

const { DBPath, AUTH_COOKIE } = require('./configs/config.json');
const users = require('./mocks/Users');

const db = new sqlite3.Database(DBPath);
const dbAdapter = new DBAdapter(db);
dbAdapter.init();

const archiveRepository = new ArchiveConfigRepository(dbAdapter);
const archiveConfigService = new ArchiveConfigService(archiveRepository);
const postRepository = new PostRepository(dbAdapter);
const blogPostService = new BlogPostServive(postRepository);
const sessionService = new SessionServices(sessions);
const userAuthentication = new UserAuthentication();
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
    blogPostService,
    archiveConfigService
  })
);

app.post(
  '/search',
  PostController.getSearched({
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

app.get(
  '/admin/list',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE
  }),
  AdminController.showAdminBlogPostList({ blogPostService })
);

app.get(
  '/admin/list/:id',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE
  }),
  AdminController.showEditBlogPost({ blogPostService })
);

app.post(
  '/admin/list/:id',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE
  }),
  AdminController.modifyBlogPost({ blogPostService })
);

app.get(
  '/admin/config',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE
  }),
  AdminController.showConfigurations({
    archiveConfigService
  })
);

app.post(
  '/admin/config',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE
  }),
  AdminController.saveConfigurations({
    archiveConfigService
  })
);

app.get(
  '/posts',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE
  }),
  PostController.showNewPost({ messageProviderService })
);

app.get('/posts/:idOrSlug', PostController.showBlogPost({ blogPostService }));

app.post(
  '/posts',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE
  }),
  PostController.receiveBlogPostDataAndSave({
    authCookie: AUTH_COOKIE,
    sessionService,
    blogPostService
  })
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
