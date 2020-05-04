class PasswordResetController {
	static showReset(options) {
		const messageProvider = options.messageProviderService;
		const configurations = options.configurations;
		return async (req, res) => {
			if (!configurations['db-file']) {
				res.render('passReset', {
					siteTitle: 'Bishops First Blog',
					error:
						'No Database file provided. You need a correct database to use this feature',
				});
				return;
			}

			const emailMsg = req.query.emailSent
				? messageProvider.getMessage(req.query.emailSent)
				: '';
			res.render('passReset', {
				siteTitle: 'Bishops First Blog',
				emailMsg,
			});
		};
	}
}

module.exports = PasswordResetController;
