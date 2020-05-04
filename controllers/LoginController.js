class LoginController {
	static showLogin(options) {
		const messageProvider = options.messageProviderService;
		return async (req, res) => {
			const errorMsg = req.query.error
				? messageProvider.getMessage(req.query.error)
				: '';

			const logoutMsg = req.query.logout
				? messageProvider.getMessage(req.query.logout)
				: '';
			const username = req.query.username ? req.query.username : '';
			const password = req.query.password ? req.query.password : '';

			res.render('login', {
				siteTitle: 'Bishops First Blog',
				errorMsg,
				logoutMsg,
				username,
				password,
			});
		};
	}

	static login(options) {
		const authCookie = options.authCookie;
		const sessionService = options.sessionService;
		return (req, res) => {
			const user = req.user;
			const SID = sessionService.createSession(user);
			res.cookie(authCookie, SID);
			res.redirect('/admin');
		};
	}

	static logout(options) {
		const authCookie = options.authCookie;
		const sessionService = options.sessionService;
		return (req, res) => {
			const SID = req.cookies[authCookie];
			sessionService.deleteSession(SID);
			res.clearCookie(authCookie);
			res.redirect('/login?logout=success');
		};
	}
}

module.exports = LoginController;
