class DataFormatingService {
  formatDataForArchive(data) {
    const formatedBlogPostData = {};

    data.forEach(blogPost => {
      let fullDate = blogPost.published_at.split(' ')[0].split('-');
      fullDate = fullDate.map(element => (element = Number(element)));
      fullDate[1] -= 1;
      let date = new Date(...fullDate);
      let year = date.getFullYear();
      let month = date.toLocaleString('en-US', { month: 'long' });

      if (!formatedBlogPostData.hasOwnProperty(year)) {
        formatedBlogPostData[year] = {};
      }

      if (!formatedBlogPostData[year].hasOwnProperty(month)) {
        formatedBlogPostData[year][month] = [];
      }

      formatedBlogPostData[year][month].push({
        id: blogPost.id,
        title: blogPost.title
      });
    });
    return formatedBlogPostData;
  }

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
