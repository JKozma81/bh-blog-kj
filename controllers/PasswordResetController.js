class PasswordResetController {
	static showReset(options) {
		const messageProvider = options.messageProviderService;
		const configurations = options.configurations;

		return async (req, res) => {
			if (!configurations['db-file']) {
				res.render('forgotPassword', {
					siteTitle: 'Bishops First Blog',
					error:
						'No Database file provided. You need a correct database to use this feature',
				});
				return;
			}

			if (req.query.noUser) {
				res.render('forgotPassword', {
					siteTitle: 'Bishops First Blog',
					error: messageProvider.getMessage(req.query.noUser),
				});
				return;
			}

			const emailMsg = req.query.emailSent
				? messageProvider.getMessage(req.query.emailSent)
				: '';
			res.render('forgotPassword', {
				siteTitle: 'Bishops First Blog',
				emailMsg,
			});
		};
	}

	static sendPassReset(options) {
		const configurations = options.configurations;
		const accountService = options.accountService;

		return async (req, res) => {
			if (!configurations['db-file']) {
				res.redirect('/reset');
				return;
			}

			const { user_email } = req.body;

			const accountInfo = await accountService.getUnicId(user_email);

			console.log(accountInfo.unicId);

			if (!accountInfo) {
				res.redirect('/reset?noUser=notRegistered');
				return;
			}

			res.redirect('/reset?emailSent=emailSent');
		};
	}
}

module.exports = PasswordResetController;
