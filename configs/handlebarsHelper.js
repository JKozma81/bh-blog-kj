module.exports = {
	ifeq: function (a, b, opts) {
		if (a === b) {
			return opts.fn(this);
		}
		return opts.inverse(this);
	},
	ifNoteq: function (a, b, options) {
		if (a !== b) {
			return options.fn(this);
		}
		return options.inverse(this);
	},
};
