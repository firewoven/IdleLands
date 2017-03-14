"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eventhandler_1 = require("../events/eventhandler");
var FindItem_1 = require("../events/events/FindItem");
var game_state_1 = require("../../core/game-state");
var _emitter_1 = require("../../plugins/players/_emitter");
var playerlist_updater_1 = require("../../shared/playerlist-updater");
var redis_1 = require("../scaler/redis");
var GMCommands = (function () {
    function GMCommands() {
    }
    GMCommands.ban = function (playerName, propagate) {
        if (propagate === void 0) { propagate = true; }
        var player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.BanRedis(playerName);
        player.isBanned = true;
        player._saveSelf();
        _emitter_1.emitter.emit('player:logout', { playerName: player.name });
    };
    GMCommands.mute = function (playerName, propagate) {
        if (propagate === void 0) { propagate = true; }
        var player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.MuteRedis(playerName);
        player.isMuted = !player.isMuted;
        if (player.isMuted && player.isPardoned)
            player.isPardoned = false;
        player._saveSelf();
        playerlist_updater_1.PlayerUpdateAll(player._id, ['isMuted', 'isPardoned']);
    };
    GMCommands.pardon = function (playerName, propagate) {
        if (propagate === void 0) { propagate = true; }
        var player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.PardonRedis(playerName);
        player.isPardoned = !player.isPardoned;
        if (player.isPardoned && player.isMuted)
            player.isMuted = false;
        playerlist_updater_1.PlayerUpdateAll(player._id, ['isMuted', 'isPardoned']);
    };
    GMCommands.teleport = function (playerName, _a, propagate) {
        var map = _a.map, x = _a.x, y = _a.y, toLoc = _a.toLoc;
        if (propagate === void 0) { propagate = true; }
        var player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.TeleportRedis(playerName, { map: map, x: x, y: y, toLoc: toLoc });
        player.$playerMovement._doTeleport(player, { map: map, x: x, y: y, toLoc: toLoc });
    };
    GMCommands.toggleMod = function (playerName, propagate) {
        if (propagate === void 0) { propagate = true; }
        var player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.ToggleModRedis(playerName);
        player.isMod = !player.isMod;
        player._saveSelf();
    };
    GMCommands.toggleAchievement = function (playerName, achievement, propagate) {
        if (propagate === void 0) { propagate = true; }
        var player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.ToggleAchievementRedis(playerName, achievement);
        player.permanentAchievements = player.permanentAchievements || {};
        player.permanentAchievements[achievement] = !player.permanentAchievements[achievement];
        player._checkAchievements();
        player._save();
    };
    GMCommands.setLevel = function (playerName, level, propagate) {
        if (propagate === void 0) { propagate = true; }
        var player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.SetLevelRedis(playerName, level);
        player._level.set(level - 1);
        player.levelUp();
    };
    GMCommands.giveEvent = function (playerName, event, propagate) {
        if (propagate === void 0) { propagate = true; }
        var player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.GiveItemRedis(playerName, event);
        eventhandler_1.EventHandler.doEvent(player, event);
    };
    GMCommands.giveItem = function (playerName, item, propagate) {
        if (propagate === void 0) { propagate = true; }
        var player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.GiveEventRedis(playerName, item);
        FindItem_1.FindItem.operateOn(player, null, item);
    };
    GMCommands.giveGold = function (playerName, gold, propagate) {
        if (propagate === void 0) { propagate = true; }
        var player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.GiveGoldRedis(playerName, gold);
        player.gold += gold;
    };
    GMCommands.giveILP = function (playerName, ilp, propagate) {
        if (propagate === void 0) { propagate = true; }
        var player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.GiveILPRedis(playerName, ilp);
        player.$premium.addIlp(ilp);
        player._updatePremium();
    };
    GMCommands.setStat = function (playerName, stat, value, propagate) {
        if (propagate === void 0) { propagate = true; }
        var player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player && propagate)
            return redis_1.SetStatRedis(playerName, stat, value);
        player.$statistics.setStat(stat, value);
        player.$statistics.save();
        player._updateStatistics();
    };
    GMCommands.createFestival = function (festival) {
        game_state_1.GameState.getInstance().addFestival(festival);
    };
    GMCommands.cancelFestival = function (festivalId) {
        game_state_1.GameState.getInstance().cancelFestival(festivalId);
    };
    return GMCommands;
}());
exports.GMCommands = GMCommands;
