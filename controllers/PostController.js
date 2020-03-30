function createArchiveMap(data) {
	const formatedBlogPostData = {};

	data.forEach(blogPost => {
		let fullDate = blogPost.published_at.split(' ')[0].split('-');
		fullDate = fullDate.map(element => (element = Number(element)));
		fullDate[1] -= 1;
		let date = new Date(...fullDate);
		let year = date.getFullYear();
		let month = date.toLocaleString('en-US', { month: 'long' });

		if (!formatedBlogPostData.hasOwnProperty(year)) {
			formatedBlogPostData[year] = {};
		}

		if (!formatedBlogPostData[year].hasOwnProperty(month)) {
			formatedBlogPostData[year][month] = [];
		}

		formatedBlogPostData[year][month].push({
			id: blogPost.id,
			title: blogPost.title
		});
	});

	return formatedBlogPostData;
}

class PostController {
	static showHome(options) {
		const blogPostService = options.blogPostService;

		return async (req, res) => {
			try {
				const publishedPosts = await blogPostService.getPublishedBlogposts();
				const archiveMap = createArchiveMap(publishedPosts);

				res.render('home', {
					siteTitle: 'Bishops First Blog',
					postList: publishedPosts,
					formatedBlogPostData: archiveMap
				});
			} catch (err) {
				console.error(err);
			}
		};
	}

	static getSearched(options) {
		const blogPostService = options.blogPostService;

		return async (req, res) => {
			try {
				const searchFor = req.body.search_text;

				const publishedPosts = await blogPostService.getPublishedBlogposts();
				const searchResults = await blogPostService.getPostBySearchText(
					searchFor
				);
				const archiveMap = createArchiveMap(publishedPosts);

				res.render('home', {
					siteTitle: 'Bishops First Blog',
					postList: searchResults,
					formatedBlogPostData: archiveMap
				});
			} catch (err) {
				console.error(err);
			}
		};
	}

	static showNewPost(options) {
		const messageProvider = options.messageProviderService;
		return async (req, res) => {
			const user = req.user;
			let postError = req.query.error
				? messageProvider.getMessage(req.query.error)
				: '';

			res.render('newPost', {
				siteTitle: 'Bishops First Blog',
				submenuTitle: 'New Post',
				username: user.username,
				postError,
				title: req.query.title ? req.query.title : '',
				content: req.query.content ? req.query.content : '',
				slug: req.query.slug ? req.query.slug : ''
			});
		};
	}

	static receiveBlogPostDataAndSave(options) {
		const authCookie = options.authCookie;
		const sessionService = options.sessionService;
		const blogPostService = options.blogPostService;
		return async (req, res) => {
			let { title, content, slug, draft } = req.body;

			if (!title && !content && !slug) {
				res.redirect('/posts?error=title-content-slug');
				return;
			}
			if (!title && !slug) {
				res.redirect(`/posts?error=title-and-slug&content=${content}`);
				return;
			}
			if (!slug && !content) {
				res.redirect(`/posts?error=content-and-slug&title=${title}`);
				return;
			}
			if (!title) {
				res.redirect(
					`/posts?error=title&content=${content}&slug=${slug}`
				);
				return;
			}
			if (!content) {
				res.redirect(
					`/posts?error=content&title=${title}&slug=${slug}`
				);
				return;
			}
			if (!slug) {
				res.redirect(
					`/posts?error=content&title=${title}&content=${content}`
				);
				return;
			}

			const SID = Number(req.cookies[authCookie]);
			const user = sessionService.getSession(SID).user;

			const newPostData = {
				title,
				author: user.username,
				content,
				slug,
				draft
			};
			const newBlogPost = await blogPostService.saveBlogpost(newPostData);

			if (!newBlogPost) {
				throw new Error("Can't save blogpost!");
			}

			res.redirect('/admin');
		};
	}

	static showBlogPost(options) {
		const blogPostService = options.blogPostService;
		return async (req, res) => {
			let blogPost, oldSlug;

			if (isNaN(Number(req.params.idOrSlug))) {
				blogPost = await blogPostService.getBlogPostBySlug(
					req.params.idOrSlug
				);
				if (!blogPost) {
					oldSlug = await blogPostService.getOldSlug(
						req.params.idOrSlug
					);

					if (oldSlug) {
						const newSlug = await blogPostService.getActiveSlug(
							oldSlug.postId
						);
						res.redirect(`/posts/${newSlug.value}`);
						return;
					}
				}
			} else {
				blogPost = await blogPostService.getBlogPostById(
					Number(req.params.idOrSlug)
				);
			}

			if (!blogPost) {
				res.render('custom404', {
					siteTitle: 'Bishops First Blog'
				});
				return;
			}

			res.render('readPost', {
				siteTitle: 'Bishops First Blog',
				post: blogPost
			});
		};
	}
}

module.exports = PostController;
