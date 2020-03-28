const BlogPost = require('../domains/BlogPost');

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
      undefined
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
      undefined
    );

    const savedPost = await this.PostRepository.modifyPost(newPostData);
  }
}

module.exports = BlogPostService;
