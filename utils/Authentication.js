const CookieService = require('../services/CookieService');
const SessionServices = require('../services/SessionServices');

class Authentication {
	authenticate(req, res, next) {
		if (!req.cookies[CookieService.getCookie()]) {
			res.status(401).redirect('/login?error=login');
			return;
		}

		const SID = Number(req.cookies[CookieService.getCookie()]);
		const userSession = SessionServices.getSession(SID);

		if (!userSession) {
			res.redirect('/login?error=login');
			return;
		}
		req.user = userSession.user;
		next();
	}
}

module.exports = Authentication;
