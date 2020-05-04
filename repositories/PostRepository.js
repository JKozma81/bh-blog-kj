const BlogPost = require('../domains/BlogPost');

class PostRepository {
	constructor(DBAdapter) {
		this.DBAdapter = DBAdapter;
	}

	async getAllPosts() {
		try {
			const blogPostsData = await this.DBAdapter().getAll(
				`SELECT
          posts.id,
          posts.title,
          posts.author,
          posts.content,
          posts.created_at,
          posts.draft,
          posts.published_at,
          posts.modified_at,
          slugs.slug_value
        FROM
          posts
        JOIN slugs
        ON 
          slugs.post_id = posts.id
        WHERE
					slugs.is_active = 1
				ORDER BY posts.id
        `
			);

			const results = blogPostsData.map(
				(postData) =>
					new BlogPost(
						postData.id,
						postData.title,
						postData.author,
						postData.content,
						postData.created_at,
						postData.slug_value,
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
			const blogPostsData = await this.DBAdapter().getAll(
				`SELECT
          posts.id,
          posts.title,
          posts.author,
          posts.content,
          posts.created_at,
          posts.draft,
          posts.published_at,
          posts.modified_at,
          slugs.slug_value
				FROM
          posts
        JOIN
          slugs
        ON
          slugs.post_id = posts.id
        WHERE
          slugs.is_active = 1
        AND
					posts.published_at IS NOT NULL
				ORDER BY posts.published_at DESC
			`
			);

			const results = blogPostsData.map(
				(postData) =>
					new BlogPost(
						postData.id,
						postData.title,
						postData.author,
						postData.content,
						postData.created_at,
						postData.slug_value,
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
			postObject.draft = this.DBAdapter().formatDBBoolSpecifics(
				postObject.draft
			);

			await this.DBAdapter().runAsync(
				`
          INSERT INTO
            posts(title, author, content, created_at, draft, published_at, modified_at)
          VALUES(?, ?, ?, strftime("%s", "now"), ?, ${
				postObject.draft ? 'null' : 'strftime("%s", "now")'
			}, strftime("%s", "now"))
          `,

				postObject.title,
				postObject.author,
				postObject.content,
				postObject.draft
			);

			const postID = await this.DBAdapter().get(
				`
          SELECT id FROM posts WHERE title = ? AND author = ?
          `,
				[postObject.title, postObject.author]
			);

			for (const tag of postObject.tags) {
				await this.DBAdapter().run(
					'INSERT INTO tags(tag_name, post_id) VALUES(?,?)',
					[tag, postID.id]
				);
			}

			await this.DBAdapter().run(
				`
        INSERT INTO slugs(slug_value, post_id, is_active) VALUES(?, ?, ?)
        `,
				[postObject.slug, postID.id, 1]
			);

			const savedPostData = await this.DBAdapter().get(
				`
        SELECT
          posts.id,
          posts.title,
          posts.author,
          posts.content,
          posts.created_at,
          GROUP_CONCAT(tags.tag_name, ',') AS tags
        FROM
          posts
        JOIN
          tags
        ON
          tags.post_id = posts.id    
        WHERE
          posts.title = ? AND posts.author = ?
      `,
				[postObject.title, postObject.author]
			);

			return new BlogPost(
				savedPostData.id,
				savedPostData.title,
				savedPostData.author,
				savedPostData.content,
				savedPostData.created_at,
				undefined,
				undefined,
				undefined,
				undefined,
				savedPostData.tags
			);
		} catch (err) {
			console.error(err);
		}
	}

	async getPostById(postId) {
		try {
			const postData = await this.DBAdapter().get(
				`
        SELECT
          posts.id,
          posts.title,
          posts.author,
          posts.content,
          posts.created_at,
          posts.draft,
          posts.published_at,
          posts.modified_at,
          slugs.slug_value,
          GROUP_CONCAT(tags.tag_name, ',') AS tags
        FROM
          posts
        JOIN
          slugs
        ON
          slugs.post_id = posts.id
        JOIN
          tags
        ON
          posts.id = tags.post_id
        WHERE
          posts.id = ?
        AND
          slugs.is_active = 1
      `,
				[postId]
			);

			if (!postData) {
				return undefined;
			}

			return new BlogPost(
				postData.id,
				postData.title,
				postData.author,
				postData.content,
				postData.created_at,
				postData.slug_value,
				undefined,
				undefined,
				postData.modified_at,
				postData.tags
			);
		} catch (err) {
			console.error(err);
		}
	}

	async getPostBySlug(slug) {
		try {
			const postData = await this.DBAdapter().get(
				`
        SELECT
          posts.id,
          posts.title,
          posts.author,
          posts.content,
          posts.created_at,
          posts.draft,
          posts.published_at,
          posts.modified_at,
          slugs.slug_value
        FROM
          posts
        JOIN
          slugs
        ON
          slugs.post_id = posts.id
        WHERE
          slugs.slug_value = ?
        AND
          slugs.is_active = 1
      `,
				[slug]
			);

			if (!postData) {
				return undefined;
			}

			return new BlogPost(
				postData.id,
				postData.title,
				postData.author,
				postData.content,
				postData.created_at,
				postData.slug_value,
				undefined,
				undefined,
				undefined
			);
		} catch (err) {
			console.error(err);
		}
	}

	async getOldSlug(slug) {
		try {
			const oldSlug = await this.DBAdapter().get(
				`
        SELECT post_id, slug_value FROM slugs WHERE slug_value = ? AND is_active = 0
      `,
				[slug]
			);

			const result = oldSlug
				? {
						postId: oldSlug.post_id,
						oldSlug: oldSlug.slug_value,
				  }
				: oldSlug;
			return result;
		} catch (err) {
			console.error(err);
		}
	}

	async getActiveSlug(postId) {
		try {
			const activeSlug = await this.DBAdapter().get(
				`
        SELECT slug_value FROM slugs WHERE post_id = ? AND is_active = 1
      `,
				[postId]
			);
			return {
				value: activeSlug.slug_value,
			};
		} catch (err) {
			console.error(err);
		}
	}

	async modifyPost(postObject) {
		try {
			postObject.draft = await this.DBAdapter().formatDBBoolSpecifics(
				postObject.draft
			);
			try {
				await this.DBAdapter().runBatchAsync([
					[
						`UPDATE posts SET title = ?, content = ?, draft = ?, modified_at = strftime("%s","now"), published_at = ${
							postObject.draft ? 'NULL' : 'strftime("%s","now")'
						} WHERE id = ?`,
						postObject.title,
						postObject.content,
						postObject.draft,
						postObject.id,
					],

					[
						`UPDATE slugs SET is_active = 0 WHERE post_id = ?`,
						postObject.id,
					],

					[
						`INSERT INTO slugs(slug_value, post_id, is_active) VALUES(?, ?, ?)`,
						postObject.slug,
						postObject.id,
						1,
					],
				]);

				await this.DBAdapter().run(
					'DELETE FROM tags WHERE post_id = ?',
					[postObject.id]
				);

				for (const tag of postObject.tags) {
					await this.DBAdapter().run(
						'INSERT INTO tags(tag_name, post_id) VALUES(?,?)',
						[tag, postObject.id]
					);
				}
			} catch (err) {
				console.error(err);
			}

			const updatedPostData = await this.getPostById(postObject.id);

			return new BlogPost(
				updatedPostData.id,
				updatedPostData.title,
				updatedPostData.author,
				updatedPostData.content,
				updatedPostData.created_at,
				undefined,
				undefined,
				undefined,
				undefined,
				updatedPostData.tags
			);
		} catch (err) {
			console.error(err);
		}
	}

	async getSearch(searchText) {
		try {
			const searchFor = `%${searchText}%`;
			const searchResults = await this.DBAdapter().getAll(
				`
        SELECT
        DISTINCT
          id,
          title,
          author,
          content,
          created_at,
          draft,
          published_at,
          modified_at
        FROM
          posts
        WHERE
          published_at IS NOT NULL
        AND 
          title LIKE ?
        OR
          content LIKE ?
        ORDER BY published_at DESC
      `,
				[searchFor, searchFor]
			);

			return searchResults.map((result) => {
				return new BlogPost(
					result.id,
					result.title,
					result.author,
					result.content,
					result.created_at,
					undefined,
					undefined,
					result.published_at,
					result.modified_at
				);
			});
		} catch (err) {
			console.error(err);
		}
	}

	async getAllTags() {
		try {
			const tags = await this.DBAdapter().getAll(
				`
        SELECT DISTINCT tag_name FROM tags
      `
			);

			const results = tags.map((tag) => tag.tag_name);

			return results;
		} catch (err) {
			console.error(err);
		}
	}

	async getTag(tagName) {
		try {
			const tag = await this.DBAdapter().get(
				`
        SELECT DISTINCT tag_name FROM tags WHERE tag_name = ?
      `,
				[tagName]
			);

			const result = tag ? tag.tag_name : undefined;

			return result;
		} catch (err) {
			console.error(err);
		}
	}

	async getAllPublishedPostsByTag(postTag) {
		try {
			const blogPostsData = await this.DBAdapter().getAll(
				`SELECT
          posts.id,
          posts.title,
          posts.author,
          posts.content,
          posts.created_at,
          posts.draft,
          posts.published_at,
          posts.modified_at,
          slugs.slug_value
				FROM
          posts
        JOIN
          slugs
        ON
          slugs.post_id = posts.id
        JOIN
          tags
        ON
          tags.post_id = posts.id
        WHERE
          slugs.is_active = 1
        AND
          posts.published_at IS NOT NULL
        AND
          tags.tag_name = ?
				ORDER BY posts.published_at DESC
      `,
				[postTag]
			);

			const results = blogPostsData.map(
				(postData) =>
					new BlogPost(
						postData.id,
						postData.title,
						postData.author,
						postData.content,
						postData.created_at,
						postData.slug_value,
						postData.draft === 1 ? true : false,
						postData.published_at,
						postData.modified_at,
						postData.tags
					)
			);

			return results;
		} catch (err) {
			console.error(err);
		}
	}
}

module.exports = PostRepository;
