const CookieService = require('../services/CookieService');
const SessionServices = require('../services/SessionServices');
const users = require('../mocks/Users');

class LoginController {
  static post(req, res, next) {
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

    const user = users.find(
      user => user.username === username && user.password === password
    );

    if (!user) {
      res.redirect('/login?error=credentials');
      return;
    }

    req.user = user;
    next();
  }

  static showLogin(options) {
    const messageProvider = options.MessageProviderService;
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
        password
      });
    };
  }

  static logUserIn(req, res) {
    const user = req.user;
    const SID = SessionServices.createSession(user);
    CookieService.createCookie(res, SID);
    res.redirect('/admin');
  }

  static logUserOut(req, res) {
    const SID = req.cookies[CookieService.getCookie()];
    SessionServices.deleteSession(SID);
    CookieService.deleteCookie(res);
    res.redirect('/login?logout=success');
  }
}

module.exports = LoginController;
