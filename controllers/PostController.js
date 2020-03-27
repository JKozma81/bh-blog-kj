class PostController {
  static showHome(options) {
    const blogPostService = options.blogPostService;

    return async (req, res) => {
      try {
        const {
          publishedPosts,
          archiveMap
        } = await blogPostService.getBlogPostsForHomePage();

        res.render('home', {
          siteTitle: 'Bishops First Blog',
          postList: publishedPosts,
          formatedBlogPostData: archiveMap.mapObject
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
        res.redirect(`/posts?error=title&content=${content}&slug=${slug}`);
        return;
      }
      if (!content) {
        res.redirect(`/posts?error=content&title=${title}&slug=${slug}`);
        return;
      }
      if (!slug) {
        res.redirect(`/posts?error=content&title=${title}&content=${content}`);
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
      const searchParameter = Number(req.params.idOrSlug);

      const blogPost = await blogPostService.getSelectedBlogPost(
        isNaN(searchParameter) ? req.params.idOrSlug : searchParameter
      );

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
