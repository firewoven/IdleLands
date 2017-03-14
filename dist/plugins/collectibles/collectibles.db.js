"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var constitute_1 = require("constitute");
var db_wrapper_1 = require("../../shared/db-wrapper");
var messages_1 = require("../../static/messages");
var logger_1 = require("../../shared/logger");
var di_wrapper_1 = require("../../shared/di-wrapper");
var collectibles_1 = require("./collectibles");
var CollectiblesDb = (function () {
    function CollectiblesDb(DbWrapper) {
        this.dbWrapper = DbWrapper;
    }
    CollectiblesDb.prototype.getCollectibles = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var db, collectibles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbWrapper.connectionPromise()];
                    case 1:
                        db = _a.sent();
                        collectibles = db.$$collections.collectibles;
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                collectibles.find({ _id: id }).limit(1).next(function (err, doc) {
                                    if (err) {
                                        return reject({ err: err, msg: messages_1.MESSAGES.GENERIC });
                                    }
                                    try {
                                        var collectibles_2 = di_wrapper_1.constitute(collectibles_1.Collectibles);
                                        collectibles_2.init(doc);
                                        resolve(collectibles_2);
                                    }
                                    catch (e) {
                                        logger_1.Logger.error('CollectiblesDb:getCollectibles', e);
                                        reject({ e: e, msg: messages_1.MESSAGES.GENERIC });
                                    }
                                });
                            })];
                }
            });
        });
    };
    CollectiblesDb.prototype.saveCollectibles = function (collectiblesObject) {
        return __awaiter(this, void 0, void 0, function () {
            var db, collectibles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbWrapper.connectionPromise()];
                    case 1:
                        db = _a.sent();
                        collectibles = db.$$collections.collectibles;
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                collectibles.findOneAndUpdate({ _id: collectiblesObject._id }, { $set: {
                                        collectibles: collectiblesObject.collectibles,
                                        priorCollectibles: collectiblesObject.priorCollectibles,
                                        uniqueCollectibles: collectiblesObject.uniqueCollectibles
                                    } }, { upsert: true }, function (err) {
                                    if (err) {
                                        return reject(err);
                                    }
                                    resolve(collectibles);
                                });
                            })];
                }
            });
        });
    };
    return CollectiblesDb;
}());
CollectiblesDb = __decorate([
    constitute_1.Dependencies(db_wrapper_1.DbWrapper),
    __metadata("design:paramtypes", [Object])
], CollectiblesDb);
exports.CollectiblesDb = CollectiblesDb;
