class ArchiveConfigRepository {
  constructor(DBAdapter) {
    this.DBAdapter = DBAdapter;
  }

  async getAllLayout() {
    let layouts;
    try {
      layouts = await this.DBAdapter.getAll(
        `SELECT id, layout, is_active FROM archive_layouts`
      );
    } catch (err) {
      console.error(err);
    }

    layouts = layouts.map(layout => {
      return {
        id: layout.id,
        name: layout.layout,
        default: layout.is_active === 1 ? true : false
      };
    });
    return layouts;
  }

  async modifyLayout(layout) {
    try {
      await this.DBAdapter.run(`
        UPDATE 
          archive_layouts
        SET
          is_active = 0
        WHERE
          is_active = 1
  
      `);

      await this.DBAdapter.run(
        `
        UPDATE
          archive_layouts
        SET
          is_active = 1
        WHERE
          layout = ?
      `,
        [layout]
      );
    } catch (err) {
      console.error(err);
    }
  }

  async getDefault() {
    let defaultLayout;
    try {
      defaultLayout = await this.DBAdapter.get(`
        SELECT
          id,
          layout,
          is_active
        FROM
          archive_layouts
        WHERE
          is_active = 1
      `);
    } catch (err) {
      console.error(err);
    }

    return {
      id: defaultLayout.id,
      name: defaultLayout.layout,
      default: defaultLayout.is_active === 1 ? true : false
    };
  }
}

module.exports = ArchiveConfigRepository;
