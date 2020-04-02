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
    const archiveConfigService = options.archiveConfigService;
    const formatDate = options.formatDate;
    const dateFormat = options.dateFormat;

    return async (req, res) => {
      let archiveMap;
      try {
        const publishedPosts = await blogPostService.getPublishedBlogposts();
        const defaultLayout = await archiveConfigService.getDefaultLayout();

        if (defaultLayout.name === 'tree') {
          if (dateFormat.format !== 'YYYY-MM-DD HH:mm:ss') {
            const archiveData = publishedPosts.map(post => {
              const tempObject = {
                ...post
              };
              tempObject.published_at = formatDate(
                post.published_at,
                'YYYY-MM-DD HH:mm:ss'
              );
              tempObject.modified_at = formatDate(
                post.modified_at,
                'YYYY-MM-DD HH:mm:ss'
              );
              tempObject.created_at = formatDate(
                post.created_at,
                'YYYY-MM-DD HH:mm:ss'
              );
              return tempObject;
            });
            archiveMap = createArchiveMap(archiveData);

            publishedPosts.forEach(post => {
              post.published_at = formatDate(
                post.published_at,
                dateFormat.format
              );
              post.modified_at = formatDate(
                post.modified_at,
                dateFormat.format
              );
              post.created_at = formatDate(post.created_at, dateFormat.format);
            });
            res.render('home', {
              siteTitle: 'Bishops First Blog',
              postList: publishedPosts,
              formatedBlogPostData: archiveMap,
              flat:
                defaultLayout.name === 'flat' ? defaultLayout.default : false,
              tree:
                defaultLayout.name === 'tree' ? defaultLayout.default : false
            });
            return;
          }

          publishedPosts.forEach(post => {
            post.published_at = formatDate(
              post.published_at,
              dateFormat.format
            );
            post.modified_at = formatDate(post.modified_at, dateFormat.format);
            post.created_at = formatDate(post.created_at, dateFormat.format);
          });
          archiveMap = createArchiveMap(publishedPosts);
          res.render('home', {
            siteTitle: 'Bishops First Blog',
            postList: publishedPosts,
            formatedBlogPostData: archiveMap,
            flat: defaultLayout.name === 'flat' ? defaultLayout.default : false,
            tree: defaultLayout.name === 'tree' ? defaultLayout.default : false
          });
          return;
        }

        publishedPosts.forEach(post => {
          post.published_at = formatDate(post.published_at, dateFormat.format);
          post.modified_at = formatDate(post.modified_at, dateFormat.format);
          post.created_at = formatDate(post.created_at, dateFormat.format);
        });

        archiveMap = '';

        res.render('home', {
          siteTitle: 'Bishops First Blog',
          postList: publishedPosts,
          formatedBlogPostData: archiveMap,
          flat: defaultLayout.name === 'flat' ? defaultLayout.default : false,
          tree: defaultLayout.name === 'tree' ? defaultLayout.default : false
        });
      } catch (err) {
        console.error(err);
      }
    };
  }

  static getSearched(options) {
    const blogPostService = options.blogPostService;
    const archiveConfigService = options.archiveConfigService;
    const dateFormat = options.dateFormat;
    const formatDate = options.formatDate;

    return async (req, res) => {
      try {
        const searchFor = req.body.search_text;
        const defaultLayout = await archiveConfigService.getDefaultLayout();
        let archiveMap;

        const publishedPosts = await blogPostService.getPublishedBlogposts();

        if (
          dateFormat.format !== 'YYYY-MM-DD HH:mm:ss' &&
          defaultLayout.name === 'tree'
        ) {
          publishedPosts.forEach(post => {
            post.published_at = formatDate(
              post.published_at,
              'YYYY-MM-DD HH:mm:ss'
            );
            post.modified_at = formatDate(
              post.modified_at,
              'YYYY-MM-DD HH:mm:ss'
            );
            post.created_at = formatDate(
              post.created_at,
              'YYYY-MM-DD HH:mm:ss'
            );
          });
          archiveMap = createArchiveMap(publishedPosts);
        } else {
          publishedPosts.forEach(post => {
            post.published_at = formatDate(
              post.published_at,
              dateFormat.format
            );
            post.modified_at = formatDate(post.modified_at, dateFormat.format);
            post.created_at = formatDate(post.created_at, dateFormat.format);
          });
          archiveMap = createArchiveMap(publishedPosts);
        }

        if (defaultLayout.name === 'flat') archiveMap = '';

        const searchResults = await blogPostService.getPostBySearchText(
          searchFor
        );

        searchResults.forEach(result => {
          result.published_at = formatDate(
            result.published_at,
            dateFormat.format
          );
          result.modified_at = formatDate(
            result.modified_at,
            dateFormat.format
          );
          result.created_at = formatDate(result.created_at, dateFormat.format);
        });

        res.render('home', {
          siteTitle: 'Bishops First Blog',
          postList: searchResults,
          formatedBlogPostData: archiveMap,
          flat: defaultLayout.name === 'flat' ? defaultLayout.default : false,
          tree: defaultLayout.name === 'tree' ? defaultLayout.default : false
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
    const formatDate = options.formatDate;
    const dateFormat = options.dateFormat;
    return async (req, res) => {
      let blogPost, oldSlug;

      if (isNaN(Number(req.params.idOrSlug))) {
        blogPost = await blogPostService.getBlogPostBySlug(req.params.idOrSlug);
        if (!blogPost) {
          oldSlug = await blogPostService.getOldSlug(req.params.idOrSlug);

          if (oldSlug) {
            const newSlug = await blogPostService.getActiveSlug(oldSlug.postId);
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

      blogPost.published_at = formatDate(
        blogPost.published_at,
        dateFormat.format
      );
      blogPost.modified_at = formatDate(
        blogPost.modified_at,
        dateFormat.format
      );
      blogPost.created_at = formatDate(blogPost.created_at, dateFormat.format);

      res.render('readPost', {
        siteTitle: 'Bishops First Blog',
        post: blogPost
      });
    };
  }
}

module.exports = PostController;
