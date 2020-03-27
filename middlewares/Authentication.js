class UserAuthentication {
  login(options) {
    const users = options.users;
    return (req, res, next) => {
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
