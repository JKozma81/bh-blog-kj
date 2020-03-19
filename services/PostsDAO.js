const { db_getAll, db_run, db_get } = require("./database_operations");

class PostsDAO {
  async getAllPosts() {
    try {
      const allPosts = await db_getAll(
        "SELECT title, author, content, created_at FROM posts"
      );
      return allPosts;
    } catch (err) {
      console.error(err);
    }
  }

  async addPost(postObject) {
    try {
      await db_run(
        `INSERT INTO post(title, author, content, created_at) VALUES(${postObject.title}, ${postObject.author}, ${postObject.content}, ${postObject.created_at})`
      );
      const postID = await db_get(
        `SELECT id FROM posts WHERE created_at = ${postObject.created_at}`
      );
      return postID;
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = PostsDAO;
