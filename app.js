const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const LoginController = require('./controllers/LoginController');
const AdminController = require('./controllers/AdminController');
const UserAuthenticationMiddleware = require('./middlewares/Authentication');
const PostController = require('./controllers/PostController');
const PostsDAO = require('./DAO/PostsDAO');

const app = express();
const port = 3000;

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', async (req, res) => {
	const sortedBlogPosts = await PostsDAO.getPublishedPostSortedByDate();

	const formatedBlogPostData = {};
	sortedBlogPosts.forEach(blogPost => {
		let fullDate = blogPost.published_at.split(' ')[0].split('-');
		fullDate = fullDate.map(element => (element = Number(element)));

		let date = new Date(...fullDate);
		let year = date.getFullYear();
		let month = date.toLocaleString('en-US', { month: 'long' });

		if (!formatedBlogPostData.hasOwnProperty(year)) {
			formatedBlogPostData[year] = {};
			if (!formatedBlogPostData[year].hasOwnProperty(month)) {
				formatedBlogPostData[year][month] = [];
			}
		}
		formatedBlogPostData[year][month].push({
			id: blogPost.id,
			title: blogPost.title
		});
	});

	res.render('home', {
		siteTitle: 'Bishops First Blog',
		postList: await PostsDAO.getAllPublishedPosts(),
		formatedBlogPostData
	});
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
