const sessions = [];

class SessionServices {
  constructor(sessions) {
    this.sessions = sessions;
  }

  createSession(user) {
    const newSession = {
      id: this.sessions.length + 1,
      user
    };
    this.sessions.push(newSession);
    return newSession.id;
  }

  getSession(id) {
    return this.sessions.find(session => session.id === id);
  }

  deleteSession(id) {
    this.sessions = this.sessions.filter(session => session.id !== Number(id));
    return Number(id);
  }
}

module.exports = { SessionServices, sessions };
