const messages = require('../mocks/Messages');

class MessageProviderService {
	static getMessage(messageIdentifyer) {
		return messages[messageIdentifyer];
	}
}

module.exports = MessageProviderService;
