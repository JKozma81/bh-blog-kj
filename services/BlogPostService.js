class BlogPostService {
  constructor(PostRepository) {
    this.PostRepository = PostRepository;
  }

  async getSelectedBlogPost(blogPostIdentifier) {
    return await this.PostRepository.getPost(blogPostIdentifier);
  }

  async getAllBlogPosts() {
    return await this.PostRepository.getAllPosts();
  }

  async getBlogPostsForHomePage() {
    const publishedPosts = await this.PostRepository.getAllPublishedPosts();
    const archiveMap = await this.PostRepository.getArchiveMap();

    return {
      publishedPosts,
      archiveMap
    };
  }
}

module.exports = BlogPostService;
