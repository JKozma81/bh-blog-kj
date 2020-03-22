const CookieService = require('../services/CookieService');

class Authentication {
	constructor(sessionController) {
		this.sessionController = sessionController;
	}

	authenticate(req, res, next) {
		if (!req.cookies[CookieService.getCookie()]) {
			res.status(401).redirect('/login?error=login');
			return;
		}

		const SID = Number(req.cookies[CookieService.getCookie()]);
		const userSession = this.sessionController.getSession(SID);

		if (!userSession) {
			res.redirect('/login?error=login');
			return;
		}
		req.user = userSession.user;
		next();
	}
}

module.exports = Authentication;
