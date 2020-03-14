class AdminController {

    get(req, res) {
        res.render('admin', {
            siteTitle: 'Bishops First Blog'
        })
    }
}

module.exports = AdminController;