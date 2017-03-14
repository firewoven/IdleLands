"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var IRC = require("squelch-client");
var settings_1 = require("../../static/settings");
var logger_1 = require("../../shared/logger");
var redis_1 = require("../scaler/redis");
var isProd = process.env.NODE_ENV === 'production' && !process.env.EXT_CHAT;
var _a = settings_1.SETTINGS.chatConfig.irc, server = _a.server, nick = _a.nick, channel = _a.channel;
var ExternalChatMechanism = (function () {
    function ExternalChatMechanism() {
    }
    ExternalChatMechanism.prototype.connect = function (primus, sendRoom) {
        var _this = this;
        if (!isProd)
            return;
        if (!primus) {
            logger_1.Logger.error('ExtChat:IRC', new Error('Primus failed to inject correctly!'));
            return;
        }
        logger_1.Logger.info('ExtChat:IRC', "Connecting to " + server + channel + " as " + nick + "...");
        this.client = new IRC({
            server: server,
            nick: nick,
            channels: [channel],
            autoConnect: false
        });
        this.client.connect().then(function () {
            logger_1.Logger.info('ExtChat:IRC', 'Connected!');
            _this.isConnected = true;
            _this.client.on('msg', function (_a) {
                var from = _a.from, to = _a.to, msg = _a.msg;
                if (to !== '##idlebot')
                    return;
                if (_.includes(from, '<web:') || _.includes(msg, '<web:'))
                    return;
                var messageObject = {
                    text: msg,
                    playerName: "<irc:" + from + ">",
                    timestamp: Date.now(),
                    channel: 'General',
                    route: sendRoom,
                    event: 'plugin:chat:sendmessage'
                };
                redis_1.SendChatMessage(messageObject, true);
            });
        });
    };
    ExternalChatMechanism.prototype.sendMessage = function (msgData) {
        if (!isProd || !this.isConnected)
            return;
        this.client.msg(channel, "<web:" + msgData.playerName + " [" + (msgData.title || 'no title') + "] [" + msgData.level + "]> " + msgData.text);
    };
    return ExternalChatMechanism;
}());
exports.ExternalChatMechanism = ExternalChatMechanism;
