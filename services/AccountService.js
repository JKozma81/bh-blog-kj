const Account = require('../domains/Account');

class AccountService {
  constructor(AccountRepository) {
    this.AccountRepository = AccountRepository;
  }

  async getAllAccounts() {
    return await this.AccountRepository.getAllAccounts();
  }

  async addNewAccount(newAccountObj) {
    return await this.AccountRepository.addNewAccount(newAccountObj);
  }
}

module.exports = AccountService;
