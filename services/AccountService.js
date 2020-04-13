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

  async getAccountByData(dataObj) {
    return await this.AccountRepository.getAccountByData(dataObj);
  }

  async getAccountById(id) {
    return await this.AccountRepository.getAccountById(id);
  }
}

module.exports = AccountService;
