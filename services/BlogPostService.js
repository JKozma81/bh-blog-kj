class BlogPostService {
  constructor(PostRepository) {
    this.PostRepository = PostRepository;
  }

  async getDesiredBlogPost(blogPostIdentifier) {
    return await this.PostRepository.getPost(blogPostIdentifier);
  }

  async getAllBlogPosts() {}

  async getBlogPostsForHomePage() {
    const publishedPosts = await this.PostRepository.getAllPublishedPosts();
    const archiveMap = await this.PostRepository.getArchiveMap();

    return {
      publishedPosts,
      archiveMap
    };
  }

  async getBlogPostsDataForArchive() {}
}

module.exports = BlogPostService;
