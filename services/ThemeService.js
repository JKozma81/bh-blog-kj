const fs = require('fs');
const path = require('path');

class ThemeService {
  constructor(configurations) {
    this.configurations = configurations;
  }

  getAllThemes() {
    return fs.readdirSync(path.join(__dirname, '..', 'themes'));
  }

  applyTheme(name) {
    fs.copyFileSync(
      path.join(__dirname, '..', 'themes', `${name}`, 'bootstrap.css'),
      path.join(__dirname, '..', 'public', 'css', 'bootstrap.css')
    );
  }
}

module.exports = ThemeService;
