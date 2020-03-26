module.exports = class DB {
  constructor(databaseEngine) {
    this.databaseEngine = databaseEngine;

    this.databaseEngine.serialize(() => {
      this.databaseEngine.run(
        'CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, author VARCHAR(100) NOT NULL, title VARCHAR(100) NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL, slug VARCHAR(100) NOT NULL, published_at VARCHAR(100), modified_at VARCHAR(100), draft INTEGER NOT NULL)'
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
};
