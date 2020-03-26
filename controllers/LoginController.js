const CookieService = require('../services/CookieService');
const SessionServices = require('../services/SessionServices');
const users = require('../mocks/Users');

const { AUTH_COOKIE } = require('../Config/config.json');

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
        password
      });
    };
  }

  static login(options) {
    const sessionService = options.sessionService;
    return (req, res) => {
      const user = req.user;
      const SID = sessionService.createSession(user);
      res.cookie(AUTH_COOKIE, SID);
      res.redirect('/admin');
    };
  }

  static logUserOut(req, res) {
    const SID = req.cookies[CookieService.getCookie()];
    SessionServices.deleteSession(SID);
    CookieService.deleteCookie(res);
    res.redirect('/login?logout=success');
  }
}

module.exports = LoginController;
