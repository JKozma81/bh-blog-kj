class DataFormatingService {
	static formatDataForArchive(data) {
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
}

module.exports = DataFormatingService;
