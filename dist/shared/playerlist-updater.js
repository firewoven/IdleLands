"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var server_1 = require("../primus/server");
var game_state_1 = require("../core/game-state");
var redis_1 = require("../plugins/scaler/redis");
// these functions pertain to one person logging in and out
exports.AllPlayers = function (playerName) {
    var allPlayers = game_state_1.GameState.getInstance().getPlayersSimple();
    server_1.primus.emitToPlayers([playerName], { playerListOperation: 'set', data: allPlayers.concat(redis_1.GetRedisPlayers()) });
};
exports.PlayerLoginData = function (playerName, data) {
    server_1.primus.forEach(function (spark, next) {
        if (!spark.authToken || spark.authToken.playerName === playerName)
            return next();
        spark.write({ playerListOperation: 'add', data: data });
        next();
    }, function () { });
};
exports.PlayerLogin = function (playerName) {
    var simplePlayerToAdd = game_state_1.GameState.getInstance().getPlayerNameSimple(playerName);
    exports.PlayerLoginData(playerName, simplePlayerToAdd);
    var simplePlayerId = game_state_1.GameState.getInstance().getPlayer(playerName).userId;
    var simpleAddData = _.cloneDeep(simplePlayerToAdd);
    simpleAddData.userId = simplePlayerId;
    redis_1.PlayerLoginRedis(playerName, simpleAddData);
};
exports.PlayerLogoutData = function (playerName) {
    server_1.primus.forEach(function (spark, next) {
        if (!spark.authToken || spark.authToken.playerName === playerName)
            return next();
        spark.write({ playerListOperation: 'del', data: playerName });
        next();
    }, function () { });
};
exports.PlayerLogout = function (playerName) {
    exports.PlayerLogoutData(playerName);
    redis_1.PlayerLogoutRedis(playerName);
};
// these are global updater functions
exports.SomePlayersPostMoveData = function (groupedByMap) {
    server_1.primus.forEach(function (spark, next) {
        if (!spark.authToken)
            return next();
        var player = game_state_1.GameState.getInstance().getPlayer(spark.authToken.playerName);
        if (!player)
            return next();
        var filteredData = groupedByMap[player.map];
        if (!filteredData || !filteredData.length)
            return next();
        spark.write({ playerListOperation: 'updateMass', data: filteredData });
        next();
    }, function () { });
};
exports.SomePlayersPostMove = function (updatedPlayers) {
    if (process.env.IGNORE_OTHER_PLAYER_MOVES)
        return;
    var gameState = game_state_1.GameState.getInstance();
    var data = gameState.getSomePlayersSimple(updatedPlayers, ['x', 'y', 'map']);
    var groupedByMap = _.groupBy(data, 'map');
    exports.SomePlayersPostMoveData(groupedByMap);
    redis_1.SomePlayersPostMoveRedis(groupedByMap);
};
exports.PlayerUpdateAllData = function (data) {
    server_1.primus.forEach(function (spark, next) {
        spark.write({ playerListOperation: 'update', data: data });
        next();
    }, function () { });
};
exports.PlayerUpdateAll = function (playerId, keys) {
    var data = game_state_1.GameState.getInstance().getPlayerNameSimple(playerId, keys, true);
    exports.PlayerUpdateAllData(data);
    redis_1.PlayerUpdateAllRedis(data);
};
