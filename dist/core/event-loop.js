"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var logger_1 = require("../shared/logger");
var game_state_1 = require("./game-state");
var settings_1 = require("../static/settings");
var playerlist_updater_1 = require("../shared/playerlist-updater");
logger_1.Logger.info('Core', 'Starting emitters.');
require("./emitter-watchers");
logger_1.Logger.info('Core', 'Loading assets.');
require("../shared/asset-loader");
logger_1.Logger.info('Core', 'Loading events.');
require("../plugins/events/eventhandler");
logger_1.Logger.info('Redis', 'Connecting to Redis (if possible).');
require("../plugins/scaler/redis");
logger_1.Logger.info('Core', 'Creating game state.');
game_state_1.GameState.getInstance();
logger_1.Logger.info('Core', 'Starting event loop.');
var timerDelay = settings_1.SETTINGS.timeframeSeconds * (process.env.NODE_ENV === 'production' ? 200 : 10);
var flagNextTurn = function (player) {
    player.$nextTurn = Date.now() + ((process.env.NODE_ENV === 'production' ? 1000 : 10) * settings_1.SETTINGS.timeframeSeconds);
};
var canTakeTurn = function (now, player) {
    return player.$nextTurn - now <= 0;
};
var playerInterval = function () {
    logger_1.Logger.silly('EventLoop:PlayerInterval', "Server: " + process.env.INSTANCE_NUMBER);
    var gameState = game_state_1.GameState.getInstance();
    var players = gameState.getPlayers();
    var now = Date.now();
    var ranPlayerNames = {};
    var playerTakeTurn = function (player) {
        if (!player.$nextTurn)
            flagNextTurn(player);
        if (!canTakeTurn(now, player))
            return;
        ranPlayerNames[player.name] = true;
        flagNextTurn(player);
        player.takeTurn();
    };
    _.each(players, playerTakeTurn);
    playerlist_updater_1.SomePlayersPostMove(ranPlayerNames);
};
var runPlayerInterval = function () {
    playerInterval();
    setTimeout(function () {
        process.nextTick(runPlayerInterval);
    }, timerDelay);
};
runPlayerInterval();
if (global.gc) {
    logger_1.Logger.info('Core', 'Running GC every 30 seconds.');
    setInterval(global.gc, 30000);
}
