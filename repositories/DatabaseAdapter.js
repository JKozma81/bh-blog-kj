module.exports = class DB {
  constructor(databaseEngine) {
    this.databaseEngine = databaseEngine;
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

  init() {
    this.databaseEngine.serialize(async () => {
      try {
        await this.databaseEngine.run(
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

        await this.databaseEngine.run(
          `CREATE TABLE IF NOT EXISTS
            slugs (id INTEGER PRIMARY KEY AUTOINCREMENT,
                   slug_value VARCHAR(100) NOT NULL,
                   post_id INTEGER NOT NULL,
                   is_active INTEGER NOT NULL,
                   FOREIGN KEY (post_id) REFERENCES posts (id)
                  )`
        );

        await this.databaseEngine.run(
          `CREATE TABLE IF NOT EXISTS
            archive_layouts (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 layout VARCHAR(100) NOT NULL,
                 is_active INTEGER NOT NULL
                )`
        );

        await this.databaseEngine.all(
          `SELECT layout FROM archive_layouts`,
          async (err, results) => {
            const layouts = await results;
            if (layouts.length === 0) {
              await this.databaseEngine.run(`
                INSERT INTO 
                  archive_layouts(layout, is_active)
                VALUES("flat", 0)
              `);
              await this.databaseEngine.run(`
                INSERT INTO 
                  archive_layouts(layout, is_active)
                VALUES("tree", 1)
              `);
            }
          }
        );
      } catch (err) {
        console.error(err);
      }
    });
  }
};
