"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var server_1 = require("../../primus/server");
exports.sendMessage = function (messageObject, fromExtChat) {
    if (fromExtChat === void 0) { fromExtChat = false; }
    if (_.includes(messageObject.route, ':pm:')) {
        var users_1 = messageObject.route.split(':')[2].split('|');
        server_1.primus.forEach(function (spark, next) {
            if (!_.includes(users_1, spark.playerName))
                return next();
            spark.write(messageObject);
            next();
        }, function () { });
    }
    else {
        server_1.primus.room(messageObject.route).write(messageObject);
        if (messageObject.route === 'chat:channel:General' && server_1.primus.extChat && !fromExtChat) {
            server_1.primus.extChat.sendMessage(messageObject);
        }
    }
};
