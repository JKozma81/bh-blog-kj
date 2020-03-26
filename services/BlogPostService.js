class BlogPostService {
  constructor(blogPostClass, PostRepository) {
    this.PostRepository = PostRepository;
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

  async createBlogPosts(postsData) {
    await postsData.forEach(async postData => {
      const post = await this.createBlogPost(postData);
      this.blogPosts.push(post);
    });
    return this.blogPosts;
  }

  async getDesiredBlogPost(searchParameter) {
    const postObject = this.createBlogPost(
      await this.PostRepository.getPost(searchParameter)
    );
    return postObject;
  }

  async getAllBlogPosts() {
    const postObjects = this.createBlogPosts(
      await this.PostRepository.getAllPosts()
    );
    return postObjects;
  }

  async getAllPublishedBlogPosts() {
    const pulishedPosts = await this.PostRepository.getAllPublishedPosts();
    const postObjects = this.createBlogPosts(pulishedPosts);
    return postObjects;
  }

  async getBlogPostsDataForArchive() {
    const publishedPostsData = await this.PostRepository.getPublishedPostDataForArchive();
    return publishedPostsData;
  }
}

module.exports = BlogPostService;
