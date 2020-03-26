class PostRepository {
  constructor(DBAdapter, BlogPost, ArchiveMap) {
    this.DBAdapter = DBAdapter;
    this.BlogPost = BlogPost;
    this.ArchiveMap = ArchiveMap;
  }

  async getAllPosts() {
    try {
      const blogPosts = await this.DBAdapter.getAll(
        'SELECT id, title, author, content, created_at, slug, draft, published_at, modified_at FROM posts'
      );
      return blogPosts;
    } catch (err) {
      console.error(err);
    }
  }

  async getAllPublishedPosts() {
    try {
      const blogPostsData = await this.DBAdapter.getAll(
        `SELECT
					id,
					title,
					author,
					content,
					created_at,
					slug,
					draft,
					published_at,
					modified_at
					FROM
					posts
					WHERE
					published_at IS NOT NULL`
      );

      const results = blogPostsData.map(
        postData =>
          new this.BlogPost(
            postData.id,
            postData.title,
            postData.author,
            postData.content,
            postData.created_at,
            postData.slug,
            postData.draft === 1 ? true : false,
            postData.published_at,
            postData.modified_at
          )
      );

      return results;
    } catch (err) {
      console.error(err);
    }
  }

  async getArchiveMap() {
    try {
      const mapData = await this.DBAdapter.getAll(
        `SELECT
					id,
					title,
					published_at
				 FROM
					posts
				 WHERE
					published_at IS NOT NULL
				 ORDER BY published_at
				`
      );

      const formatedBlogPostData = {};

      mapData.forEach(blogPost => {
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

      return new this.ArchiveMap(formatedBlogPostData);
    } catch (err) {
      console.error(err);
    }
  }

  async addPost(postObject) {
    try {
      await this.DBAdapter.run(
        `INSERT
				 INTO
					posts(title, author, content, created_at, slug, draft, published_at, modified_at)
				 VALUES("${postObject.title}",
						"${postObject.author}",
						"${postObject.content}",
						datetime("now", "localtime"),
						"${postObject.slug}"
						 ${postObject.draft}
						 ${postObject.draft === 'false' ? ", datetime('now', 'localtime')" : ', NULL'}
						${', datetime("now", "localtime")'}
                )`
      );
    } catch (err) {
      console.error(err);
    }
  }

  async getPost(searchParameter) {
    try {
      let post;

      const coreSqlQuery = `
				SELECT 
					id,
					title,
					author,
					content,
					created_at,
					slug
					FROM
					posts
				`;

      if (typeof searchParameter === 'number') {
        const sqlQueryString = coreSqlQuery + `WHERE id = ${searchParameter}`;
        post = await this.DBAdapter.get(sqlQueryString);
        return post;
      }

      if (typeof searchParameter === 'string') {
        const sqlQueryString =
          coreSqlQuery + `WHERE slug = "${searchParameter}"`;
        post = await this.DBAdapter.get(sqlQueryString);
        return post;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async modifyPost(postID, postObject) {
    try {
      await this.DBAdapter.run(
        `UPDATE
					posts
				 SET
					title = "${postObject.title}",
					slug = "${postObject.slug}",
					content = "${postObject.content}"
					${
            postObject.draft === 'true'
              ? ', published_at = NULL, modified_at = datetime("now", "localtime")'
              : ', published_at = datetime("now", "localtime"), modified_at = datetime("now", "localtime")'
          }
				WHERE
					id = ${postID}`
      );
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = PostRepository;
