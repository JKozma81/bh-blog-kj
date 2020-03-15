class AdminController {

    get(req, res) {
        const user = req.user;
        res.render('dashboard', {
            siteTitle: 'Bishops First Blog',
            username: user.username
        })
    }
}

module.exports = AdminController;