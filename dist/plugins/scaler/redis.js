"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var NRP = require("node-redis-pubsub");
var nodeCleanup = require("node-cleanup");
var game_state_1 = require("../../core/game-state");
var playerlist_updater_1 = require("../../shared/playerlist-updater");
var sendmessage_1 = require("../chat/sendmessage");
var commands_1 = require("../gm/commands");
var server_1 = require("../../primus/server");
var emitter_watchers_1 = require("../../core/emitter-watchers");
var logger_1 = require("../../shared/logger");
var redisUrl = process.env.REDIS_URL;
var INSTANCE = _.isNaN(+process.env.INSTANCE_NUMBER) ? 0 : +process.env.INSTANCE_NUMBER;
var redisInstance = redisUrl ? new NRP({
    url: redisUrl
}) : null;
var _emit = function (event, data) {
    if (data === void 0) { data = {}; }
    if (!redisInstance)
        return;
    data._instance = INSTANCE;
    redisInstance.emit(event, data);
};
nodeCleanup(function () {
    _emit('server:forcekill');
    setTimeout(function () {
        process.exit(0);
    }, 1000);
    return false;
});
var otherPlayers = [];
if (redisInstance) {
    logger_1.Logger.info('Redis', "Am instance " + INSTANCE);
    redisInstance.on('server:forcekill', function (_a) {
        var _instance = _a._instance;
        otherPlayers = _.reject(otherPlayers, function (p) { return p.$shard === _instance; });
    });
    redisInstance.on('player:forcelogout', function (_a) {
        var playerName = _a.playerName, _instance = _a._instance;
        if (INSTANCE === _instance)
            return;
        logger_1.Logger.silly('Redis', "Redis " + INSTANCE + " acting on forcelogout from " + _instance, playerName);
        server_1.primus.delPlayer(playerName);
        emitter_watchers_1.emitter.emit('player:logout', { playerName: playerName });
        playerlist_updater_1.PlayerLogoutData(playerName);
        otherPlayers = _.without(otherPlayers, _.find(otherPlayers, { name: playerName }));
    });
    redisInstance.on('player:logout', function (_a) {
        var playerName = _a.playerName, _instance = _a._instance;
        if (INSTANCE === _instance)
            return;
        logger_1.Logger.silly('Redis', "Redis " + INSTANCE + " acting on logout from " + _instance, playerName);
        playerlist_updater_1.PlayerLogoutData(playerName);
        otherPlayers = _.without(otherPlayers, _.find(otherPlayers, { name: playerName }));
    });
    redisInstance.on('player:login', function (_a) {
        var playerName = _a.playerName, data = _a.data, _instance = _a._instance;
        if (INSTANCE === _instance)
            return;
        logger_1.Logger.silly('Redis', "Redis " + INSTANCE + " acting on login from " + _instance, playerName);
        playerlist_updater_1.PlayerLoginData(playerName, data);
        otherPlayers.push(data);
    });
    redisInstance.on('player:update', function (_a) {
        var data = _a.data, _instance = _a._instance;
        if (INSTANCE === _instance)
            return;
        playerlist_updater_1.PlayerUpdateAllData(data);
        _.merge(_.find(otherPlayers, { name: data.name }), data);
    });
    redisInstance.on('global:move', function (_a) {
        var data = _a.data, _instance = _a._instance;
        if (INSTANCE === _instance)
            return;
        playerlist_updater_1.SomePlayersPostMoveData(data);
    });
    redisInstance.on('chat:send', function (_a) {
        var message = _a.message, isExternal = _a.isExternal, _instance = _a._instance;
        if (INSTANCE === _instance && !isExternal)
            return;
        sendmessage_1.sendMessage(message, isExternal);
    });
    redisInstance.on('festival:add', function (_a) {
        var festival = _a.festival;
        game_state_1.GameState.getInstance().addFestivalData(festival, false);
    });
    redisInstance.on('festival:cancel', function (_a) {
        var festivalId = _a.festivalId;
        game_state_1.GameState.getInstance().cancelFestivalData(festivalId);
    });
    redisInstance.on('gm:teleport', function (_a) {
        var playerName = _a.playerName, opts = _a.opts;
        commands_1.GMCommands.teleport(playerName, opts, false);
    });
    redisInstance.on('gm:togglemod', function (_a) {
        var playerName = _a.playerName;
        commands_1.GMCommands.toggleMod(playerName, false);
    });
    redisInstance.on('gm:toggleachievement', function (_a) {
        var playerName = _a.playerName, achievement = _a.achievement;
        commands_1.GMCommands.toggleAchievement(playerName, achievement, false);
    });
    redisInstance.on('gm:setlevel', function (_a) {
        var playerName = _a.playerName, level = _a.level;
        commands_1.GMCommands.setLevel(playerName, level, false);
    });
    redisInstance.on('gm:giveitem', function (_a) {
        var playerName = _a.playerName, item = _a.item;
        commands_1.GMCommands.giveItem(playerName, item, false);
    });
    redisInstance.on('gm:giveevent', function (_a) {
        var playerName = _a.playerName, event = _a.event;
        commands_1.GMCommands.giveEvent(playerName, event, false);
    });
    redisInstance.on('gm:givegold', function (_a) {
        var playerName = _a.playerName, gold = _a.gold;
        commands_1.GMCommands.giveGold(playerName, gold, false);
    });
    redisInstance.on('gm:giveilp', function (_a) {
        var playerName = _a.playerName, ilp = _a.ilp;
        commands_1.GMCommands.giveILP(playerName, ilp, false);
    });
    redisInstance.on('gm:setstat', function (_a) {
        var playerName = _a.playerName, stat = _a.stat, value = _a.value;
        commands_1.GMCommands.setStat(playerName, stat, value, false);
    });
    redisInstance.on('gm:ban', function (_a) {
        var playerName = _a.playerName;
        commands_1.GMCommands.ban(playerName, false);
    });
    redisInstance.on('gm:mute', function (_a) {
        var playerName = _a.playerName;
        commands_1.GMCommands.mute(playerName, false);
    });
    redisInstance.on('gm:pardon', function (_a) {
        var playerName = _a.playerName;
        commands_1.GMCommands.pardon(playerName, false);
    });
}
exports.GetRedisPlayers = function () {
    return otherPlayers;
};
exports.PlayerForceLogout = function (playerName) {
    logger_1.Logger.silly('Redis', "Redis " + INSTANCE + " emitting forcelogout", playerName);
    _emit('player:forcelogout', { playerName: playerName });
};
exports.PlayerLogoutRedis = function (playerName) {
    logger_1.Logger.silly('Redis', "Redis " + INSTANCE + " emitting logout", playerName);
    _emit('player:logout', { playerName: playerName });
};
exports.PlayerLoginRedis = function (playerName, data) {
    logger_1.Logger.silly('Redis', "Redis " + INSTANCE + " emitting login", playerName);
    _emit('player:login', { playerName: playerName, data: data });
};
exports.PlayerUpdateAllRedis = function (data) {
    _emit('player:update', { data: data });
};
exports.SomePlayersPostMoveRedis = function (data) {
    _emit('global:move', { data: data });
};
exports.SendChatMessage = function (message, isExternal) {
    if (!redisInstance) {
        if (isExternal) {
            sendmessage_1.sendMessage(message, isExternal);
        }
        return;
    }
    _emit('chat:send', { message: message, isExternal: isExternal });
};
exports.AddFestivalRedis = function (festival) {
    _emit('festival:add', { festival: festival });
};
exports.CancelFestivalRedis = function (festivalId) {
    _emit('festival:cancel', { festivalId: festivalId });
};
exports.TeleportRedis = function (playerName, opts) {
    _emit('gm:teleport', { playerName: playerName, opts: opts });
};
exports.ToggleModRedis = function (playerName) {
    _emit('gm:togglemod', { playerName: playerName });
};
exports.ToggleAchievementRedis = function (playerName, achievement) {
    _emit('gm:toggleachievement', { playerName: playerName, achievement: achievement });
};
exports.SetLevelRedis = function (playerName, level) {
    _emit('gm:setlevel', { playerName: playerName, level: level });
};
exports.GiveItemRedis = function (playerName, item) {
    _emit('gm:giveitem', { playerName: playerName, item: item });
};
exports.GiveEventRedis = function (playerName, event) {
    _emit('gm:giveevent', { playerName: playerName, event: event });
};
exports.GiveGoldRedis = function (playerName, gold) {
    _emit('gm:givegold', { playerName: playerName, gold: gold });
};
exports.GiveILPRedis = function (playerName, ilp) {
    _emit('gm:giveilp', { playerName: playerName, ilp: ilp });
};
exports.SetStatRedis = function (playerName, stat, value) {
    _emit('gm:setstat', { playerName: playerName, stat: stat, value: value });
};
exports.BanRedis = function (playerName) {
    _emit('gm:ban', { playerName: playerName });
};
exports.MuteRedis = function (playerName) {
    _emit('gm:mute', { playerName: playerName });
};
exports.PardonRedis = function (playerName) {
    _emit('gm:pardon', { playerName: playerName });
};
