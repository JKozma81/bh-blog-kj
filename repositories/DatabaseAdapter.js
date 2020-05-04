const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

function initDBConnection(dbFile) {
	dbFile = __dirname + '/../model/' + dbFile;
	if (fs.existsSync(dbFile)) {
		const dataBase = new sqlite3.Database(dbFile);
		const newDBAdapter = new DB(dataBase);
		try {
			dataBase.serialize(() => {
				dataBase.run(
					`CREATE TABLE IF NOT EXISTS
                   		posts (id INTEGER PRIMARY KEY AUTOINCREMENT,
                   		author VARCHAR(100) NOT NULL,
                   		title VARCHAR(100) NOT NULL,
                   		content TEXT NOT NULL,
                   		created_at INTEGER NOT NULL,
                   		published_at INTEGER,
                   		modified_at INTEGER,
                   		draft INTEGER NOT NULL)`
				);

				dataBase.run(
					`CREATE TABLE IF NOT EXISTS
                   		slugs (id INTEGER PRIMARY KEY AUTOINCREMENT,
                   		slug_value VARCHAR(100) NOT NULL,
                   		post_id INTEGER NOT NULL,
                   		is_active INTEGER NOT NULL,
                    FOREIGN KEY (post_id) REFERENCES posts (id)
                  	)`
				);

				dataBase.run(
					`CREATE TABLE IF NOT EXISTS
            	   		tags (id INTEGER PRIMARY KEY AUTOINCREMENT,
                   		tag_name VARCHAR(100) NOT NULL,
                   		post_id INTEGER NOT NULL,
                   	FOREIGN KEY (post_id) REFERENCES posts (id)
                  	)`
				);

				dataBase.run(
					`CREATE TABLE IF NOT EXISTS
                 		archive_layouts (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 		layout VARCHAR(100) NOT NULL,
                 		is_active INTEGER NOT NULL
                	)`
				);

				dataBase.run(`
					INSERT INTO 
						archive_layouts(layout, is_active)
					VALUES("flat", 0)
				`);

				dataBase.run(`
					INSERT INTO 
						archive_layouts(layout, is_active)
					VALUES("tree", 1)
				`);

				dataBase.run(
					`CREATE TABLE IF NOT EXISTS
            	   		accounts (id INTEGER PRIMARY KEY AUTOINCREMENT,
                   		user_name VARCHAR(100) NOT NULL,
                   		user_email VARCHAR(100) NOT NULL,
                   		user_password VARCHAR(100) NOT NULL,
                   		role_id INTEGER NOT NULL,
                   	FOREIGN KEY (role_id) REFERENCES roles (id)
                  	)`
				);

				dataBase.run(
					`CREATE TABLE IF NOT EXISTS
						roles (id INTEGER PRIMARY KEY AUTOINCREMENT,
						role_name VARCHAR(100) NOT NULL
						)`
				);

				dataBase.run(`
					INSERT INTO
						roles(role_name)
					VALUES("admin")
				`);

				dataBase.run(`
					INSERT INTO
						roles(role_name)
					VALUES("author")
				`);

				dataBase.serialize(() => {
					dataBase.get(
						'SELECT id FROM roles WHERE role_name = ?',
						['admin'],
						(err, roleResult) => {
							const adminId = roleResult.id;
							dataBase.run(
								`
								INSERT INTO
									accounts(user_name, user_email, user_password, role_id)
								VALUES("admin", "admin@example.com", "admin", ?)
								`,
								adminId
							);
						}
					);
				});

				dataBase.run(
					`CREATE TABLE IF NOT EXISTS
                   		pass_resets (id INTEGER PRIMARY KEY NOT NULL,
                   		account_id INTEGER NOT NULL,
                   		is_active INTEGER NOT NULL,
                    FOREIGN KEY (account_id) REFERENCES accounts (id)
                  	)`
				);
			});
		} catch (err) {
			console.error(err);
		}
		return newDBAdapter;
	}
	const dataBase = new sqlite3.Database(':memory:');
	const newDBAdapter = new DB(dataBase);
	return newDBAdapter;
}

class DB {
	constructor(databaseEngine) {
		this.databaseEngine = databaseEngine;
	}

	getAll(sqlQuery, params = []) {
		return new Promise((resolve, reject) => {
			try {
				this.databaseEngine.serialize(() => {
					const statement = this.databaseEngine.prepare(sqlQuery);
					statement.all(...params, (err, results) => {
						if (err !== null) reject(err);
						resolve(results);
					});
					statement.finalize();
				});
			} catch (err) {
				console.error(err);
			}
		});
	}

	get(sqlQuery, params = []) {
		return new Promise((resolve, reject) => {
			try {
				this.databaseEngine.serialize(() => {
					const statement = this.databaseEngine.prepare(sqlQuery);
					statement.get(...params, (err, result) => {
						if (err !== null) reject(err);
						resolve(result);
					});
					statement.finalize();
				});
			} catch (err) {
				console.error(err);
			}
		});
	}

	run(sqlQuery, params = []) {
		return new Promise((resolve, reject) => {
			try {
				this.databaseEngine.serialize(() => {
					const statement = this.databaseEngine.prepare(sqlQuery);
					statement.run(...params, function (err) {
						if (err !== null) reject(err);
					});
					statement.finalize();
					resolve();
				});
			} catch (err) {
				console.error(err);
			}
		});
	}

	formatDBBoolSpecifics(data) {
		return data === 'true' ? 1 : 0;
	}

	runAsync = function (sql, ...params) {
		return new Promise((resolve, reject) => {
			this.databaseEngine.run(sql, params, function (err) {
				if (err) return reject(err);
				resolve(this);
			});
		});
	};

	runBatchAsync = function (statements) {
		var results = [];
		var batch = ['BEGIN', ...statements, 'COMMIT'];
		return batch
			.reduce(
				(chain, statement) =>
					chain.then((result) => {
						results.push(result);
						return this.runAsync(...[].concat(statement));
					}),
				Promise.resolve()
			)
			.catch((err) =>
				this.runAsync('ROLLBACK').then(() =>
					Promise.reject(err + ' in statement #' + results.length)
				)
			)
			.then(() => results.slice(2));
	};
}

module.exports = { initDBConnection };
