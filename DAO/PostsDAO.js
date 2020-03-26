const DB = require('../services/DatabaseService');

class PostsDAO {
	static async getAllPosts() {
		try {
			const blogPosts = await DB.getAll(
				'SELECT id, title, author, content, created_at, slug, draft, published_at, modified_at FROM posts'
			);
			return blogPosts;
		} catch (err) {
			console.error(err);
		}
	}

	static async getAllPublishedPosts() {
		try {
			const blogPosts = await DB.getAll(
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
			return blogPosts;
		} catch (err) {
			console.error(err);
		}
	}

	static async getPublishedPostSortedByDate() {
		try {
			const blogPosts = await DB.getAll(
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
					published_at IS NOT NULL
				 ORDER BY published_at
				`
			);
			return blogPosts;
		} catch (err) {
			console.error(err);
		}
	}

	static async addPost(postObject) {
		try {
			await DB.run(
				`INSERT
				 INTO
					posts(title, author, content, created_at, slug, draft, published_at, modified_at)
				 VALUES("${postObject.title}",
						"${postObject.author}",
						"${postObject.content}",
						datetime("now", "localtime"),
						"${postObject.slug}"
						 ${postObject.draft === 'true' ? ', 1' : ', 0'}
						 ${postObject.draft === 'false' ? ", datetime('now', 'localtime')" : ', NULL'}
						${', datetime("now", "localtime")'}
                )`
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

			if (typeof searchParameter === 'number') {
				const sqlQueryString =
					coreSqlQuery + `WHERE id = ${searchParameter}`;
				post = await DB.get(sqlQueryString);
				return post;
			}

			if (typeof searchParameter === 'string') {
				const sqlQueryString =
					coreSqlQuery + `WHERE slug = "${searchParameter}"`;
				post = await DB.get(sqlQueryString);
				return post;
			}
		} catch (err) {
			console.error(err);
		}
	}

	static async modifyPost(postID, postObject) {
		try {
			await DB.run(
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

module.exports = PostsDAO;
