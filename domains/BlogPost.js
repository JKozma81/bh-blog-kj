class BlogPost {
	constructor(
		id,
		title,
		author,
		content,
		created_at,
		published_at,
		modified_at,
		slug,
		draft
	) {
		this.id = id;
		this.title = title;
		this.author = author;
		this.content = content;
		this.created_at = created_at;
		this.published_at = published_at;
		this.modified_at = modified_at;
		this.slug = slug;
		this.draft = draft;
	}
}

module.exports = BlogPost;
