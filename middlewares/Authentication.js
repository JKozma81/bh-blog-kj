class UserAuthentication {
	login(options) {
		const users = options.users;
		const accountService = options.accountService;
		const configurations = options.configurations;

		return async (req, res, next) => {
			const { username, password } = req.body;
			let user;

			if (!username && !password) {
				res.redirect('/login?error=missingcredentials');
				return;
			}

			if (!username) {
				res.redirect(
					`/login?error=missingusername&password=${password}`
				);
				return;
			}

			if (!password) {
				res.redirect(
					`/login?error=missingpassword&username=${username}`
				);
				return;
			}

			if (!configurations['db-file']) {
				user = users.find(
					(u) => u.username === username && u.password === password
				);
			}

			if (configurations['db-file']) {
				user = await accountService.getAccountByData({
					username,
					password,
				});
			}

			if (!user) {
				res.redirect('/login?error=credentials');
				return;
			}

			req.user = user;
			next();
		};
	}

	authenticate(options) {
		const sessionService = options.sessionService;
		const authCookie = options.authCookie;

		return (req, res, next) => {
			if (!req.cookies[authCookie]) {
				res.status(401).redirect('/login?error=login');
				return;
			}

			const SID = Number(req.cookies[authCookie]);
			const userSession = sessionService.getSession(SID);

			if (!userSession) {
				res.redirect('/login?error=login');
				return;
			}
			req.user = userSession.user;
			next();
		};
	}
}

module.exports = UserAuthentication;
