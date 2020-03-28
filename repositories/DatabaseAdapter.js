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
                 value VARCHAR(100) NOT NULL
                )`
      );

      this.databaseEngine.run(
        `CREATE TABLE IF NOT EXISTS
          posts_with_slugs (id INTEGER PRIMARY KEY,
                            post_id INTEGER NOT NULL,
                            slug_id INTEGER NOT NULL,
                            FOREIGN KEY (post_id) REFERENCES posts (id),
                            FOREIGN KEY (slug_id) REFERENCES slugs (id))`
      );
    });
  }

  getAll(sqlQuery) {
    return new Promise((resolve, reject) => {
      this.databaseEngine.serialize(() => {
        this.databaseEngine.all(sqlQuery, (err, results) => {
          if (err !== null) reject(err);
          resolve(results);
        });
      });
    });
  }

  get(sqlQuery) {
    return new Promise((resolve, reject) => {
      this.databaseEngine.serialize(() => {
        this.databaseEngine.get(sqlQuery, (err, result) => {
          if (err !== null) reject(err);
          resolve(result);
        });
      });
    });
  }

  run(sqlQuery) {
    return new Promise((resolve, reject) => {
      this.databaseEngine.serialize(() => {
        this.databaseEngine.run(sqlQuery, err => {
          if (err !== null) reject(err);
          resolve();
        });
      });
    });
  }

  formatDBBoolSpecifics(data) {
    return data === 'true' ? 1 : 0;
  }

  formatDBStringSpecifics(data) {
    return data.split('"').join("'");
  }
};
