module.exports = class DB {
  constructor(databaseEngine) {
    this.databaseEngine = databaseEngine;
  }

  init() {
    this.databaseEngine.serialize(() => {
      this.databaseEngine.run(
        `CREATE TABLE IF NOT EXISTS
          posts (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 author VARCHAR(100) NOT NULL,
                 title VARCHAR(100) NOT NULL,
                 content TEXT NOT NULL,
                 created_at TEXT NOT NULL,
                 published_at VARCHAR(100),
                 modified_at VARCHAR(100),
                 draft INTEGER NOT NULL)`
      );

      this.databaseEngine.run(
        `CREATE TABLE IF NOT EXISTS
          slugs (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 slug_value VARCHAR(100) NOT NULL,
                 post_id INTEGER NOT NULL,
                 is_active INTEGER NOT NULL,
                 FOREIGN KEY (post_id) REFERENCES posts (id)
                )`
      );
    });
  }

  getAll(sqlQuery, params = []) {
    return new Promise((resolve, reject) => {
      this.databaseEngine.serialize(() => {
        const statement = this.databaseEngine.prepare(sqlQuery);
        statement.all(...params, (err, results) => {
          if (err !== null) reject(err);
          resolve(results);
        });
      });
    });
  }

  get(sqlQuery, params = []) {
    return new Promise((resolve, reject) => {
      this.databaseEngine.serialize(() => {
        const statement = this.databaseEngine.prepare(sqlQuery);
        statement.get(...params, (err, result) => {
          if (err !== null) reject(err);
          resolve(result);
        });
        statement.finalize();
      });
    });
  }

  run(sqlQuery, params = []) {
    return new Promise((resolve, reject) => {
      this.databaseEngine.serialize(() => {
        const statement = this.databaseEngine.prepare(sqlQuery);
        statement.run(...params, err => {
          if (err !== null) reject(err);
        });
        statement.finalize();
        resolve();
      });
    });
  }

  formatDBBoolSpecifics(data) {
    return data === 'true' ? 1 : 0;
  }

  // formatDBStringSpecifics(data) {
  //   return data.split('"').join("'");
  // }
};
