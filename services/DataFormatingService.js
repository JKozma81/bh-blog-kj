class DataFormatingService {
  formatDataForAdminList(data) {
    const formatedBlogPostData = data.map(blogpostData => {
      const tempObject = {};
      ({
        id: tempObject.id,
        title: tempObject.title,
        author: tempObject.author,
        content: tempObject.content,
        created_at: tempObject.created_at,
        slug: tempObject.slug,
        draft: tempObject.draft,
        modified_at: tempObject.modified_at
      } = blogpostData);

      tempObject.published_at = blogpostData.published_at
        ? blogpostData.published_at
        : 'N/A';

      return tempObject;
    });
    return formatedBlogPostData;
  }

  formatDataToDBInsertion(data) {
    const formatedBlogPostData = data.map(blogpostData => {
      const tempObject = {};
      ({
        id: tempObject.id,
        title: tempObject.title,
        author: tempObject.author,
        content: tempObject.content,
        created_at: tempObject.created_at,
        slug: tempObject.slug,
        modified_at: tempObject.modified_at,
        published_at: tempObject.published_at
      } = blogpostData);
      tempObject.draft = blogpostData.draft === 'true' ? 1 : 0;

      return tempObject;
    });
    return formatedBlogPostData;
  }
}

module.exports = DataFormatingService;
