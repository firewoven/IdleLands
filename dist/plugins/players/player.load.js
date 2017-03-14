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
var player_1 = require("./player");
var player_db_1 = require("./player.db");
var statistics_1 = require("../statistics/statistics");
var statistics_db_1 = require("../statistics/statistics.db");
var achievements_1 = require("../achievements/achievements");
var achievements_db_1 = require("../achievements/achievements.db");
var personalities_1 = require("../personalities/personalities");
var personalities_db_1 = require("../personalities/personalities.db");
var collectibles_1 = require("../collectibles/collectibles");
var collectibles_db_1 = require("../collectibles/collectibles.db");
var pets_1 = require("../pets/pets");
var pets_db_1 = require("../pets/pets.db");
var premium_1 = require("../premium/premium");
var premium_db_1 = require("../premium/premium.db");
var logger_1 = require("../../shared/logger");
var di_wrapper_1 = require("../../shared/di-wrapper");
var PlayerLoad = (function () {
    function PlayerLoad(playerDb, statisticsDb, achievementsDb, personalitiesDb, collectiblesDb, petsDb, premiumDb) {
        this.playerDb = playerDb;
        this.statisticsDb = statisticsDb;
        this.achievementsDb = achievementsDb;
        this.personalitiesDb = personalitiesDb;
        this.collectiblesDb = collectiblesDb;
        this.petsDb = petsDb;
        this.premiumDb = premiumDb;
    }
    PlayerLoad.prototype.loadPremium = function (player) {
        return __awaiter(this, void 0, void 0, function () {
            var premObj, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!player.premiumLink) return [3 /*break*/, 2];
                        premObj = di_wrapper_1.constitute(premium_1.Premium);
                        premObj.init({ _id: player.name, ilp: 0, oneTimeItemsPurchased: {}, purchaseHistory: [] });
                        return [4 /*yield*/, this.premiumDb.savePremium(premObj)];
                    case 1:
                        _b.sent();
                        player.premiumLink = player.name;
                        player.$premium = premObj;
                        return [3 /*break*/, 4];
                    case 2:
                        _a = player;
                        return [4 /*yield*/, this.premiumDb.getPremium(player.name)];
                    case 3:
                        _a.$premium = _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PlayerLoad.prototype.loadPets = function (player) {
        return __awaiter(this, void 0, void 0, function () {
            var petsObj, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!player.petsLink) return [3 /*break*/, 2];
                        petsObj = di_wrapper_1.constitute(pets_1.Pets);
                        petsObj.init({ _id: player.name, activePetId: '', earnedPets: [], earnedPetData: {} });
                        return [4 /*yield*/, this.petsDb.savePets(petsObj)];
                    case 1:
                        _b.sent();
                        player.petsLink = player.name;
                        player.$pets = petsObj;
                        return [3 /*break*/, 4];
                    case 2:
                        _a = player;
                        return [4 /*yield*/, this.petsDb.getPets(player.name)];
                    case 3:
                        _a.$pets = _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PlayerLoad.prototype.loadStatistics = function (player) {
        return __awaiter(this, void 0, void 0, function () {
            var statisticsObj, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!player.statisticsLink) return [3 /*break*/, 2];
                        statisticsObj = di_wrapper_1.constitute(statistics_1.Statistics);
                        statisticsObj.init({ _id: player.name, stats: {} });
                        return [4 /*yield*/, this.statisticsDb.saveStatistics(statisticsObj)];
                    case 1:
                        _b.sent();
                        player.statisticsLink = player.name;
                        player.$statistics = statisticsObj;
                        return [3 /*break*/, 4];
                    case 2:
                        _a = player;
                        return [4 /*yield*/, this.statisticsDb.getStatistics(player.name)];
                    case 3:
                        _a.$statistics = _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PlayerLoad.prototype.loadAchievements = function (player) {
        return __awaiter(this, void 0, void 0, function () {
            var achievementsObj, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!player.achievementsLink) return [3 /*break*/, 2];
                        achievementsObj = di_wrapper_1.constitute(achievements_1.Achievements);
                        achievementsObj.init({ _id: player.name, achievements: {} });
                        return [4 /*yield*/, this.achievementsDb.saveAchievements(achievementsObj)];
                    case 1:
                        _b.sent();
                        player.achievementsLink = player.name;
                        player.$achievements = achievementsObj;
                        return [3 /*break*/, 4];
                    case 2:
                        _a = player;
                        return [4 /*yield*/, this.achievementsDb.getAchievements(player.name)];
                    case 3:
                        _a.$achievements = _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PlayerLoad.prototype.loadPersonalities = function (player) {
        return __awaiter(this, void 0, void 0, function () {
            var personalitiesObj, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!player.personalitiesLink) return [3 /*break*/, 2];
                        personalitiesObj = di_wrapper_1.constitute(personalities_1.Personalities);
                        personalitiesObj.init({ _id: player.name, activePersonalities: {}, earnedPersonalities: [] });
                        return [4 /*yield*/, this.personalitiesDb.savePersonalities(personalitiesObj)];
                    case 1:
                        _b.sent();
                        player.personalitiesLink = player.name;
                        player.$personalities = personalitiesObj;
                        return [3 /*break*/, 4];
                    case 2:
                        _a = player;
                        return [4 /*yield*/, this.personalitiesDb.getPersonalities(player.name)];
                    case 3:
                        _a.$personalities = _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PlayerLoad.prototype.loadCollectibles = function (player) {
        return __awaiter(this, void 0, void 0, function () {
            var collectiblesObj, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!player.collectiblesLink) return [3 /*break*/, 2];
                        collectiblesObj = di_wrapper_1.constitute(collectibles_1.Collectibles);
                        collectiblesObj.init({ _id: player.name, collectibles: {} });
                        return [4 /*yield*/, this.collectiblesDb.saveCollectibles(collectiblesObj)];
                    case 1:
                        _b.sent();
                        player.collectiblesLink = player.name;
                        player.$collectibles = collectiblesObj;
                        return [3 /*break*/, 4];
                    case 2:
                        _a = player;
                        return [4 /*yield*/, this.collectiblesDb.getCollectibles(player.name)];
                    case 3:
                        _a.$collectibles = _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PlayerLoad.prototype.loadPlayer = function (playerId) {
        return __awaiter(this, void 0, void 0, function () {
            var playerObj, player, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.playerDb.getPlayer({ _id: playerId })];
                    case 1:
                        playerObj = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        player = di_wrapper_1.constitute(player_1.Player);
                        player.init(playerObj);
                        return [4 /*yield*/, Promise.all([
                                this.loadStatistics(player),
                                this.loadAchievements(player),
                                this.loadPersonalities(player),
                                this.loadCollectibles(player),
                                this.loadPets(player),
                                this.loadPremium(player)
                            ])];
                    case 3:
                        _a.sent();
                        player.$personalities.checkPersonalities(player);
                        player.$pets.restorePetData(player);
                        player.$pets.checkPets(player);
                        player.$premium.checkDonatorFirstTimeBonus(player);
                        player.isOnline = true;
                        player.recalculateStats();
                        return [2 /*return*/, player];
                    case 4:
                        e_1 = _a.sent();
                        logger_1.Logger.error('PlayerLoad:loadPlayer', e_1);
                        throw (e_1);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return PlayerLoad;
}());
PlayerLoad = __decorate([
    constitute_1.Dependencies(player_db_1.PlayerDb, statistics_db_1.StatisticsDb, achievements_db_1.AchievementsDb, personalities_db_1.PersonalitiesDb, collectibles_db_1.CollectiblesDb, pets_db_1.PetsDb, premium_db_1.PremiumDb),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], PlayerLoad);
exports.PlayerLoad = PlayerLoad;
