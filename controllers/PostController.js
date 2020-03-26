class PostController {
  static showHome(options) {
    const BlogPostService = options.blogPostService;

    return async (req, res) => {
      try {
        const publishedPosts = await BlogPostService.getAllPublishedBlogPosts();
        const formatedPostsData = await BlogPostService.getBlogPostsDataForArchive();

        res.render('home', {
          siteTitle: 'Bishops First Blog',
          postList: publishedPosts,
          formatedBlogPostData: formatedPostsData
        });
      } catch (err) {
        console.error(err);
      }
    };
  }

  // static get(req, res) {
  // 	const user = req.user;
  // 	let postError = req.query.error
  // 		? MessageProviderService.getMessage(req.query.error)
  // 		: '';

  // 	res.render('newPost', {
  // 		siteTitle: 'Bishops First Blog',
  // 		submenuTitle: 'New Post',
  // 		username: user.username,
  // 		postError,
  // 		title: req.query.title ? req.query.title : '',
  // 		content: req.query.content ? req.query.content : '',
  // 		slug: req.query.slug ? req.query.slug : ''
  // 	});
  // }

  // static async post(req, res) {
  // 	let { title, content, slug, draft } = req.body;

  // 	content = content.split('"').join("'");

  // 	if (!title && !content && !slug) {
  // 		res.redirect('/posts?error=title-content-slug');
  // 		return;
  // 	}
  // 	if (!title && !slug) {
  // 		res.redirect(`/posts?error=title-and-slug&content=${content}`);
  // 		return;
  // 	}
  // 	if (!slug && !content) {
  // 		res.redirect(`/posts?error=content-and-slug&title=${title}`);
  // 		return;
  // 	}
  // 	if (!title) {
  // 		res.redirect(`/posts?error=title&content=${content}&slug=${slug}`);
  // 		return;
  // 	}
  // 	if (!content) {
  // 		res.redirect(`/posts?error=content&title=${title}&slug=${slug}`);
  // 		return;
  // 	}
  // 	if (!slug) {
  // 		res.redirect(
  // 			`/posts?error=content&title=${title}&content=${content}`
  // 		);
  // 		return;
  // 	}

  // 	const SID = Number(req.cookies[CookieService.getCookie()]);
  // 	const user = SessionServices.getSession(SID).user;

  // 	const newPost = {
  // 		title,
  // 		author: user.username,
  // 		content,
  // 		slug,
  // 		draft
  // 	};
  // 	await PostsDAO.addPost(newPost);
  // 	res.redirect('/admin');
  // }

  // static async showBlogPost(req, res) {
  // 	const searchParameter = Number(req.params.idOrSlug);

  // 	const blogPost = await PostsDAO.getPost(
  // 		isNaN(searchParameter) ? req.params.idOrSlug : searchParameter
  // 	);

  // 	if (!blogPost) {
  // 		res.render('custom404', {
  // 			siteTitle: 'Bishops First Blog'
  // 		});
  // 		return;
  // 	}

  // 	res.render('readPost', {
  // 		siteTitle: 'Bishops First Blog',
  // 		post: blogPost
  // 	});
  // }
}

module.exports = PostController;
