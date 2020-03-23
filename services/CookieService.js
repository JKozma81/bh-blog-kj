const { AUTH_COOKIE } = require('../config/config.json');

class CookieService {
	static createCookie(res, cookieValue) {
		return res.cookie(AUTH_COOKIE, cookieValue);
	}

	static deleteCookie(res) {
		return res.clearCookie(AUTH_COOKIE);
	}

	static getCookie() {
		return AUTH_COOKIE;
	}
}

module.exports = CookieService;
