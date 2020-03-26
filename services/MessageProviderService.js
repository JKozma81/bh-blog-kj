class MessageProviderService {
  constructor(messages) {
    this.messages = messages;
  }

  getMessage(messageIdentifyer) {
    return this.messages[messageIdentifyer];
  }
}

module.exports = MessageProviderService;
