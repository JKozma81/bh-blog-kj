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
            accounts.id,
            accounts.user_name,
            accounts.user_email,
            accounts.user_password,
            roles.role_name
          FROM
            accounts
          JOIN 
            roles
          ON
            accounts.role_id = roles.id
        `
			);

			const results = accounts.map(
				(account) =>
					new Account(
						account.id,
						account.user_name,
						account.user_password,
						account.user_email,
						account.role_name
					)
			);

			return results;
		} catch (err) {
			console.error(err);
		}
	}

	async addNewAccount(newAccountObj) {
		try {
			const roleId = await this.DBAdapter().get(
				'SELECT id FROM roles WHERE role_name = ?',
				[newAccountObj.roles]
			);

			await this.DBAdapter().runAsync(
				`
        INSERT INTO accounts(user_name, user_password, user_email, role_id) VALUES(?,?,?,?)
      `,
				newAccountObj.user_name,
				newAccountObj.user_password,
				newAccountObj.user_email,
				roleId.id
			);

			const account = await this.DBAdapter().get(
				`
        SELECT
          accounts.id,
          accounts.user_name,
          accounts.user_password,
          accounts.user_email,
          roles.role_name
        FROM
          accounts
        JOIN
          roles
        ON
          accounts.role_id = roles.id
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
				account.user_email,
				account.role_name
			);

			return result;
		} catch (err) {
			console.error(err);
		}
	}

	async getAccountByData(dataObj) {
		try {
			const account = await this.DBAdapter().get(
				`
				SELECT
					accounts.id,
					accounts.user_name,
					accounts.user_password,
					accounts.user_email,
					roles.role_name
				FROM
					accounts
				JOIN
					roles
				ON
					accounts.role_id = roles.id
				WHERE
					accounts.user_name = ?
				AND
					accounts.user_password = ? 
				`,
				[dataObj.username, dataObj.password]
			);

			if (!account) {
				return undefined;
			}

			const result = new Account(
				account.id,
				account.user_name,
				account.user_password,
				account.user_email,
				account.role_name
			);

			return result;
		} catch (err) {
			console.error(err);
		}
	}

	async getAccountById(id) {
		try {
			const account = await this.DBAdapter().get(
				`
				SELECT
					accounts.id,
					accounts.user_name,
					accounts.user_password,
					accounts.user_email,
					roles.role_name
				FROM
					accounts
				JOIN
					roles
				ON
					accounts.role_id = roles.id
				WHERE
					accounts.id = ?
				`,
				[id]
			);

			if (!account) {
				return undefined;
			}

			const result = new Account(
				account.id,
				account.user_name,
				account.user_password,
				account.user_email,
				account.role_name
			);

			return result;
		} catch (err) {
			console.error(err);
		}
	}

	async editAccount(editedAccount) {
		try {
			const roleId = await this.DBAdapter().get(
				'SELECT id FROM roles WHERE role_name = ?',
				[editedAccount.roles]
			);

			await this.DBAdapter().runAsync(
				`
				UPDATE
					accounts
				SET
					user_name = ?,
					user_email = ?,
					user_password = ?,
					role_id = ?
				WHERE
					id = ?
      			`,
				editedAccount.user_name,
				editedAccount.user_email,
				editedAccount.user_password,
				roleId.id,
				editedAccount.id
			);

			const account = await this.DBAdapter().get(
				`
			SELECT
				accounts.id,
				accounts.user_name,
				accounts.user_password,
				accounts.user_email,
				roles.role_name
			FROM
				accounts
			JOIN
				roles
			ON
				accounts.role_id = roles.id
			WHERE
				accounts.id = ?
			`,
				[editedAccount.id]
			);

			const result = new Account(
				account.id,
				account.user_name,
				account.user_password,
				account.user_email,
				account.role_name
			);

			return result;
		} catch (err) {
			console.error(err);
		}
	}

	async getAllRoles() {
		try {
			const roles = await this.DBAdapter().getAll(
				`
				SELECT
					id,
					role_name
				FROM
					roles
				`
			);
			return roles;
		} catch (err) {
			console.error(err);
		}
	}

	async getAccountInfo(userEmail) {
		try {
			const account = await this.DBAdapter().get(
				`
				SELECT
					accounts.id,
					accounts.user_name,
					accounts.user_password,
					accounts.user_email,
					roles.role_name
				FROM
					accounts
				JOIN
					roles
				ON
					accounts.role_id = roles.id
				WHERE
					accounts.user_email = ?
      		`,
				[userEmail]
			);

			if (!account) {
				return undefined;
			}

			await this.DBAdapter().runAsync(
				'iNSERT INTO pass_resets(id, account_id, is_active) VALUES(?,?,?)',
				Date.now(),
				account.id,
				1
			);

			const unicId = await this.DBAdapter().get(
				'SELECT id FROM pass_resets WHERE account_id = ? AND is_active = 1',
				[account.id]
			);

			const accountResult = new Account(
				account.id,
				account.user_name,
				account.user_password,
				account.user_email,
				account.role_name
			);

			return {
				account: accountResult,
				unicId: unicId.id,
			};
		} catch (err) {
			console.error(err);
		}
	}

	async getResetInfo(id) {
		try {
			const accountId = await this.DBAdapter().get(
				`
				SELECT
					id,
					account_id
				FROM
					pass_resets
				WHERE
					id = ?
				AND
					is_active = 1
				`,
				[id]
			);

			if (!accountId) {
				return undefined;
			}

			return accountId;
		} catch (err) {
			console.error(err);
		}
	}

	async resetPassword(resetInfoObject) {
		try {
			this.DBAdapter().run(
				'UPDATE accounts SET user_password = ? WHERE id = ?',
				[resetInfoObject.password, resetInfoObject.account_id]
			);

			this.DBAdapter().run(
				'UPDATE pass_resets SET is_active = 0 WHERE id = ? AND account_id = ?',
				[
					Number(resetInfoObject.reset_id),
					Number(resetInfoObject.account_id),
				]
			);

			return resetInfoObject.account_id;
		} catch (err) {
			console.error(err);
		}
	}
}

module.exports = AccountRepository;
