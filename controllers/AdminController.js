const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { DBPath } = require('../configs/config.json');

class AdminController {
	static showDashboard(req, res) {
		const user = req.user;
		res.render('dashboard', {
			siteTitle: 'Bishops First Blog',
			submenuTitle: 'Admin Dashboard',
			user,
		});
	}

	static showAdminBlogPostList(options) {
		const blogPostService = options.blogPostService;
		const configurations = options.configurations;
		const formatDate = options.formatDate;

		return async (req, res) => {
			try {
				const user = req.user;
				if (!configurations['db-file']) {
					res.render('postList', {
						siteTitle: 'Bishops First Blog',
						submenuTitle: 'Admin Post List',
						error:
							'No Database file provided. Please provide a valid file to continue...',
						user,
						blogPosts: '',
					});
					return;
				}

				const blogPosts = await blogPostService.getAllBlogPosts();

				blogPosts.forEach((post) => {
					post.published_at =
						post.published_at === 'N/A'
							? post.published_at
							: formatDate(
									post.published_at,
									configurations.dateFormat
							  );
					post.modified_at = formatDate(
						post.modified_at,
						configurations.dateFormat
					);
					post.created_at = formatDate(
						post.created_at,
						configurations.dateFormat
					);
				});

				res.render('postList', {
					siteTitle: 'Bishops First Blog',
					submenuTitle: 'Admin Post List',
					user,
					blogPosts,
				});
			} catch (err) {
				console.error(err);
			}
		};
	}

	static showEditBlogPost(options) {
		const blogPostService = options.blogPostService;
		const configurations = options.configurations;
		const formatDate = options.formatDate;

		return async (req, res) => {
			const user = req.user;
			const blogPostID = Number(req.params.id);

			if (!configurations['db-file']) {
				res.render('editPost', {
					siteTitle: 'Bishops First Blog',
					submenuTitle: 'Edit Post',
					error:
						'No Database file provided. Please provide a valid file to continue...',
					user,
					blogPosts: '',
				});
				return;
			}

			const blogPost = await blogPostService.getBlogPostById(blogPostID);

			blogPost.published_at = formatDate(
				blogPost.published_at,
				configurations.dateFormat
			);
			blogPost.modified_at = formatDate(
				blogPost.modified_at,
				configurations.dateFormat
			);
			blogPost.created_at = formatDate(
				blogPost.created_at,
				configurations.dateFormat
			);

			res.render('editPost', {
				siteTitle: 'Bishops First Blog',
				submenuTitle: 'Edit Post',
				user,
				blogPost,
			});
		};
	}

	static modifyBlogPost(options) {
		const blogPostService = options.blogPostService;
		return async (req, res) => {
			const blogPostID = Number(req.params.id);
			const modifiedBlogPostData = {};
			({
				title: modifiedBlogPostData.title,
				content: modifiedBlogPostData.content,
				slug: modifiedBlogPostData.slug,
				draft: modifiedBlogPostData.draft,
			} = req.body);
			modifiedBlogPostData.id = blogPostID;

			await blogPostService.modifyPost(modifiedBlogPostData);

			res.redirect('/admin/list');
		};
	}

	static showConfigurations(options) {
		const archiveConfigService = options.archiveConfigService;
		const configurations = options.configurations;
		const themeService = options.themeService;
		return async (req, res) => {
			let layouts;
			const user = req.user;

			if (configurations['db-file']) {
				layouts = await archiveConfigService.getAllLayouts();
			}

			if (user.role === 'author') {
				res.redirect('/admin');
				return;
			}

			const themes = themeService.getAllThemes().map((theme) => {
				const tempObj = {};
				tempObj.name = theme;
				tempObj.default = configurations.theme === theme ? true : false;
				return tempObj;
			});

			if (req.query.error === 'invalid-file') {
				const error = 'Invalid file uploaded!';
				res.render('configurations', {
					siteTitle: 'Bishops First Blog',
					submenuTitle: 'Admin Configurations',
					user,
					layouts,
					dateFormat: configurations.dateFormat,
					dbFile: configurations['db-file'],
					themes,
					error,
				});
				return;
			}

			res.render('configurations', {
				siteTitle: 'Bishops First Blog',
				submenuTitle: 'Admin Configurations',
				user,
				layouts,
				dateFormat: configurations.dateFormat,
				dbFile: configurations['db-file'],
				themes,
			});
		};
	}

	static saveConfigurations(options) {
		const configurations = options.configurations;
		const archiveConfigService = options.archiveConfigService;
		const themeService = options.themeService;
		return async (req, res) => {
			const {
				archive_layout,
				date_format,
				database_file,
				theme_name,
			} = req.body;

			configurations.dateFormat = date_format
				? date_format
				: configurations.dateFormat;

			configurations['db-file'] = fs.existsSync(DBPath + database_file)
				? database_file
				: '';

			if (archive_layout) {
				await archiveConfigService.modifyLayout(archive_layout);
			}

			themeService.applyTheme(theme_name);
			configurations.theme = theme_name;

			if (req.files) {
				await req.files.theme_zip.mv(
					path.join(
						__dirname,
						'..',
						'themes',
						req.files.theme_zip.name
					)
				);

				const zip = new AdmZip(
					path.join(
						__dirname,
						'..',
						'themes',
						req.files.theme_zip.name
					)
				);

				if (
					req.files.theme_zip.mimetype !==
						'application/x-zip-compressed' ||
					!zip.getEntries()[0].isDirectory ||
					zip.getEntries()[1].name !== 'bootstrap.css' ||
					zip.getEntries().length !== 2
				) {
					fs.unlinkSync(
						path.join(
							__dirname,
							'..',
							'themes',
							req.files.theme_zip.name
						)
					);
					res.redirect('/admin/config?error=invalid-file');
					return;
				}

				zip.extractAllTo(path.join(__dirname, '..', 'themes'));
				fs.unlinkSync(
					path.join(
						__dirname,
						'..',
						'themes',
						req.files.theme_zip.name
					)
				);
			}

			res.redirect('/admin');
		};
	}

	static showAccountList(options) {
		const accountService = options.accountService;
		const configurations = options.configurations;

		return async (req, res) => {
			try {
				const user = req.user;
				if (!configurations['db-file']) {
					res.render('accountList', {
						siteTitle: 'Bishops First Blog',
						submenuTitle: 'Admin Account List',
						error:
							'No Database file provided. Please provide a valid file to continue...',
						user,
						accounts: '',
					});
					return;
				}
				if (user.role === 'author') {
					res.redirect('/admin');
					return;
				}
				const accounts = await accountService.getAllAccounts();

				res.render('accountList', {
					siteTitle: 'Bishops First Blog',
					submenuTitle: 'Admin Account List',
					user,
					accounts,
				});
			} catch (err) {
				console.error(err);
			}
		};
	}

	static showNewAccount(options) {
		const configurations = options.configurations;
		const accountService = options.accountService;

		return async (req, res) => {
			try {
				const user = req.user;
				if (!configurations['db-file']) {
					res.render('newAccount', {
						siteTitle: 'Bishops First Blog',
						submenuTitle: 'New Account',
						error:
							'No Database file provided. Please provide a valid file to continue...',
						user,
					});
					return;
				}
				if (user.role === 'author') {
					res.redirect('/admin');
					return;
				}
				const roles = await accountService.getAllRoles();

				res.render('newAccount', {
					siteTitle: 'Bishops First Blog',
					submenuTitle: 'New Account',
					user,
					roles,
				});
			} catch (err) {
				console.error(err);
			}
		};
	}

	static addNewAccount(options) {
		const accountService = options.accountService;

		return async (req, res) => {
			try {
				const {
					user_name,
					user_password,
					user_email,
					roles,
				} = req.body;

				const newAccount = await accountService.addNewAccount({
					user_name,
					user_password,
					user_email,
					roles,
				});

				if (!newAccount) {
					throw new Error("Can't create new Account!");
				}

				res.redirect('/admin/accounts');
			} catch (err) {
				console.error(err);
			}
		};
	}

	static showEditAccount(options) {
		const configurations = options.configurations;
		const accountService = options.accountService;

		return async (req, res) => {
			try {
				const user = req.user;
				if (!configurations['db-file']) {
					res.render('editAccount', {
						siteTitle: 'Bishops First Blog',
						submenuTitle: 'Edit Account',
						error:
							'No Database file provided. Please provide a valid file to continue...',
						username: user.username,
					});
					return;
				}
				if (user.role === 'author') {
					res.redirect('/admin');
					return;
				}
				const accountId = Number(req.params.id);

				const editedUser = await accountService.getAccountById(
					accountId
				);

				const roles = await accountService.getAllRoles();

				res.render('editAccount', {
					siteTitle: 'Bishops First Blog',
					submenuTitle: 'Edit Account',
					user,
					editedUser,
					roles,
				});
			} catch (err) {
				console.error(err);
			}
		};
	}

	static editAccount(options) {
		const accountService = options.accountService;

		return async (req, res) => {
			try {
				const {
					user_name,
					user_password,
					user_email,
					roles,
				} = req.body;
				const accountId = Number(req.params.id);

				const editedAccount = await accountService.editAccount({
					id: accountId,
					user_name,
					user_password,
					user_email,
					roles,
				});

				if (!editedAccount) {
					throw new Error("Can't modify Account!");
				}

				res.redirect('/admin/accounts');
			} catch (err) {
				console.error(err);
			}
		};
	}
}

module.exports = AdminController;
