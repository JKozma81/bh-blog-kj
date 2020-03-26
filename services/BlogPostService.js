class BlogPostService {
	constructor(blogPostClass, PostsDao) {
		this.PostsDao = PostsDao;
		this.blogPostClass = blogPostClass;
		this.blogPosts = [];
	}

	createBlogPost(blogPostDataObject) {
		return new this.blogPostClass(
			blogPostDataObject.id,
			blogPostDataObject.title,
			blogPostDataObject.author,
			blogPostDataObject.content,
			blogPostDataObject.created_at,
			blogPostDataObject.slug,
			blogPostDataObject.draft,
			blogPostDataObject.published_at,
			blogPostDataObject.modified_at
		);
	}

	createBlogPosts(postsData) {
		postsData.forEach(postData => {
			const post = this.createBlogPost(postData);
			this.blogPosts.push(post);
			return this.blogPosts;
		});
	}

	async getDesiredBlogPost(searchParameter) {
		const postObject = this.createBlogPost(
			await this.PostsDao.getPost(searchParameter)
		);
		return postObject;
	}

	async getAllBlogPosts() {
		const postObjects = this.createBlogPosts(
			await this.PostsDao.getAllPosts()
		);
		return postObjects;
	}
}

module.exports = BlogPostService;
