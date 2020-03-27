class BlogPostService {
  constructor(PostRepository, BlogPost) {
    this.PostRepository = PostRepository;
    this.BlogPost = BlogPost;
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

  async saveBlogpost(blogpostData) {
    const newPost = new this.BlogPost(
      undefined,
      blogpostData.title,
      blogpostData.author,
      blogpostData.content,
      undefined,
      blogpostData.slug,
      blogpostData.draft,
      undefined,
      undefined
    );

    const savedPost = await this.PostRepository.savePost(newPost);

    return savedPost || undefined;
  }
}

module.exports = BlogPostService;
