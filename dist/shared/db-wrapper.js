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
var mongodb_1 = require("mongodb");
var logger_1 = require("./logger");
var connectionString = process.env.MONGODB_URI;
var mongoTag = "Mongo:" + (process.send ? 'Worker' : 'Core');
var globalPromise;
var DbWrapper = (function () {
    function DbWrapper() {
    }
    Object.defineProperty(DbWrapper, "promise", {
        get: function () {
            return globalPromise;
        },
        enumerable: true,
        configurable: true
    });
    DbWrapper.prototype.connectionPromise = function () {
        var _this = this;
        if (globalPromise) {
            return globalPromise;
        }
        globalPromise = new Promise(function (resolve, reject) {
            logger_1.Logger.info(mongoTag, 'Connecting to database...');
            mongodb_1.MongoClient.connect(connectionString, {
                native_parser: true,
                server: {
                    poolSize: 10, auto_reconnect: true, socketOptions: {
                        keepAlive: 1, connectTimeoutMS: 120000, socketTimeoutMS: 120000
                    }
                }
            }, function (err, db) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (err) {
                        logger_1.Logger.error('DB:Init', err);
                        return [2 /*return*/, reject(err)];
                    }
                    db.on('close', function () {
                        try {
                            db.open();
                            logger_1.Logger.info('DB:Close', 'Attempted reopen.');
                        }
                        catch (e) {
                            logger_1.Logger.error('DB:Close', e);
                        }
                    });
                    db.on('error', function (e) {
                        logger_1.Logger.error('DB:Err', e);
                    });
                    db.collection('players').createIndex({ name: 1 }, { unique: true }, _.noop);
                    db.collection('players').createIndex({ userId: 1 }, { unique: true }, _.noop);
                    if (_.isUndefined(process.env.INSTANCE_NUMBER) || process.env.INSTANCE_NUMBER == 0) {
                        db.collection('players').updateMany({}, { $set: { isOnline: false } });
                    }
                    db.collection('battles').createIndex({ happenedAt: 1 }, { expireAfterSeconds: 1800 }, _.noop);
                    logger_1.Logger.info(mongoTag, 'Connected!');
                    db.$$collections = {
                        achievements: db.collection('achievements'),
                        battles: db.collection('battles'),
                        collectibles: db.collection('collectibles'),
                        personalities: db.collection('personalities'),
                        pets: db.collection('pets'),
                        players: db.collection('players'),
                        statistics: db.collection('statistics'),
                        festivals: db.collection('festivals'),
                        premiums: db.collection('premiums')
                    };
                    resolve(db);
                    return [2 /*return*/];
                });
            }); });
        });
        return globalPromise;
    };
    return DbWrapper;
}());
exports.DbWrapper = DbWrapper;
