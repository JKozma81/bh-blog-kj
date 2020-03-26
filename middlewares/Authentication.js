const { AUTH_COOKIE } = require('../Config/config.json');

class UserAuthentication {
  constructor(sessionService) {
    this.sessionService = sessionService;
  }

  login(req, res, next) {
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

  authenticate(req, res, next) {
    if (!req.cookies[AUTH_COOKIE]) {
      res.status(401).redirect('/login?error=login');
      return;
    }

    const SID = Number(req.cookies[AUTH_COOKIE]);
    const userSession = this.sessionService.getSession(SID);

    if (!userSession) {
      res.redirect('/login?error=login');
      return;
    }
    req.user = userSession.user;
    next();
  }
}

module.exports = UserAuthentication;
