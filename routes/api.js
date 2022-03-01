const Auth = require('../server/http/controllers/auth');
const Group = require('../server/http/controllers/group');
const Message = require('../server/http/controllers/message');
const user = require('../server/http/middlewares/user');

const api = (app) => {
    app.post('/api/auth/register', Auth.register);
    app.post('/api/auth/login', Auth.login);
    app.get('/api/auth/verify/:token', Auth.verify);

    app.post('/api/message', user, Message.sendMessage);
    app.get('/api/message/:groupId', user, Message.allMessages);

    app.get('/api/group', user, Group.allGroups);
    app.post('/api/group', user, Group.createGroup);
    app.get('/api/group/:groupId', user, Group.accessGroup);
    app.post('/api/group/:groupId', user, Group.addToGroup);
    app.put('/api/group/:groupId', user, Group.renameGroup);
}

module.exports = api;