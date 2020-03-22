const { db_getAll, db_run, db_get } = require("./database_operations");

class PostsDAO {
  static async getAllPosts() {
    try {
      const blogPosts = await db_getAll(
        "SELECT id, title, author, content, created_at, slug FROM posts"
      );
      return blogPosts;
    } catch (err) {
      console.error(err);
    }
  }

  static async addPost(postObject) {
    try {
      await db_run(
        `INSERT
         INTO
          posts(title, author, content, created_at, slug)
         VALUES("${postObject.title}", "${postObject.author}", "${postObject.content}", "${postObject.created_at}", "${postObject.slug}")`
      );

      const postID = await db_get(
        `SELECT id FROM posts WHERE created_at = "${postObject.created_at}"`
      );
    } catch (err) {
      console.error(err);
    }
  }

  static async getPost(searchParameter) {
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

      if (typeof searchParameter === "number") {
        const sqlQueryString = coreSqlQuery + `WHERE id = ${searchParameter}`;
        post = await db_get(sqlQueryString);
        return post;
      }

      if (typeof searchParameter === "string") {
        const sqlQueryString =
          coreSqlQuery + `WHERE slug = "${searchParameter}"`;
        post = await db_get(sqlQueryString);
        return post;
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async modifyPost(postID, postObject) {
    try {
      await db_run(
        `UPDATE
          posts
         SET
          title = "${postObject.title}",
          slug = "${postObject.slug}",
          content = "${postObject.content}"
         WHERE
          id = ${postID}`
      );
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = PostsDAO;
