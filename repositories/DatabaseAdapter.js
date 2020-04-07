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
            archive_layouts (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 layout VARCHAR(100) NOT NULL,
                 is_active INTEGER NOT NULL
                )`
        );

        dataBase.all(`SELECT layout FROM archive_layouts`, (err, results) => {
          const layouts = results;
          if (layouts.length === 0) {
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
          }
        });
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
}

module.exports = { DB, initDBConnection };
