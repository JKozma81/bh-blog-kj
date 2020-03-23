const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const LoginController = require('./controllers/LoginController');
const AdminController = require('./controllers/AdminController');
const UserAuthenticationMiddleware = require('./middlewares/Authentication');
const PostController = require('./controllers/PostController');
const PostsDAO = require('./DAO/PostsDAO');
const DataFormatingService = require('./services/DataFormatingService');

const app = express();
const port = 3000;

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', async (req, res) => {
	try {
		const sortedBlogPosts = await PostsDAO.getPublishedPostSortedByDate();

		res.render('home', {
			siteTitle: 'Bishops First Blog',
			postList: await PostsDAO.getAllPublishedPosts(),
			formatedBlogPostData: DataFormatingService.formatDataForArchive(
				sortedBlogPosts
			)
		});
	} catch (err) {
		console.error(err);
	}
});

app.get('/login', LoginController.get);

app.post('/login', LoginController.post, LoginController.logUserIn);

app.get('/logout', LoginController.logUserOut);

app.get(
	'/admin',
	UserAuthenticationMiddleware.authenticate,
	AdminController.get
);

app.get(
	'/admin/list',
	UserAuthenticationMiddleware.authenticate,
	AdminController.adminBlogPostList
);

app.get(
	'/admin/list/:id',
	UserAuthenticationMiddleware.authenticate,
	AdminController.editBlogPost
);

app.post(
	'/admin/list/:id',
	UserAuthenticationMiddleware.authenticate,
	AdminController.modifyBlogPost
);

app.get(
	'/posts',
	UserAuthenticationMiddleware.authenticate,
	PostController.get
);

app.get('/posts/:idOrSlug', PostController.showBlogPost);

app.post(
	'/posts',
	UserAuthenticationMiddleware.authenticate,
	PostController.post
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
