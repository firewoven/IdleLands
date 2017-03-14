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
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var world_1 = require("./world/world");
var festivals_1 = require("../plugins/festivals/festivals");
var logger_1 = require("../shared/logger");
var di_wrapper_1 = require("../shared/di-wrapper");
var messages_1 = require("../static/messages");
var player_load_1 = require("../plugins/players/player.load");
var UPDATE_KEYS = ['x', 'y', 'map', 'gender', 'professionName', 'level', 'name', 'title'];
var EXTRA_KEYS = ['_id', 'nameEdit', 'isMuted', 'isPardoned', 'isMod', 'name', '$shard', '$currentIp', 'ascensionLevel'];
var redis_1 = require("../plugins/scaler/redis");
var GameStateInstance = null;
var GameState = (function () {
    function GameState() {
        if (GameStateInstance) {
            throw new Error('Can only instantiate GameState once!');
        }
        this.players = [];
        this.playerLoad = di_wrapper_1.constitute(player_load_1.PlayerLoad);
        this.parties = {};
        this.playerTimeouts = {};
        logger_1.Logger.info('GameState', 'Creating world.');
        this.world = di_wrapper_1.constitute(world_1.World);
        logger_1.Logger.info('GameState', 'Loading festivals.');
        this.festivalContainer = di_wrapper_1.constitute(festivals_1.Festivals);
    }
    GameState.prototype.cancelFestivalData = function (festivalId) {
        this.festivalContainer.removeFestivalById(festivalId);
    };
    GameState.prototype.cancelFestival = function (festivalId) {
        this.cancelFestivalData(festivalId);
        redis_1.CancelFestivalRedis(festivalId);
    };
    GameState.prototype.addFestivalData = function (festival, insertIntoDb) {
        if (insertIntoDb === void 0) { insertIntoDb = true; }
        this.festivalContainer.addFestival(festival, insertIntoDb);
    };
    GameState.prototype.addFestival = function (festival) {
        this.addFestivalData(festival);
        redis_1.AddFestivalRedis(festival);
    };
    GameState.prototype.hasFestival = function (playerName) {
        return this.festivalContainer.hasFestival(playerName);
    };
    Object.defineProperty(GameState.prototype, "festivals", {
        get: function () {
            return this.festivalContainer.festivals;
        },
        enumerable: true,
        configurable: true
    });
    GameState.prototype._hasTimeout = function (playerName) {
        return this.playerTimeouts[playerName];
    };
    GameState.prototype._setTimeout = function (playerName, timeoutId) {
        if (this.playerTimeouts[playerName]) {
            clearTimeout(this.playerTimeouts[playerName]);
        }
        this.playerTimeouts[playerName] = timeoutId;
    };
    GameState.prototype._clearTimeout = function (playerName) {
        clearTimeout(this.playerTimeouts[playerName]);
        delete this.playerTimeouts[playerName];
    };
    GameState.prototype.getParty = function (partyName) {
        return this.parties[partyName];
    };
    GameState.getInstance = function () {
        if (GameStateInstance) {
            return GameStateInstance;
        }
        GameStateInstance = new GameState();
        return GameStateInstance;
    };
    GameState.prototype.reAddPlayersInOrder = function (players) {
        this.players = _.reject(this.players, function (player) { return _.includes(_.map(players, 'name'), player.name); });
        (_a = this.players).push.apply(_a, _.filter(players, function (player) { return player.isPlayer; }));
        var _a;
    };
    GameState.prototype.addPlayer = function (playerName) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.getPlayer(playerName))
                    return [2 /*return*/, resolve(false)];
                this.retrievePlayerFromDb(playerName)
                    .then(function (player) {
                    if (!player) {
                        return reject({ msg: messages_1.MESSAGES.NO_PLAYER });
                    }
                    player.choices = _.reject(player.choices, function (c) { return c.event === 'Party' || c.event === 'PartyLeave'; });
                    _this.players.push(player);
                    resolve(player);
                });
                return [2 /*return*/];
            });
        }); });
    };
    GameState.prototype.delPlayer = function (playerName) {
        var remPlayer = _.find(this.players, { name: playerName });
        if (!remPlayer)
            return;
        this.players = _.without(this.players, remPlayer);
        remPlayer.isOnline = false;
        remPlayer.choices = _.reject(remPlayer.choices, function (c) { return c.event === 'Party' || c.event === 'PartyLeave'; });
        if (remPlayer.$battle) {
            remPlayer._hp.set(0);
        }
        if (remPlayer.$partyName) {
            remPlayer.party.playerLeave(remPlayer, true);
        }
        remPlayer.save();
    };
    GameState.prototype.getPlayer = function (playerName) {
        return _.find(this.players, { name: playerName });
    };
    GameState.prototype.getPlayers = function () {
        return this.players;
    };
    GameState.prototype.getPlayerNameSimple = function (playerName, keys) {
        return this.getPlayerSimple(this.getPlayer(playerName), keys, false);
    };
    GameState.prototype.getPlayerSimple = function (player, keys, override) {
        if (keys === void 0) { keys = UPDATE_KEYS; }
        if (override === void 0) { override = false; }
        if (!override) {
            keys = keys.concat(EXTRA_KEYS);
        }
        var obj = _.pick(player, keys);
        return obj;
    };
    GameState.prototype.getPlayersSimple = function (keys, override) {
        var _this = this;
        return _.map(this.players, function (p) { return _this.getPlayerSimple(p, keys, override); });
    };
    GameState.prototype.getSomePlayersSimple = function (playerNames, keys) {
        var _this = this;
        return _.compact(_.map(this.players, function (p) { return playerNames[p.name] ? _this.getPlayerSimple(p, keys) : null; }));
    };
    GameState.prototype.retrievePlayerFromDb = function (playerName) {
        return this.playerLoad.loadPlayer(playerName);
    };
    return GameState;
}());
exports.GameState = GameState;
