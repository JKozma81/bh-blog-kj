const BlogPost = require('../domains/BlogPost');

class BlogPostService {
	constructor(PostRepository) {
		this.PostRepository = PostRepository;
	}

	async getBlogPostById(blogPostId) {
		return await this.PostRepository.getPostById(blogPostId);
	}

	async getBlogPostBySlug(slug) {
		return await this.PostRepository.getPostBySlug(slug);
	}

	async getAllBlogPosts() {
		return await this.PostRepository.getAllPosts();
	}

	async getPublishedBlogposts() {
		return await this.PostRepository.getAllPublishedPosts();
	}

	async saveBlogpost(blogpostData) {
		const newPost = new BlogPost(
			undefined,
			blogpostData.title,
			blogpostData.author,
			blogpostData.content,
			undefined,
			blogpostData.slug,
			blogpostData.draft,
			undefined,
			undefined,
			blogpostData.postTags
		);

		const savedPost = await this.PostRepository.savePost(newPost);

		return savedPost || undefined;
	}

	async modifyPost(blogpostData) {
		const newPostData = new BlogPost(
			blogpostData.id,
			blogpostData.title,
			undefined,
			blogpostData.content,
			undefined,
			blogpostData.slug,
			blogpostData.draft,
			undefined,
			undefined,
			blogpostData.postTags
		);

		const savedPost = await this.PostRepository.modifyPost(newPostData);
		return savedPost;
	}

	async getPostBySearchText(searchText) {
		return await this.PostRepository.getSearch(searchText);
	}

	async getOldSlug(slug) {
		return await this.PostRepository.getOldSlug(slug);
	}

	async getActiveSlug(postId) {
		return await this.PostRepository.getActiveSlug(postId);
	}

	async getTaglist() {
		return await this.PostRepository.getAllTags();
	}

	async getTag(tagName) {
		return await this.PostRepository.getTag(tagName);
	}

	async getPublishedBlogpostsByTag(postTag) {
		return await this.PostRepository.getAllPublishedPostsByTag(postTag);
	}
}

module.exports = BlogPostService;
