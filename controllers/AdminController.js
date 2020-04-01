class AdminController {
  static showDashboard(req, res) {
    const user = req.user;
    res.render('dashboard', {
      siteTitle: 'Bishops First Blog',
      submenuTitle: 'Admin Dashboard',
      username: user.username
    });
  }

  static showAdminBlogPostList(options) {
    const blogPostService = options.blogPostService;

    return async (req, res) => {
      const user = req.user;
      const blogPosts = await blogPostService.getAllBlogPosts();

      res.render('postList', {
        siteTitle: 'Bishops First Blog',
        submenuTitle: 'Admin Post List',
        username: user.username,
        blogPosts
      });
    };
  }

  static showEditBlogPost(options) {
    const blogPostService = options.blogPostService;

    return async (req, res) => {
      const user = req.user;
      const blogPostID = Number(req.params.id);
      const blogPost = await blogPostService.getBlogPostById(blogPostID);

      res.render('editPost', {
        siteTitle: 'Bishops First Blog',
        submenuTitle: 'Edit Post',
        username: user.username,
        blogPost
      });
    };
  }

  static modifyBlogPost(options) {
    const blogPostService = options.blogPostService;
    return async (req, res) => {
      const blogPostID = Number(req.params.id);
      const modifiedBlogPostData = {};
      ({
        title: modifiedBlogPostData.title,
        content: modifiedBlogPostData.content,
        slug: modifiedBlogPostData.slug,
        draft: modifiedBlogPostData.draft
      } = req.body);
      modifiedBlogPostData.id = blogPostID;

      await blogPostService.modifyPost(modifiedBlogPostData);

      res.redirect('/admin/list');
    };
  }

  static showConfigurations(options) {
    const archiveConfigService = options.archiveConfigService;
    return async (req, res) => {
      const layouts = await archiveConfigService.getAllLayouts();
      const user = req.user;
      res.render('configurations', {
        siteTitle: 'Bishops First Blog',
        submenuTitle: 'Admin Configurations',
        username: user.username,
        layouts
      });
    };
  }

  static saveConfigurations(options) {
    // const dateFormat = options.dateFormat;
    const archiveConfigService = options.archiveConfigService;
    return async (req, res) => {
      const { archive_layout, date_format } = req.body;
      console.log(req.body);
      await archiveConfigService.modifyLayout(archive_layout);

      res.redirect('/admin/config');
    };
  }
}

module.exports = AdminController;
