const { DBPath } = require('../config/config.json');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(DBPath);
db.serialize(() => {
	db.run(
		'CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, author VARCHAR(100) NOT NULL, title VARCHAR(100) NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL, slug VARCHAR(100) NOT NULL, published_at VARCHAR(100), modified_at VARCHAR(100), draft INTEGER NOT NULL)'
	);
});

module.exports = class DB {
	static getAll(sqlQuery) {
		return new Promise((resolve, reject) => {
			db.serialize(() => {
				db.all(sqlQuery, (err, results) => {
					if (err !== null) reject(err);
					resolve(results);
				});
			});
		});
	}

	static get(sqlQuery) {
		return new Promise((resolve, reject) => {
			db.serialize(() => {
				db.get(sqlQuery, (err, result) => {
					if (err !== null) reject(err);
					resolve(result);
				});
			});
		});
	}

	static run(sqlQuery) {
		return new Promise((resolve, reject) => {
			db.serialize(() => {
				db.run(sqlQuery, err => {
					if (err !== null) reject(err);
					resolve();
				});
			});
		});
	}
};