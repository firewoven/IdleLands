"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var adventure_log_1 = require("../shared/adventure-log");
var game_state_1 = require("./game-state");
var _emitter_1 = require("../plugins/players/_emitter");
var player_migration_1 = require("../plugins/players/player.migration");
var player_handleip_1 = require("../plugins/players/player.handleip");
var playerlist_updater_1 = require("../shared/playerlist-updater");
var messagecreator_1 = require("../plugins/events/messagecreator");
var logger_1 = require("../shared/logger");
_emitter_1.emitter.on('error', function (e) {
    logger_1.Logger.error('PlayerEmitter', e);
});
_emitter_1.emitter.on('player:semilogin', function (_a) {
    var playerName = _a.playerName, fromIp = _a.fromIp;
    var player = game_state_1.GameState.getInstance().getPlayer(playerName);
    player_handleip_1.handleIp(player, fromIp);
    player.quickLogin();
    player.update();
    player.$shard = process.env.INSTANCE_NUMBER;
    playerlist_updater_1.AllPlayers(playerName);
});
_emitter_1.emitter.on('player:login', function (_a) {
    var playerName = _a.playerName, fromIp = _a.fromIp;
    return __awaiter(_this, void 0, void 0, function () {
        var player;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, game_state_1.GameState.getInstance().addPlayer(playerName)];
                case 1:
                    player = _a.sent();
                    if (!player)
                        return [2 /*return*/];
                    player_migration_1.migrate(player);
                    player_handleip_1.handleIp(player, fromIp);
                    player.$shard = process.env.INSTANCE_NUMBER;
                    player.update();
                    player.$statistics.incrementStat('Game.Logins');
                    playerlist_updater_1.AllPlayers(playerName);
                    playerlist_updater_1.PlayerLogin(playerName);
                    if (player.$statistics.getStat('Game.Logins') === 1) {
                        player.$statistics.incrementStat("Character.Professions." + player.professionName);
                        adventure_log_1.AdventureLog({
                            text: messagecreator_1.MessageParser.stringFormat('Welcome to Idliathlia, the world of IdleLands! Check out our new player information guide on the wiki and enjoy your stay!'),
                            type: adventure_log_1.MessageTypes.SINGLE,
                            targets: [playerName],
                            extraData: { link: 'https://github.com/IdleLands/IdleLands/wiki/New-Player-Information' },
                            category: adventure_log_1.MessageCategories.META
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
});
_emitter_1.emitter.on('player:register', function (_a) {
    var playerName = _a.playerName, fromIp = _a.fromIp;
    return __awaiter(_this, void 0, void 0, function () {
        var player;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, game_state_1.GameState.getInstance().addPlayer(playerName)];
                case 1:
                    player = _a.sent();
                    if (!player)
                        return [2 /*return*/];
                    player_handleip_1.handleIp(player, fromIp);
                    player.update();
                    player.$statistics.incrementStat('Game.Logins');
                    player.$statistics.incrementStat("Character.Professions." + player.professionName);
                    player.$shard = process.env.INSTANCE_NUMBER;
                    playerlist_updater_1.AllPlayers(playerName);
                    playerlist_updater_1.PlayerLogin(playerName);
                    return [2 /*return*/];
            }
        });
    });
});
_emitter_1.emitter.on('player:logout', function (_a) {
    var playerName = _a.playerName;
    playerlist_updater_1.PlayerLogout(playerName);
    game_state_1.GameState.getInstance().delPlayer(playerName);
});
_emitter_1.emitter.on('player:levelup', function (_a) {
    var player = _a.player;
    playerlist_updater_1.PlayerUpdateAll(player.name, ['level']);
    adventure_log_1.AdventureLog({
        text: messagecreator_1.MessageParser.stringFormat("%player has reached experience level " + player.level + "!", player),
        type: adventure_log_1.MessageTypes.SINGLE,
        category: adventure_log_1.MessageCategories.LEVELUP,
        targets: [player.name],
        targetsDisplay: [player.fullname]
    });
});
_emitter_1.emitter.on('player:changelevel', function (_a) {
    var player = _a.player;
    playerlist_updater_1.PlayerUpdateAll(player.name, ['level']);
    player.update();
});
_emitter_1.emitter.on('player:changegender', function (_a) {
    var player = _a.player;
    playerlist_updater_1.PlayerUpdateAll(player.name, ['gender']);
    player.update();
});
_emitter_1.emitter.on('player:changetitle', function (_a) {
    var player = _a.player;
    playerlist_updater_1.PlayerUpdateAll(player.name, ['title']);
    player.update();
});
_emitter_1.emitter.on('player:changename', function (_a) {
    var player = _a.player;
    playerlist_updater_1.PlayerUpdateAll(player.name, ['name', 'nameEdit']);
    player.update();
});
_emitter_1.emitter.on('player:achieve', function (_a) {
    var player = _a.player, achievements = _a.achievements;
    player.recalculateStats();
    player.$updateAchievements = true;
    _.each(achievements, function (achievement) {
        adventure_log_1.AdventureLog({
            text: messagecreator_1.MessageParser.stringFormat("%player has achieved " + achievement.name + (achievement.tier > 1 ? " tier " + achievement.tier : '') + "!", player),
            type: adventure_log_1.MessageTypes.SINGLE,
            category: adventure_log_1.MessageCategories.ACHIEVEMENT,
            targets: [player.name],
            targetsDisplay: [player.fullname]
        });
    });
});
_emitter_1.emitter.on('player:collectible', function (_a) {
    var player = _a.player, collectible = _a.collectible;
    var extraData = {
        collectible: collectible.name
    };
    player.$updateCollectibles = true;
    adventure_log_1.AdventureLog({
        text: messagecreator_1.MessageParser.stringFormat("%player stumbled across a rare, shiny, and collectible %collectible in " + player.map + " - " + player.mapRegion + "!", player, extraData),
        type: adventure_log_1.MessageTypes.SINGLE,
        category: adventure_log_1.MessageCategories.EXPLORE,
        targets: [player.name],
        targetsDisplay: [player.fullname]
    });
});
_emitter_1.emitter.on('player:changeclass', function (_a) {
    var player = _a.player, choice = _a.choice;
    player.$statistics.incrementStat("Character.Professions." + choice.extraData.professionName);
    playerlist_updater_1.PlayerUpdateAll(player.name, ['professionName']);
    adventure_log_1.AdventureLog({
        text: messagecreator_1.MessageParser.stringFormat("%player has met with " + choice.extraData.trainerName + " and became a " + choice.extraData.professionName + "!", player),
        type: adventure_log_1.MessageTypes.SINGLE,
        category: adventure_log_1.MessageCategories.PROFESSION,
        targets: [player.name],
        targetsDisplay: [player.fullname]
    });
});
_emitter_1.emitter.on('player:transfer', function (_a) {
    var player = _a.player, dest = _a.dest;
    playerlist_updater_1.PlayerUpdateAll(player.name, ['name', 'map']);
    var message = '';
    switch (dest.movementType) {
        case 'ascend':
            message = "%player has ascended to " + dest.destName + ".";
            break;
        case 'descend':
            message = "%player has descended to " + dest.destName + ".";
            break;
        case 'fall':
            message = "%player has fallen to " + dest.destName + " from " + dest.fromName + ".";
            break;
        case 'teleport':
            message = "%player has been teleported to " + dest.destName + " from " + dest.fromName + ".";
            break;
    }
    if (dest.customMessage) {
        message = dest.customMessage.split('%playerName').join(player.fullname).split('%destName').join(dest.destName);
    }
    adventure_log_1.AdventureLog({
        text: messagecreator_1.MessageParser.stringFormat(message, player),
        type: adventure_log_1.MessageTypes.SINGLE,
        category: adventure_log_1.MessageCategories.EXPLORE,
        targets: [player.name],
        targetsDisplay: [player.fullname],
        map: player.map,
        x: player.x,
        y: player.y
    });
});
_emitter_1.emitter.on('player:event', function (_a) {
    var affected = _a.affected, category = _a.category, eventText = _a.eventText, extraData = _a.extraData;
    adventure_log_1.AdventureLog({
        text: eventText,
        extraData: extraData,
        type: adventure_log_1.MessageTypes.SINGLE,
        category: category,
        targets: _.map(affected, 'name'),
        targetsDisplay: _.map(affected, 'fullname')
    });
});
