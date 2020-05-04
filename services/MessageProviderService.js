const messages = {
	'title-content-slug': 'Title, Content and Slug are Mandatory!',
	'title-and-slug': 'Title and Slug are Mandatory!',
	'content-and-slug': 'Content and Slug are Mandatory!',
	'title-and-content': 'Title and Content are Mandatory!',
	title: 'Title is Mandatory!',
	content: 'Content is Mandatory!',
	slug: 'Slug is Mandatory!',
	credentials: 'Wrong username or password!',
	missingusername: 'Username is missing!',
	missingpassword: 'Password is missing!',
	missingcredentials: 'Username and password is missing!',
	login: 'Login required!',
	success: `Logout success!`,
	emailSent: 'Password reset email was sent!',
};

class MessageProviderService {
	constructor(messages) {
		this.messages = messages;
	}

	getMessage(messageIdentifyer) {
		return this.messages[messageIdentifyer];
	}
}

module.exports = { MessageProviderService, messages };
