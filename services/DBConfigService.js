class DBConfigService {
  constructor(initializeDBfunction) {
    this.initDB = initializeDBfunction;
  }
  async initDBConnection(dbFile) {
    return await this.initDB(dbFile);
  }
}

module.exports = DBConfigService;
