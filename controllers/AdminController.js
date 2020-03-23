const PostsDAO = require('../DAO/PostsDAO');
const DataFormatingService = require('../services/DataFormatingService');

class AdminController {
	static get(req, res) {
		const user = req.user;
		res.render('dashboard', {
			siteTitle: 'Bishops First Blog',
			submenuTitle: 'Admin Dashboard',
			username: user.username
		});
	}

	static async adminBlogPostList(req, res) {
		const blogPosts = await PostsDAO.getAllPosts();

		res.render('postList', {
			siteTitle: 'Bishops First Blog',
			submenuTitle: 'Admin Post List',
			blogPosts: DataFormatingService.formatDataForAdminList(blogPosts)
		});
	}

	static async editBlogPost(req, res) {
		const blogPostID = Number(req.params.id);
		const blogPost = await PostsDAO.getPost(blogPostID);

		res.render('editPost', {
			siteTitle: 'Bishops First Blog',
			submenuTitle: 'Edit Post',
			blogPost
		});
	}

	static async modifyBlogPost(req, res) {
		const blogPostID = Number(req.params.id);
		const modifiedBlogPost = {};
		({
			title: modifiedBlogPost.title,
			slug: modifiedBlogPost.slug,
			content: modifiedBlogPost.content,
			draft: modifiedBlogPost.draft
		} = req.body);

		await PostsDAO.modifyPost(blogPostID, modifiedBlogPost);

		res.redirect('/admin/list');
	}
}

module.exports = AdminController;
