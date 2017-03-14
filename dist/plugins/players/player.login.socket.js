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
var jwt = require("jsonwebtoken");
var player_1 = require("./player");
var player_db_1 = require("./player.db");
var _emitter_1 = require("./_emitter");
var logger_1 = require("../../shared/logger");
var di_wrapper_1 = require("../../shared/di-wrapper");
var messages_1 = require("../../static/messages");
var game_state_1 = require("../../core/game-state");
var AUTH0_SECRET = process.env.AUTH0_SECRET;
var SERVER_ID = _.isNaN(+process.env.INSTANCE_NUMBER) ? 0 : +process.env.INSTANCE_NUMBER;
var redis_1 = require("../scaler/redis");
exports.event = 'plugin:player:login';
exports.description = 'Log in or register a new character. Login only requires userId.';
exports.args = 'name, gender, professionName, token, userId';
exports.socket = function (socket, primus, respond) {
    var login = function (_a) {
        var name = _a.name, gender = _a.gender, professionName = _a.professionName, token = _a.token, userId = _a.userId;
        return __awaiter(_this, void 0, void 0, function () {
            var player, event, playerDb, validateToken, gameState, oldPlayer, e_1, playerObject, e_2, e_3, msg_1, loggedInPlayerName, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (_.isUndefined(process.env.INSTANCE_NUMBER)) {
                            logger_1.Logger.info('Socket:Player:Login', 'No instance number, killing login.');
                            socket.end(undefined, { reconnect: true });
                            return [2 /*return*/];
                        }
                        player = null;
                        event = '';
                        playerDb = di_wrapper_1.constitute(player_db_1.PlayerDb);
                        logger_1.Logger.info('Socket:Player:Login', "Attempted login from (" + socket.address.ip + ", " + userId + ").");
                        if (!playerDb) {
                            logger_1.Logger.error('Login', new Error('playerDb could not be resolved.'));
                            return [2 /*return*/, respond({ msg: messages_1.MESSAGES.GENERIC })];
                        }
                        validateToken = (process.env.NODE_ENV === 'production' && !process.env.ALLOW_LOCAL) || !_.includes(userId, 'local|');
                        if (validateToken) {
                            if (AUTH0_SECRET) {
                                try {
                                    jwt.verify(token, new Buffer(AUTH0_SECRET, 'base64'), { algorithms: ['HS256'] });
                                }
                                catch (e) {
                                    // Logger.error('Login', e, { token });
                                    return [2 /*return*/, respond(messages_1.MESSAGES.INVALID_TOKEN)];
                                }
                            }
                            else {
                                logger_1.Logger.error('Login', new Error('Token needs to be validated, but no AUTH0_TOKEN is present.'));
                            }
                        }
                        gameState = game_state_1.GameState.getInstance();
                        oldPlayer = _.find(gameState.players, { userId: userId });
                        if (!!oldPlayer) return [3 /*break*/, 12];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 11]);
                        return [4 /*yield*/, playerDb.getPlayer({ userId: userId })];
                    case 2:
                        player = _a.sent();
                        event = 'player:login';
                        return [3 /*break*/, 11];
                    case 3:
                        e_1 = _a.sent();
                        // 20 char name is reasonable
                        name = _.truncate(name, { length: 20 }).trim().replace(/[^\w\dÀ-ÿ ]/gm, '');
                        name = name.split(' the ').join('');
                        name = name.trim();
                        if (name.length === 0) {
                            return [2 /*return*/, respond(messages_1.MESSAGES.INVALID_NAME)];
                        }
                        // sensible defaults
                        if (!_.includes(['male', 'female'], gender))
                            gender = 'male';
                        if (!_.includes(['Generalist', 'Mage', 'Cleric', 'Fighter'], professionName))
                            professionName = 'Generalist';
                        playerObject = {};
                        try {
                            playerObject = di_wrapper_1.constitute(player_1.Player);
                        }
                        catch (e) {
                            logger_1.Logger.error('Login', e);
                            return [2 /*return*/, respond(messages_1.MESSAGES.GENERIC)];
                        }
                        playerObject.init({ _id: name, name: name, gender: gender, professionName: professionName, userId: userId }, false);
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, playerDb.createPlayer(playerObject.buildSaveObject())];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_2 = _a.sent();
                        return [2 /*return*/, respond(messages_1.MESSAGES.PLAYER_EXISTS)];
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, playerDb.getPlayer({ userId: userId, name: name })];
                    case 8:
                        player = _a.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        e_3 = _a.sent();
                        logger_1.Logger.error('Login', e_3);
                        respond(messages_1.MESSAGES.GENERIC);
                        return [3 /*break*/, 10];
                    case 10:
                        event = 'player:register';
                        return [3 /*break*/, 11];
                    case 11:
                        if (player.isBanned) {
                            msg_1 = _.clone(messages_1.MESSAGES.BANNED);
                            msg_1.alreadyLoggedIn = true;
                            respond(msg_1);
                            socket.end();
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 13];
                    case 12:
                        if (gameState._hasTimeout(oldPlayer.name)) {
                            gameState._clearTimeout(oldPlayer.name);
                        }
                        logger_1.Logger.info('Login', oldPlayer.name + " semi-login (server " + SERVER_ID + ").");
                        event = 'player:semilogin';
                        _a.label = 13;
                    case 13:
                        loggedInPlayerName = (oldPlayer || player).name;
                        try {
                            socket.authToken = { playerName: loggedInPlayerName, token: token };
                            socket.playerName = loggedInPlayerName;
                        }
                        catch (e) {
                            logger_1.Logger.error('login.socket.auth/name', e);
                            return [2 /*return*/, respond(messages_1.MESSAGES.GENERIC)];
                        }
                        // closed
                        if (socket.readyState === 2)
                            return [2 /*return*/];
                        logger_1.Logger.info('Socket:Player:Login', socket.playerName + " (" + socket.address.ip + ", " + userId + ") logging in (server " + SERVER_ID + ").");
                        primus.addPlayer(loggedInPlayerName, socket);
                        _emitter_1.emitter.emit(event, { playerName: loggedInPlayerName, fromIp: socket.address.ip });
                        redis_1.PlayerForceLogout(loggedInPlayerName);
                        msg = _.clone(messages_1.MESSAGES.LOGIN_SUCCESS);
                        msg.ok = true;
                        return [2 /*return*/, respond(msg)];
                }
            });
        });
    };
    socket.on(exports.event, login);
};
