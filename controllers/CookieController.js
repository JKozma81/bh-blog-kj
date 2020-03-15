class CookieController {
    constructor(sessionCtrl) {
        this.authCookie = 'auth-cookie';
    }

    createCookie(res, cookieValue) {
        return res.cookie(this.authCookie, cookieValue);
    }

    deleteCookie(res) {
        return res.clearCookie(this.authCookie);
    }

    getCookie() {
        return this.authCookie;
    }
}

module.exports = CookieController;