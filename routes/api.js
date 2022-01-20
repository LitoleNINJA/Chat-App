const Auth = require('../server/http/controllers/auth');
const Group = require('../server/http/controllers/group');
const Message = require('../server/http/controllers/message');
const User = require('../server/http/middlewares/user');

const api = (app) => {
    app.get('/api/auth/register', Auth.register);
    app.get('/api/auth/login', Auth.login);
    app.get('/api/auth/verify/:token', Auth.verify);

    app.post('/api/messages/', User, Message.sendMessage);
    app.get('/api/messages/:groupId', User, Message.allMessages);
    app.get('/api/group/:userId', User, Group.allGroups);
    app.post('/api/group/', User, Group.createGroup);
}

module.exports = api;