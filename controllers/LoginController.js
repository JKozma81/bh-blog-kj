class LoginController {

    constructor(users, sessionsController, cookieController) {
        this.users = users;
        this.sessionController = sessionsController;
        this.cookieController = cookieController;
    }

    post(req, res, next) {
        const { username, password } = req.body;

        const user = this.users.find(user => user.username === username && user.password === password);

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
            case 'login':
                errorMsg = 'Login required!';
                break;
            default:
                errorMsg = '';
                break;
        }

        res.render('login', {
            siteTitle: 'Bishops First Blog',
            errorMsg
        })
    }

    logUserIn(req, res) {
        const user = req.user;
        const SID = this.sessionController.createSession(user);
        this.cookieController.createCookie(res, SID);
        res.redirect('/admin');
    }

    logUserOut(req, res) {
        const SID = req.cookies[this.cookieController.getCookie()];
        this.sessionController.deleteSession(SID);
        this.cookieController.deleteCookie(res);
        res.redirect('/login');
    }
}

module.exports = LoginController;