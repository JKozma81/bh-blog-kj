const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');

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
const PasswordResetController = require('./controllers/PasswordResetController');
const { SessionServices, sessions } = require('./services/SessionServices');
const AdminController = require('./controllers/AdminController');
const UserAuthentication = require('./middlewares/Authentication');
const ArchiveConfigService = require('./services/ArchiveConfigService');
const ArchiveConfigRepository = require('./repositories/ArchiveRepository');
const AccountService = require('./services/AccountService');
const AccountRepository = require('./repositories/AccountRepository');
const ThemeService = require('./services/ThemeService');

const { AUTH_COOKIE } = require('./configs/config.json');
const users = require('./mocks/Users');

const configurations = {
	dateFormat: 'YYYY-MM-DD HH:mm:ss',
	'db-file': '',
	dbAdapter: function () {
		const conn = initDBConnection(this['db-file']);
		return conn;
	},
	theme: 'default',
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

const themeService = new ThemeService(configurations);
const accountService = new AccountService(accountRepository);

let blogPostService = new BlogPostServive(postRepository);
const sessionService = new SessionServices(sessions);
const userAuthentication = new UserAuthentication();
const messageProviderService = new MessageProviderService(messages);

const app = express();
const port = 3000;
themeService.applyTheme(configurations.theme);

app.engine(
	'handlebars',
	hbs({
		helpers: require('./configs/handlebarsHelper'),
	})
);
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(fileupload());

app.get(
	'/',
	PostController.showHome({
		blogPostService,
		archiveConfigService,
		formatDate,
		configurations,
	})
);

app.get(
	'/tags/:tag',
	PostController.showTags({
		blogPostService,
		archiveConfigService,
		formatDate,
		configurations,
	})
);

app.get(
	'/reset',
	PasswordResetController.showForgotPassword({
		messageProviderService,
		configurations,
	})
);

app.post(
	'/reset',
	PasswordResetController.sendPassReset({
		configurations,
		accountService,
	})
);

app.get(
	'/reset/:id',
	PasswordResetController.showPasswordReset({
		configurations,
		accountService,
	})
);

app.post(
	'/passwordreset',
	PasswordResetController.resetPassword({
		configurations,
		accountService,
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
	userAuthentication.login({ users, accountService, configurations }),
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
		themeService,
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
		themeService,
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
	AdminController.showNewAccount({ accountService, configurations })
);

app.get(
	'/admin/accounts/edit/:id',
	userAuthentication.authenticate({
		sessionService,
		authCookie: AUTH_COOKIE,
	}),
	AdminController.showEditAccount({ configurations, accountService })
);

app.post(
	'/admin/accounts/edit/:id',
	userAuthentication.authenticate({
		sessionService,
		authCookie: AUTH_COOKIE,
	}),
	AdminController.editAccount({ accountService })
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

app.all('*', (req, res) => {
	throw new Error('Bad request');
});

app.use((e, req, res, next) => {
	if (e.message === 'Bad request') {
		res.render('custom404', {
			siteTitle: 'Bishops First Blog',
		});
	}
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
