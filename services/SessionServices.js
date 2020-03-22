class SessionServices {
	static sessions = [];

	static createSession(user) {
		const newSession = {
			id: SessionServices.sessions.length + 1,
			user
		};
		SessionServices.sessions.push(newSession);
		return newSession.id;
	}

	static getSession(id) {
		return SessionServices.sessions.find(session => session.id === id);
	}

	static deleteSession(id) {
		SessionServices.sessions = SessionServices.sessions.filter(
			session => session.id !== Number(id)
		);
		return Number(id);
	}
}

module.exports = SessionServices;
