"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var constitute_1 = require("constitute");
var character_1 = require("../../core/base/character");
var game_state_1 = require("../../core/game-state");
var settings_1 = require("../../static/settings");
var logger_1 = require("../../shared/logger");
var player_db_1 = require("./player.db");
var player_movement_1 = require("./player.movement");
var item_generator_1 = require("../../shared/item-generator");
var data_updater_1 = require("../../shared/data-updater");
var eventhandler_1 = require("../events/eventhandler");
var Events = require("../events/events/_all");
var Achievements = require("../achievements/achievements/_all");
var player_dirtychecker_1 = require("./player.dirtychecker");
var _emitter_1 = require("./_emitter");
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(playerDb) {
        var _this = _super.call(this) || this;
        _this.$playerDb = playerDb;
        _this.$playerMovement = player_movement_1.PlayerMovement;
        _this.$itemGenerator = item_generator_1.ItemGenerator;
        _this.$dataUpdater = data_updater_1.DataUpdater;
        return _this;
    }
    Player.prototype.init = function (opts, save) {
        if (save === void 0) { save = true; }
        this.$dirty = new player_dirtychecker_1.DirtyChecker();
        this.$canSave = save;
        _super.prototype.init.call(this, opts);
        if (!this.joinDate)
            this.joinDate = Date.now();
        if (!this.mapRegion)
            this.mapRegion = 'Wilderness';
        if (!this.gold)
            this.gold = 0;
        if (!this.map)
            this.map = 'Norkos';
        if (!this.x)
            this.x = 10;
        if (!this.y)
            this.y = 10;
        if (!this.choices)
            this.choices = [];
        if (_.size(this.equipment) < 10)
            this.generateBaseEquipment();
        this.$updateAchievements = true;
        this.$updateCollectibles = true;
        this.$updateGenders = true;
        this.$updatePremium = true;
        this.$partyName = null;
        if (this.isMod) {
            this.emitGMData();
        }
        this.$canSave = true;
        this.lastLogin = Date.now();
    };
    Player.prototype.quickLogin = function () {
        this.$updateAchievements = true;
        this.$updateCollectibles = true;
        this.$updateGenders = true;
        this.$updatePremium = true;
        if (this.isMod) {
            this.emitGMData();
        }
    };
    Player.prototype.emitGMData = function () {
        var maps = _.keys(game_state_1.GameState.getInstance().world.maps);
        var teleNames = _.map(settings_1.SETTINGS.allTeleports, 'name');
        var permAchs = _(Achievements)
            .values()
            .filter(function (ach) { return ach.permanentProp; })
            .map(function (ach) { return ({ property: ach.permanentProp, name: ach.name }); })
            .value();
        var allEvents = _(Events)
            .keys()
            .reject(function (key) { return Events[key].WEIGHT <= 0; })
            .value();
        this.$dataUpdater(this.name, 'gmdata', { maps: maps, teleNames: teleNames, permAchs: permAchs, allEvents: allEvents });
    };
    Player.prototype.generateBaseEquipment = function () {
        var _this = this;
        var items = this.$itemGenerator.newPlayerEquipment();
        _.each(items, function (item) { return _this.equip(item); });
    };
    Object.defineProperty(Player.prototype, "fullname", {
        get: function () {
            var viewName = this.nameEdit ? this.nameEdit : this.name;
            if (this.title)
                return viewName + ", the " + this.title;
            return viewName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "deathMessage", {
        get: function () {
            if (this._deathMessage)
                return this._deathMessage;
            return this.randomDeathMessage();
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.takeTurn = function () {
        logger_1.Logger.silly('Player:TakeTurn', this.name + " taking turn.");
        var activePet = this.$pets.activePet;
        if (activePet) {
            activePet.takeTurn();
            if (activePet.$updatePlayer) {
                this.__updatePetActive();
            }
        }
        if (this.$personalities.isActive('Camping')) {
            this.$statistics.incrementStat('Character.Movement.Camping');
            this.save();
            return;
        }
        this.attemptToDisbandSoloParty();
        try {
            this.moveAction();
            eventhandler_1.EventHandler.tryToDoEvent(this);
        }
        catch (e) {
            logger_1.Logger.error('Player', e);
        }
        if (this.$partyName) {
            this.party.playerTakeStep(this);
        }
        this.save();
    };
    Player.prototype.attemptToDisbandSoloParty = function () {
        if (!this.$partyName)
            return;
        var party = this.party;
        if (party.players.length > 1)
            return;
        party.disband(this, false);
    };
    Player.prototype.levelUp = function () {
        if (this.level === this._level.maximum)
            return;
        _super.prototype.levelUp.call(this);
        this._saveSelf();
        _emitter_1.emitter.emit('player:levelup', { player: this });
    };
    Player.prototype.gainGold = function (baseGold, calc) {
        if (baseGold === void 0) { baseGold = 1; }
        if (calc === void 0) { calc = true; }
        var gold = calc ? this.liveStats.gold(baseGold) : baseGold;
        if (_.isNaN(gold) || gold === 0 || Math.sign(gold) !== Math.sign(baseGold))
            return 0;
        _super.prototype.gainGold.call(this, gold);
        if (gold > 0) {
            this.$statistics.incrementStat('Character.Gold.Gain', gold);
        }
        else {
            this.$statistics.incrementStat('Character.Gold.Lose', -gold);
        }
        return gold;
    };
    Player.prototype.gainXp = function (baseXp, calc) {
        if (baseXp === void 0) { baseXp = 1; }
        if (calc === void 0) { calc = true; }
        var xp = calc ? this.liveStats.xp(baseXp) : baseXp;
        if (_.isNaN(xp) || xp === 0 || Math.sign(xp) !== Math.sign(baseXp))
            return 0;
        _super.prototype.gainXp.call(this, xp);
        if (xp > 0) {
            this.$statistics.incrementStat('Character.XP.Gain', xp);
        }
        else {
            this.$statistics.incrementStat('Character.XP.Lose', -xp);
        }
        if (this._xp.atMaximum())
            this.levelUp();
        return xp;
    };
    Player.prototype.premiumTier = function () {
        var tier = this.$achievements.premiumTier();
        this._premiumTier = tier;
        this.$statistics.setStat('Game.PremiumTier', tier);
        return tier;
    };
    Player.prototype._$priceReductionMultiplier = function () {
        var premiumTier = this.premiumTier();
        return 1 - (0.1 * premiumTier);
    };
    Player.prototype._$choiceLimit = function () {
        var premiumTier = this.premiumTier();
        return settings_1.SETTINGS.maxChoices + (settings_1.SETTINGS.maxChoices * premiumTier);
    };
    Player.prototype._$maxItemBoost = function () {
        var premiumTier = this.premiumTier();
        return 0.5 * premiumTier;
    };
    Player.prototype.addChoice = function (messageData) {
        this.choices.push(messageData);
        this._choiceLimit = this._$choiceLimit();
        if (this.choices.length > this._choiceLimit) {
            if (this.$personalities.isAnyActive(['Affirmer', 'Denier', 'Indecisive'])) {
                var choice = this.choices[0];
                if (_.includes(choice.choices, 'Yes') && this.$personalities.isActive('Affirmer')) {
                    this.handleChoice({ id: choice.id, response: 'Yes' });
                    this.$statistics.incrementStat('Character.Choice.Affirm');
                }
                else if (_.includes(choice.choices, 'No') && this.$personalities.isActive('Denier')) {
                    this.handleChoice({ id: choice.id, response: 'No' });
                    this.$statistics.incrementStat('Character.Choice.Deny');
                }
                else if (this.$personalities.isActive('Indecisive')) {
                    this.handleChoice({ id: choice.id, response: _.sample(choice.choices) });
                    this.$statistics.incrementStat('Character.Choice.Indecisive');
                }
            }
            else {
                this.choices.shift();
                this.$statistics.incrementStat('Character.Choice.Ignore');
            }
        }
        this.$statistics.incrementStat('Character.Choices');
    };
    Player.prototype.handleChoice = function (_a) {
        var id = _a.id, response = _a.response;
        var choice = _.find(this.choices, { id: id });
        if (!choice)
            return;
        var result = Events[choice.event].makeChoice(this, id, response);
        if (result === false)
            return Events[choice.event].feedback(this);
        this.$statistics.batchIncrement(['Character.Choice.Chosen', "Character.Choice.Choose." + response]);
        this.removeChoice(id);
        this.update();
    };
    Player.prototype.emitLevelChange = function () {
        _emitter_1.emitter.emit('player:changelevel', { player: this });
    };
    Player.prototype.removeChoice = function (id) {
        this.choices = _.reject(this.choices, { id: id });
    };
    Object.defineProperty(Player.prototype, "validGenders", {
        get: function () {
            return settings_1.SETTINGS.validGenders.concat(_.get(this.$premium, 'genders', []));
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.changeGender = function (newGender) {
        if (!_.includes(this.validGenders, newGender))
            return;
        this.gender = newGender;
        _emitter_1.emitter.emit('player:changegender', { player: this });
    };
    Player.prototype.changeTitle = function (newTitle) {
        var titles = this.$achievements.titles();
        if (newTitle && !_.includes(titles, newTitle))
            return;
        this.title = newTitle;
        if (newTitle) {
            this._deathMessage = this.$achievements.getDeathMessageForTitle(newTitle);
        }
        else {
            this._deathMessage = null;
        }
        _emitter_1.emitter.emit('player:changetitle', { player: this });
    };
    Player.prototype.changeName = function (newName) {
        if (!newName)
            return;
        this.nameEdit = newName;
        _emitter_1.emitter.emit('player:changename', { player: this });
    };
    Player.prototype.togglePersonality = function (personality) {
        if (!_.find(this.$personalities.earnedPersonalities, { name: personality }))
            return;
        this.$personalities.togglePersonality(this, personality);
        this._updatePersonalities();
    };
    Player.prototype.moveToStart = function () {
        this.map = 'Norkos';
        this.x = 10;
        this.y = 10;
    };
    Player.prototype.moveAction = function () {
        var _this = this;
        var weight = this.$playerMovement.getInitialWeight(this);
        var _a = this.$playerMovement.pickRandomTile(this, weight), index = _a[0], newLoc = _a[1], dir = _a[2];
        var tile = this.$playerMovement.getTileAt(this.map, newLoc.x, newLoc.y);
        var partyTileCheck = function () {
            if (!_this.$playerMovement.canEnterTile(_this, tile) && _this.party) {
                _this.$partyStepsLeft = _this.$partyStepsLeft || 3;
                if (_this.$partyStepsLeft <= 0) {
                    _this.party.playerLeave(_this);
                }
                _this.$partyStepsLeft--;
            }
        };
        partyTileCheck();
        var attempts = 1;
        while (!this.$playerMovement.canEnterTile(this, tile)) {
            if (attempts > 8) {
                logger_1.Logger.error('Player', new Error("Player " + this.name + " is position locked at " + this.x + ", " + this.y + " in " + this.map));
                break;
            }
            weight[index] = 0;
            _b = this.$playerMovement.pickRandomTile(this, weight), index = _b[0], newLoc = _b[1], dir = _b[2];
            tile = this.$playerMovement.getTileAt(this.map, newLoc.x, newLoc.y);
            partyTileCheck();
            attempts++;
        }
        if (!tile.terrain) {
            logger_1.Logger.error('PlayerMovement', new Error("Invalid tile terrain undefined for " + this.name + " @ " + this.map + ": " + this.x + "," + this.y));
        }
        this.lastDir = dir === 5 ? null : dir;
        this.x = newLoc.x;
        this.y = newLoc.y;
        var mapInstance = game_state_1.GameState.getInstance().world.maps[this.map];
        if (!mapInstance || this.x <= 0 || this.y <= 0 || this.y > mapInstance.height || this.x > mapInstance.width) {
            logger_1.Logger.error('PlayerMovement', new Error("Out of bounds for " + this.name + " on " + this.map + ": " + this.x + ", " + this.y));
            this.moveToStart();
        }
        this.oldRegion = this.mapRegion;
        this.mapRegion = tile.region;
        this.mapPath = tile.path;
        this.$playerMovement.handleTile(this, tile);
        this.stepCooldown--;
        var incrementStats = [
            'Character.Steps',
            "Character.Maps." + this.map,
            "Character.Terrains." + tile.terrain,
            "Character.Regions." + tile.region
        ];
        if (this.$personalities.isActive('Drunk')) {
            incrementStats.push('Character.Movement.Drunk');
        }
        if (this.$personalities.isActive('Solo') && !this.party) {
            incrementStats.push('Character.Movement.Solo');
        }
        if (this.party) {
            incrementStats.push('Character.Movement.Party');
        }
        this.$statistics.batchIncrement(incrementStats);
        this.gainXp(settings_1.SETTINGS.xpPerStep);
        var _b;
    };
    Player.prototype.equip = function (item) {
        _super.prototype.equip.call(this, item);
        this.recalculateStats();
        this._saveSelf();
        this.update();
    };
    Player.prototype.unequip = function (item, replaceWith) {
        this.equipment[item.type] = replaceWith;
        this.recalculateStats();
        this._saveSelf();
    };
    Player.prototype.recalculateStats = function () {
        _super.prototype.recalculateStats.call(this);
        this.$dirty.reset();
    };
    Player.prototype.buildSaveObject = function () {
        var _this = this;
        return _.omitBy(this, function (val, key) { return _.startsWith(key, '$') || _.isNotWritable(_this, key); });
    };
    Player.prototype.buildTransmitObject = function () {
        var _this = this;
        var badKeys = ['equipment', 'isOnline', 'stepCooldown', 'userId', 'lastDir', 'allIps', 'profession', 'spells'];
        var obj = _.omitBy(this, function (val, key) {
            return _.startsWith(key, '$')
                || _.isFunction(val)
                || _.isNotWritable(_this, key)
                || _.includes(key, 'Link')
                || _.includes(key, 'Steps')
                || _.includes(badKeys, key);
        });
        obj.ascensionLevel = this.ascensionLevel;
        return obj;
    };
    Player.prototype._saveSelf = function () {
        if (!this.$canSave)
            return;
        this.$playerDb.savePlayer(this);
    };
    Player.prototype.save = function () {
        this.checkAchievements();
        if (!this.saveSteps)
            this.saveSteps = settings_1.SETTINGS.saveSteps;
        this.saveSteps--;
        if (this.saveSteps <= 0) {
            logger_1.Logger.silly('Player:TakeTurn', this.name + " actually saving.");
            this._save();
            this.saveSteps = settings_1.SETTINGS.saveSteps;
        }
        this.update();
    };
    Player.prototype._save = function () {
        this._saveSelf();
        this.$statistics.save();
        this.$pets.save();
    };
    Player.prototype.checkAchievements = function () {
        if (!this.achievementSteps)
            this.achievementSteps = settings_1.SETTINGS.achievementSteps;
        this.achievementSteps--;
        if (this.achievementSteps <= 0) {
            this._checkAchievements();
            this.achievementSteps = settings_1.SETTINGS.achievementSteps;
        }
    };
    Player.prototype._checkAchievements = function () {
        this.$pets.checkPets(this);
        logger_1.Logger.silly('Player:TakeTurn', this.name + " actually checking new achievements.");
        var newAchievements = this.$achievements.checkAchievements(this);
        if (newAchievements.length > 0) {
            _emitter_1.emitter.emit('player:achieve', { player: this, achievements: newAchievements });
            this.$personalities.checkPersonalities(this);
        }
    };
    Player.prototype._updatePlayer = function () {
        this.$dataUpdater(this.name, 'player', this.buildTransmitObject());
    };
    Player.prototype._updateParty = function (force) {
        if (force === void 0) { force = false; }
        var transmitObject = this.party ? this.party.buildTransmitObject() : {};
        if (!force && this.$lastPartyObject && _.isEqual(transmitObject, this.$lastPartyObject))
            return;
        this.$lastPartyObject = transmitObject;
        this.$dataUpdater(this.name, 'party', transmitObject);
    };
    Player.prototype._updateEquipment = function () {
        this.$dataUpdater(this.name, 'equipment', this.equipment);
    };
    Player.prototype._updateStatistics = function () {
        this.$dataUpdater(this.name, 'statistics', this.$statistics.stats);
    };
    Player.prototype._updateAchievements = function () {
        this.$dataUpdater(this.name, 'achievements', this.$achievements.achievements);
    };
    Player.prototype._updateCollectibles = function () {
        this.$dataUpdater(this.name, 'collectibles', { current: this.$collectibles.collectibles, prior: this.$collectibles.priorCollectibleData });
    };
    Player.prototype._updatePersonalities = function () {
        this.$dataUpdater(this.name, 'personalities', { earned: this.$personalities.earnedPersonalities, active: this.$personalities.activePersonalities });
    };
    Player.prototype._updateGenders = function () {
        this.$dataUpdater(this.name, 'genders', this.validGenders);
    };
    Player.prototype._updatePet = function () {
        this.__updatePetBuyData();
        this.__updatePetBasic();
        this.__updatePetActive();
    };
    Player.prototype.__updatePetBasic = function () {
        this.$dataUpdater(this.name, 'petbasic', this.$pets.earnedPets);
    };
    Player.prototype.__updatePetBuyData = function () {
        this.$dataUpdater(this.name, 'petbuy', this.$pets.petInfo);
    };
    Player.prototype.__updatePetActive = function () {
        if (!this.$pets.activePet)
            return;
        this.$dataUpdater(this.name, 'petactive', this.$pets.activePet.buildTransmitObject());
    };
    Player.prototype.__updateFestivals = function () {
        this.$dataUpdater(this.name, 'festivals', game_state_1.GameState.getInstance().festivals);
    };
    Player.prototype._updateSystem = function () {
        this.__updateFestivals();
    };
    Player.prototype._updatePremium = function () {
        this.$dataUpdater(this.name, 'premium', {
            conversionRate: settings_1.SETTINGS.ilpConversionRate,
            buyable: this.$premium.buyable,
            ilp: this.$premium.ilp,
            bought: this.$premium.oneTimeItemsPurchased,
            consumables: this.$premium.consumables
        });
    };
    Player.prototype.update = function () {
        this._updatePlayer();
        this._updateParty();
        this._updateSystem();
        if (this.$updateEquipment) {
            this._updateEquipment();
        }
        if (this.$updateGenders) {
            this.$updateGenders = false;
            this._updateGenders();
        }
        if (this.$updatePremium) {
            this.$updatePremium = false;
            this._updatePremium();
        }
    };
    Object.defineProperty(Player.prototype, "ascensionLevel", {
        get: function () {
            return this.$statistics ? this.$statistics.getStat('Character.Ascension.Times') : 0;
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.ascend = function () {
        var _this = this;
        if (!this._level.atMaximum())
            return;
        var currentAscensionLevel = this.$statistics.getStat('Character.Ascension.Times');
        this.$statistics.incrementStat('Character.Ascension.Times');
        this.$statistics.incrementStat('Character.Ascension.Gold', this.gold);
        this.gold = 0;
        _.each(this.$pets.$pets, function (pet) {
            _this.$statistics.incrementStat('Character.Ascension.Gold', pet.gold.getTotal());
            pet.gold.set(0);
        });
        this.$statistics.incrementStat('Character.Ascension.ItemScore', this.itemScore);
        this.generateBaseEquipment();
        _.each(this.$pets.$pets, function (pet) {
            pet.unequipAll();
            pet.inventory = [];
        });
        this.$statistics.incrementStat('Character.Ascension.Levels', this.level);
        this._level.maximum += settings_1.SETTINGS.ascensionLevelBoost;
        this._level.set(1);
        this._xp.set(0);
        this.resetMaxXp();
        this.$statistics.incrementStat('Character.Ascension.CollectiblesFound', this.$collectibles.totalCollectibles());
        this.$collectibles.reset();
        this.$collectibles.save();
        this.moveToStart();
        this.choices = [];
        this.$personalities.turnAllOff(this);
        this.recalculateStats();
        this._checkAchievements();
        this.update();
        this.save();
        this.$pets.save();
        this.$statistics.save();
        this.lastAscension = Date.now();
        var ascBonus = 0.25 + (0.05 * currentAscensionLevel);
        game_state_1.GameState.getInstance().addFestival({
            name: this.name + "'s Ascension",
            message: this.name + " has ascended! +" + ascBonus * 100 + "% XP/Gold for everyone for 24 hours!",
            startedBy: this.name,
            hourDuration: 24,
            bonuses: {
                xp: ascBonus,
                gold: ascBonus
            }
        });
    };
    return Player;
}(character_1.Character));
Player = __decorate([
    constitute_1.Dependencies(player_db_1.PlayerDb),
    __metadata("design:paramtypes", [Object])
], Player);
exports.Player = Player;
