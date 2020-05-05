const nodemailer = require('nodemailer');

class PasswordResetController {
	static showForgotPassword(options) {
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
			// let testAccount = await nodemailer.createTestAccount();
			// const transporter = nodemailer.createTransport({
			// 	host: 'smtp.ethereal.email',
			// 	port: 587,
			// 	auth: {
			// 		user: 'boris.zulauf@ethereal.email',
			// 		pass: 'Rg2HCJep9bFScmkbqd',
			// 	},
			// });
			let transporter = nodemailer.createTransport({
				host: 'smtp.gmail.com',
				port: 465,
				secure: true,
				auth: {
					user: 'jkozma81@gmail.com',
					pass: 'Snoopy8119',
				},
			});

			const accountInfo = await accountService.getAccountInfo(user_email);

			if (!accountInfo) {
				res.redirect('/reset?noUser=notRegistered');
				return;
			}

			const message = {
				from: 'jkozma81@gmail.com',
				to: `${accountInfo.account.email}`,
				subject: 'Password reset',
				html: `
					<h1>Hello dear ${accountInfo.account.username}!</h1>
					<br />
					<p>You requested to reset your password at Bishop's blog site. To do that please follow the link below</p>
					<p>Link to reset your password: <a href="http://localhost:3000/reset/${accountInfo.unicId}">Reset site link</a></p>
					<br />
					<p>Please take in note, that you can't use this feature until you don't provide a correct database on the site.</p>
					<br />
					<p>Have a nice day! Bishop</p>
				`,
			};

			await transporter.sendMail(message);

			res.redirect('/reset?emailSent=emailSent');
		};
	}

	static showPasswordReset(options) {
		const configurations = options.configurations;
		const accountService = options.accountService;

		return async (req, res) => {
			if (!configurations['db-file']) {
				res.render('passwordReset', {
					siteTitle: 'Bishops First Blog',
					error:
						'No Database file provided. You need a correct database to use this feature',
				});
				return;
			}

			const resetId = req.params.id;

			const resetInfo = await accountService.getResetInfo(resetId);

			if (!resetInfo) {
				res.render('custom404', {
					siteTitle: 'Bishops First Blog',
				});
				return;
			}

			res.render('passwordReset', {
				siteTitle: 'Bishops First Blog',
				resetInfo,
			});
		};
	}

	static resetPassword(options) {
		const configurations = options.configurations;
		const accountService = options.accountService;

		return async (req, res) => {
			if (!configurations['db-file']) {
				res.redirect('/reset');
				return;
			}

			const { password, account_id, reset_id } = req.body;

			await accountService.resetPassword({
				password,
				account_id,
				reset_id,
			});

			res.redirect('/login');
		};
	}
}

module.exports = PasswordResetController;
