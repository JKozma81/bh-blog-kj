const { AUTH_COOKIE } = require('../config/config.json');

class CookieService {
  static deleteCookie(res) {
    return res.clearCookie(AUTH_COOKIE);
  }
}

module.exports = CookieService;
