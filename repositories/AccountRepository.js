const Account = require('../domains/Account');

class AccountRepository {
  constructor(DBAdapter) {
    this.DBAdapter = DBAdapter;
  }

  async getAllAccounts() {
    try {
      const accounts = await this.DBAdapter().getAll(
        `
          SELECT
            id,
            user_name,
            user_email,
            user_password
          FROM
            accounts
        `
      );

      const results = accounts.map(
        (account) =>
          new Account(
            account.id,
            account.user_name,
            account.user_password,
            account.user_email
          )
      );

      return results;
    } catch (err) {
      console.error(err);
    }
  }

  async addNewAccount(newAccountObj) {
    try {
      await this.DBAdapter().runAsync(
        `
        INSERT INTO accounts(user_name, user_password, user_email) VALUES(?,?,?)
      `,
        newAccountObj.user_name,
        newAccountObj.user_password,
        newAccountObj.user_email
      );

      const account = await this.DBAdapter().get(
        `
        SELECT
          id,
          user_name,
          user_password,
          user_email
        FROM
          accounts
        WHERE
          user_name = ?
        AND
          user_password = ? 
      `,
        [newAccountObj.user_name, newAccountObj.user_password]
      );

      const result = new Account(
        account.id,
        account.user_name,
        account.user_password,
        account.user_email
      );

      return result;
    } catch (err) {
      console.error(err);
    }
  }

  async getAccountByData(dataObj) {
    try {
      const account = await await this.DBAdapter().get(
        `
        SELECT
          id,
          user_name,
          user_password,
          user_email
        FROM
          accounts
        WHERE
          user_name = ?
        AND
          user_password = ? 
      `,
        [dataObj.username, dataObj.password]
      );

      const result = new Account(
        account.id,
        account.user_name,
        account.user_password,
        account.user_email
      );

      return result;
    } catch (err) {
      console.error(err);
    }
  }

  async getAccountById(id) {
    try {
      const result = new Account(
        account.id,
        account.user_name,
        account.user_password,
        account.user_email
      );

      return result;
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = AccountRepository;
