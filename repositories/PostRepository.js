class PostRepository {
  constructor(DBAdapter, BlogPost, ArchiveMap) {
    this.DBAdapter = DBAdapter;
    this.BlogPost = BlogPost;
    this.ArchiveMap = ArchiveMap;
  }

  async getAllPosts() {
    try {
      const blogPostsData = await this.DBAdapter.getAll(
        'SELECT id, title, author, content, created_at, slug, draft, published_at, modified_at FROM posts'
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
            postData.published_at ? postData.published_at : 'N/A',
            postData.modified_at
          )
      );

      return results;
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

  async savePost(postObject) {
    try {
      postObject.draft = this.DBAdapter.formatDBBoolSpecifics(postObject.draft);
      postObject.content = this.DBAdapter.formatDBStringSpecifics(
        postObject.content
      );

      let publishDateSQLparam = ', NULL';
      if (!postObject.draft) {
        publishDateSQLparam = ", datetime('now', 'localtime')";
      }

      await this.DBAdapter.run(
        `INSERT
      	 INTO
      		posts(title, author, content, created_at, slug, draft, published_at, modified_at)
      	 VALUES("${postObject.title}",
      			"${postObject.author}",
      			"${postObject.content}",
      			datetime("now", "localtime"),
      			"${postObject.slug}",
      			 ${postObject.draft}
      			 ${publishDateSQLparam}
      			${', datetime("now", "localtime")'}
                )`
      );

      const savedPostData = await this.DBAdapter.get(`
        SELECT
          id,
          title,
          author,
          content,
          created_at,
          slug
        FROM
          posts
        WHERE
          title = "${postObject.title}" AND author = "${postObject.author}"
      `);

      return new this.BlogPost(
        savedPostData.id,
        savedPostData.title,
        savedPostData.author,
        savedPostData.content,
        savedPostData.created_at,
        savedPostData.slug,
        undefined,
        undefined,
        undefined
      );
    } catch (err) {
      console.error(err);
    }
  }

  async getPost(searchParameter) {
    try {
      let postData;

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
        postData = await this.DBAdapter.get(sqlQueryString);

        if (!postData) {
          return undefined;
        }

        return new this.BlogPost(
          postData.id,
          postData.title,
          postData.author,
          postData.content,
          postData.created_at,
          postData.slug,
          undefined,
          undefined,
          undefined
        );
      }

      if (typeof searchParameter === 'string') {
        const sqlQueryString =
          coreSqlQuery + `WHERE slug = "${searchParameter}"`;
        postData = await this.DBAdapter.get(sqlQueryString);

        if (!postData) {
          return undefined;
        }

        return new this.BlogPost(
          postData.id,
          postData.title,
          postData.author,
          postData.content,
          postData.created_at,
          postData.slug,
          undefined,
          undefined,
          undefined
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  async modifyPost(postObject) {
    try {
      const postDataToUpdate = await this.getPost(postObject.id);
      const formatedPostObject = this.DBAdapter.format(postObject);

      await this.DBAdapter.run(
        `UPDATE
					posts
         SET
         ${
           formatedPostObject.title !== postDataToUpdate.title
             ? 'title = "' + formatedPostObject.title + '",'
             : ''
         }
         ${
           formatedPostObject.content !== postDataToUpdate.content
             ? 'content = "' + formatedPostObject.content + '",'
             : ''
         }
         ${
           formatedPostObject.slug !== postDataToUpdate.slug
             ? 'slug = "' + formatedPostObject.slug + '",'
             : ''
         }
         ${
           formatedPostObject.draft !== postDataToUpdate.draft
             ? 'draft = ' + formatedPostObject.draft + ','
             : ''
         }
					${
            formatedPostObject.draft === 1
              ? ' published_at = NULL, modified_at = datetime("now", "localtime")'
              : ' published_at = datetime("now", "localtime"), modified_at = datetime("now", "localtime")'
          }
				WHERE
					id = ${postObject.id}`
      );

      const updatedPostData = await this.getPost(postObject.id);

      return new this.BlogPost(
        updatedPostData.id,
        updatedPostData.title,
        updatedPostData.author,
        updatedPostData.content,
        updatedPostData.created_at,
        updatedPostData.slug,
        undefined,
        undefined,
        undefined
      );
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = PostRepository;
