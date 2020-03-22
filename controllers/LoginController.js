const CookieService = require('../services/CookieService');

class LoginController {
	constructor(users, sessionsController) {
		this.users = users;
		this.sessionController = sessionsController;
	}

	post(req, res, next) {
		const { username, password } = req.body;

		if (!username && !password) {
			res.redirect('/login?error=missingcredentials');
			return;
		}

		if (!username) {
			res.redirect(`/login?error=missingusername&password=${password}`);
			return;
		}

		if (!password) {
			res.redirect(`/login?error=missingpassword&username=${username}`);
			return;
		}

		const user = this.users.find(
			user => user.username === username && user.password === password
		);

		if (!user) {
			res.redirect('/login?error=credentials');
			return;
		}

		req.user = user;
		next();
	}

	get(req, res) {
		let errorMsg;

		switch (req.query.error) {
			case 'credentials':
				errorMsg = 'Wrong username or password!';
				break;
			case 'missingusername':
				errorMsg = 'Username is missing!';
				break;
			case 'missingpassword':
				errorMsg = 'Password is missing!';
				break;
			case 'missingcredentials':
				errorMsg = 'Username and password is missing!';
				break;
			case 'login':
				errorMsg = 'Login required!';
				break;
			default:
				errorMsg = '';
				break;
		}

		const logoutMsg = req.query.logout ? `Logout ${req.query.logout}` : '';
		const username = req.query.username ? req.query.username : '';
		const password = req.query.password ? req.query.password : '';

		res.render('login', {
			siteTitle: 'Bishops First Blog',
			errorMsg,
			logoutMsg,
			username,
			password
		});
	}

	logUserIn(req, res) {
		const user = req.user;
		const SID = this.sessionController.createSession(user);
		CookieService.createCookie(res, SID);
		res.redirect('/admin');
	}

	logUserOut(req, res) {
		const SID = req.cookies[CookieService.getCookie()];
		this.sessionController.deleteSession(SID);
		CookieService.deleteCookie(res);
		res.redirect('/login?logout=success');
	}
}

module.exports = LoginController;
