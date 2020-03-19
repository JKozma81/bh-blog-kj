class Authentication {
	constructor(sessionController, cookieController) {
		this.cookieController = cookieController;
		this.sessionController = sessionController;
	}

	authenticate(req, res, next) {
		if (!req.cookies[this.cookieController.getCookie()]) {
			res.status(401).redirect('/login?error=login');
			return;
		}

		const SID = Number(req.cookies[this.cookieController.getCookie()]);
		const userSession = this.sessionController.getSession(SID);
		req.user = userSession.user;
		next();
	}
}

module.exports = Authentication;
