class LoginController {

    post(req, res) {
        const { username, password } = req.body;

        if (username !== 'admin' && password !== 'admin' || !username || !password) {
            res.redirect('/login?error=credentials');
            return;
        }
        res.redirect('/admin');
    }

    get(req, res) {
        const errorMsg = req.query.error === 'credentials' ? 'Wrong username or password!' : '';
        res.render('login', {
            siteTitle: 'Bishops First Blog',
            errorMsg
        })
    }
}

module.exports = LoginController;