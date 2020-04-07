const fs = require('fs');
const { DBPath } = require('../configs/config.json');
const { initDBConnection } = require('../repositories/DatabaseAdapter');

class AdminController {
  static showDashboard(req, res) {
    const user = req.user;
    res.render('dashboard', {
      siteTitle: 'Bishops First Blog',
      submenuTitle: 'Admin Dashboard',
      username: user.username,
    });
  }

  static showAdminBlogPostList(options) {
    const blogPostService = options.blogPostService;
    const configurations = options.configurations;
    const formatDate = options.formatDate;

    return async (req, res) => {
      try {
        const user = req.user;
        if (!configurations['db-file']) {
          res.render('postList', {
            siteTitle: 'Bishops First Blog',
            submenuTitle: 'Admin Post List',
            error:
              'No Database file provided. Please provide a valid file to continue...',
            username: user.username,
            blogPosts: '',
          });
          return;
        }

        const blogPosts = await blogPostService.getAllBlogPosts();

        blogPosts.forEach((post) => {
          post.published_at =
            post.published_at === 'N/A'
              ? post.published_at
              : formatDate(post.published_at, configurations.dateFormat);
          post.modified_at = formatDate(
            post.modified_at,
            configurations.dateFormat
          );
          post.created_at = formatDate(
            post.created_at,
            configurations.dateFormat
          );
        });

        res.render('postList', {
          siteTitle: 'Bishops First Blog',
          submenuTitle: 'Admin Post List',
          username: user.username,
          blogPosts,
        });
      } catch (err) {
        console.error(err);
      }
    };
  }

  static showEditBlogPost(options) {
    const blogPostService = options.blogPostService;
    const configurations = options.configurations;
    const formatDate = options.formatDate;

    return async (req, res) => {
      const user = req.user;
      const blogPostID = Number(req.params.id);
      const blogPost = await blogPostService.getBlogPostById(blogPostID);

      blogPost.published_at = formatDate(
        blogPost.published_at,
        configurations.dateFormat
      );
      blogPost.modified_at = formatDate(
        blogPost.modified_at,
        configurations.dateFormat
      );
      blogPost.created_at = formatDate(
        blogPost.created_at,
        configurations.dateFormat
      );

      res.render('editPost', {
        siteTitle: 'Bishops First Blog',
        submenuTitle: 'Edit Post',
        username: user.username,
        blogPost,
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
        draft: modifiedBlogPostData.draft,
      } = req.body);
      modifiedBlogPostData.id = blogPostID;

      await blogPostService.modifyPost(modifiedBlogPostData);

      res.redirect('/admin/list');
    };
  }

  static showConfigurations(options) {
    const archiveConfigService = options.archiveConfigService;
    const configurations = options.configurations;
    return async (req, res) => {
      let layouts;
      if (configurations['db-file']) {
        layouts = await archiveConfigService.getAllLayouts();
      }
      const user = req.user;
      res.render('configurations', {
        siteTitle: 'Bishops First Blog',
        submenuTitle: 'Admin Configurations',
        username: user.username,
        layouts,
        dateFormat: configurations.dateFormat,
        dbFile: configurations['db-file'],
      });
    };
  }

  static saveConfigurations(options) {
    const configurations = options.configurations;
    const archiveConfigService = options.archiveConfigService;
    return async (req, res) => {
      const { archive_layout, date_format, database_file } = req.body;

      configurations.dateFormat = date_format
        ? date_format
        : configurations.dateFormat;

      configurations['db-file'] = fs.existsSync(DBPath + database_file)
        ? database_file
        : '';

      if (archive_layout) {
        await archiveConfigService.modifyLayout(archive_layout);
      }

      res.redirect('/admin');
    };
  }
}

module.exports = AdminController;
