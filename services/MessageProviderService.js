class MessageProviderService {
  constructor(messages) {
    this.messages = messages;
  }

  static getMessage(messageIdentifyer) {
    return this.messages[messageIdentifyer];
  }
}

module.exports = MessageProviderService;
