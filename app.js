const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const PostController = require('./controllers/PostController');
const BlogPostServive = require('./services/BlogPostService');
const PostRepository = require('./repositories/PostRepository');
const { initDBConnection } = require('./repositories/DatabaseAdapter');
const { formatDate } = require('./utils/dateFormating');

const LoginController = require('./controllers/LoginController');
const {
  MessageProviderService,
  messages,
} = require('./services/MessageProviderService');
const { SessionServices, sessions } = require('./services/SessionServices');
const AdminController = require('./controllers/AdminController');
const UserAuthentication = require('./middlewares/Authentication');
const ArchiveConfigService = require('./services/ArchiveConfigService');
const ArchiveConfigRepository = require('./repositories/ArchiveRepository');
const AccountService = require('./services/AccountService');
const AccountRepository = require('./repositories/AccountRepository');

const { AUTH_COOKIE } = require('./configs/config.json');
const users = require('./mocks/Users');

const configurations = {
  dateFormat: 'YYYY-MM-DD HH:mm:ss',
  'db-file': '',
  dbAdapter: function () {
    const conn = initDBConnection(this['db-file']);
    return conn;
  },
};

const archiveRepository = new ArchiveConfigRepository(
  configurations.dbAdapter.bind(configurations)
);
const archiveConfigService = new ArchiveConfigService(archiveRepository);
const postRepository = new PostRepository(
  configurations.dbAdapter.bind(configurations)
);
const accountRepository = new AccountRepository(
  configurations.dbAdapter.bind(configurations)
);
const accountService = new AccountService(accountRepository);

let blogPostService = new BlogPostServive(postRepository);
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
    archiveConfigService,
    formatDate,
    configurations,
  })
);

app.post(
  '/search',
  PostController.getSearched({
    blogPostService,
    archiveConfigService,
    formatDate,
    configurations,
  })
);

app.get(
  '/login',
  LoginController.showLogin({
    messageProviderService,
  })
);

app.post(
  '/login',
  userAuthentication.login({ users }),
  LoginController.login({
    authCookie: AUTH_COOKIE,
    sessionService,
  })
);

app.get(
  '/logout',
  LoginController.logout({
    authCookie: AUTH_COOKIE,
    sessionService,
  })
);

app.get(
  '/admin',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE,
  }),
  AdminController.showDashboard
);

app.get(
  '/admin/list',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE,
  }),
  AdminController.showAdminBlogPostList({
    blogPostService,
    formatDate,
    configurations,
  })
);

app.get(
  '/admin/list/:id',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE,
  }),
  AdminController.showEditBlogPost({
    blogPostService,
    formatDate,
    configurations,
  })
);

app.post(
  '/admin/list/:id',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE,
  }),
  AdminController.modifyBlogPost({
    blogPostService,
    formatDate,
    configurations,
  })
);

app.get(
  '/admin/config',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE,
  }),
  AdminController.showConfigurations({
    archiveConfigService,
    formatDate,
    configurations,
  })
);

app.post(
  '/admin/config',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE,
  }),
  AdminController.saveConfigurations({
    archiveConfigService,
    formatDate,
    configurations,
  })
);

app.get(
  '/admin/accounts',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE,
  }),
  AdminController.showAccountList({ accountService, configurations })
);

app.post(
  '/admin/accounts',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE,
  }),
  AdminController.addNewAccount({ accountService, configurations })
);

app.get(
  '/admin/accounts/new',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE,
  }),
  AdminController.showNewAccount({ configurations })
);

app.get(
  '/posts',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE,
  }),
  PostController.showNewPost({ messageProviderService, configurations })
);

app.get(
  '/posts/:idOrSlug',
  PostController.showBlogPost({
    blogPostService,
    formatDate,
    configurations,
  })
);

app.post(
  '/posts',
  userAuthentication.authenticate({
    sessionService,
    authCookie: AUTH_COOKIE,
  }),
  PostController.receiveBlogPostDataAndSave({
    authCookie: AUTH_COOKIE,
    sessionService,
    blogPostService,
  })
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
