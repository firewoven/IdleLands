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
Object.defineProperty(exports, "__esModule", { value: true });
var constitute_1 = require("constitute");
var _ = require("lodash");
var logger_1 = require("../../shared/logger");
var equipment_1 = require("../../core/base/equipment");
var settings_1 = require("../../static/settings");
var petdata = require("../../../assets/maps/content/pets.json");
var pet_1 = require("./pet");
var Pets = (function () {
    function Pets(container) {
        var _this = this;
        var PetsDb = require('./pets.db.js').PetsDb;
        try {
            container.schedulePostConstructor(function (petsDb) {
                _this.petsDb = petsDb;
            }, [PetsDb]);
        }
        catch (e) {
            logger_1.Logger.error('Pets', e);
        }
    }
    // clear current variables and set new
    Pets.prototype.init = function (opts) {
        this._id = undefined;
        this.earnedPets = [];
        this.earnedPetData = {};
        this.activePetId = '';
        this.$pets = [];
        _.extend(this, opts);
    };
    Pets.prototype.__emptyGear = function (_a) {
        var slot = _a.slot;
        return new equipment_1.Equipment({ name: 'nothing', type: slot });
    };
    Object.defineProperty(Pets.prototype, "activePet", {
        get: function () {
            return _.find(this.$pets, { $petId: this.activePetId });
        },
        enumerable: true,
        configurable: true
    });
    Pets.prototype._updateSimplePetInfo = function (petType, key, value) {
        _.find(this.earnedPets, { name: petType })[key] = value;
    };
    Pets.prototype._syncGear = function (pet) {
        var _this = this;
        if (!pet.equipment)
            pet.equipment = {};
        _.each(pet.$slots, function (value, key) {
            if (!pet.equipment[key])
                pet.equipment[key] = [];
            while (pet.equipment[key].length < value) {
                pet.equipment[key].push(_this.__emptyGear({ slot: key }));
            }
            while (pet.equipment[key].length > value) {
                pet.addToInventory(pet.equipment[key].shift());
            }
        });
    };
    Pets.prototype._setupPetData = function (petName, petData, myPetData, player) {
        myPetData.$specialStats = petData.specialStats;
        myPetData.$category = petData.category;
        myPetData.$slots = petData.slots;
        myPetData.$scale = petData.scale;
        myPetData.$scaleCost = petData.scaleCost;
        myPetData.$petId = petName;
        myPetData.$ownerRef = player;
        myPetData.$manager = this;
    };
    Pets.prototype.addNewPet = function (player, type, name) {
        if (this.earnedPetData[type])
            return;
        if (!name || !name.trim() || name.length > 20)
            return;
        var cost = petdata[type].cost;
        if (player.gold < cost)
            return;
        player.gainGold(-cost, false);
        player.$statistics.incrementStat('Character.Gold.Spent', cost);
        var pet = new pet_1.Pet();
        this._setupPetData(type, petdata[type], pet, player);
        pet.init({
            name: name,
            creator: player.name,
            owner: player.name,
            attr: _.sample(settings_1.SETTINGS.validPetAttributes)
        });
        this._syncGear(pet);
        var petInList = _.find(this.earnedPets, { name: type });
        petInList.bought = true;
        petInList.level = 1;
        petInList.profession = 'Monster';
        petInList.petName = name;
        this.activePetId = type;
        this.earnedPetData[type] = pet.buildSaveObject();
        this.$pets.push(pet);
        this.save();
        player.save();
        player._updatePet();
    };
    Pets.prototype.restorePetData = function (player) {
        var _this = this;
        _.each(petdata, function (petData, petName) {
            if (!_this.earnedPetData[petName])
                return;
            var myPetData = _this.earnedPetData[petName];
            _this._setupPetData(petName, petData, myPetData, player);
        });
        this.$pets = _.map(_.values(this.earnedPetData), function (d) {
            var pet = new pet_1.Pet();
            pet.init(d);
            _this._syncGear(pet);
            return pet;
        });
    };
    Pets.prototype.feedGold = function (player, amount) {
        amount = Math.round(+amount);
        if (_.isNaN(amount) || amount < 0 || player.gold < amount)
            return 'Bad amount of gold specified.';
        var pet = this.activePet;
        if (!pet)
            return;
        var xpGained = pet.$_scale.xpPerGold * amount;
        if (!pet.canGainXp())
            return 'Pet cannot gain XP at this time.';
        player.gainGold(-amount, false);
        player.$statistics.incrementStat('Character.Pet.GoldFed', amount);
        pet.gainXp(xpGained);
        player._updatePet();
        player.update();
    };
    Pets.prototype.feedMax = function (player) {
        var pet = this.activePet;
        if (!pet)
            return;
        var xpGainedPerGold = pet.$_scale.xpPerGold;
        if (!pet.canGainXp())
            return 'Pet cannot gain XP at this time.';
        while (pet.canGainXp()) {
            var xpNeeded = pet._xp.maximum - pet._xp.__current;
            var amount = Math.floor(xpNeeded / xpGainedPerGold);
            if (player.gold < amount)
                break;
            player.gainGold(-amount, false);
            player.$statistics.incrementStat('Character.Pet.GoldFed', amount);
            pet.levelUp();
        }
        player._updatePet();
        player.update();
    };
    Pets.prototype.changePet = function (player, newPetType) {
        if (!this.earnedPetData[newPetType])
            return;
        this.activePetId = newPetType;
        player.__updatePetActive();
        this.save();
    };
    Pets.prototype.togglePetSmartSetting = function (setting) {
        if (!this.activePet)
            return;
        if (!_.includes(['self', 'sell', 'equip'], setting))
            return;
        var pet = this.activePet;
        pet.smart[setting] = !pet.smart[setting];
        this.save();
    };
    Pets.prototype.changePetProfession = function (player, newProfession) {
        if (!this.activePet)
            return;
        var allProfessions = player.$achievements.petClasses();
        if (!_.includes(allProfessions, newProfession))
            return 'You have not unlocked that pet class!';
        this.activePet.changeProfession(newProfession);
        player.__updatePetActive();
        player.__updatePetBasic();
    };
    Pets.prototype.changePetAttr = function (player, newAttr) {
        if (!this.activePet)
            return;
        var allAttrs = player.$achievements.petAttributes();
        if (newAttr && !_.includes(allAttrs, newAttr))
            return;
        this.activePet.changeAttr(newAttr);
        player.__updatePetActive();
        player.__updatePetBasic();
    };
    Pets.prototype.upgradePet = function (player, scaleAttr) {
        var pet = this.activePet;
        if (!pet)
            return;
        if (pet.$scale[scaleAttr].length - 1 === pet.scaleLevel[scaleAttr])
            return;
        var cost = pet.$scaleCost[scaleAttr][pet.scaleLevel[scaleAttr] + 1];
        if (player.gold < cost)
            return;
        player.gainGold(-cost, false);
        player.$statistics.incrementStat('Character.Gold.Spent', cost);
        player.$statistics.incrementStat('Character.Pet.Upgrades');
        pet.scaleLevel[scaleAttr]++;
        pet.doUpgrade(scaleAttr);
        player.__updatePetActive();
        player.update();
    };
    Pets.prototype.takePetGold = function (player) {
        var pet = this.activePet;
        if (!pet)
            return;
        var gold = pet.gold.getValue();
        player.gainGold(gold, false);
        pet.gainGold(-gold);
        player.$statistics.incrementStat('Character.Pet.GoldTaken', gold);
        player.__updatePetActive();
    };
    Pets.prototype.checkPetRequirements = function (player, _a) {
        var requirements = _a.requirements;
        var statistics = requirements.statistics, achievements = requirements.achievements, collectibles = requirements.collectibles, bosses = requirements.bosses;
        var earned = true;
        if (statistics) {
            _.each(statistics, function (value, key) {
                var statVal = player.$statistics.getStat(key);
                if (_.isObject(statVal))
                    statVal = player.$statistics.countChild(key);
                if (statVal < value)
                    earned = false;
            });
        }
        if (achievements) {
            _.each(achievements, function (_a) {
                var name = _a.name, tier = _a.tier;
                if (!player.$achievements.hasAchievementAtTier(name, tier))
                    earned = false;
            });
        }
        if (collectibles) {
            _.each(collectibles, function (collectible) {
                if (!player.$collectibles.hasCollectible(collectible))
                    earned = false;
            });
        }
        if (bosses) {
            _.each(bosses, function (boss) {
                if (!player.$statistics.getStat("Character.BossKills." + boss))
                    earned = false;
            });
        }
        return earned;
    };
    Pets.prototype.sellPetItem = function (player, itemId) {
        var pet = this.activePet;
        if (!this.activePet)
            return;
        var item = _.find(pet.inventory, { id: itemId });
        if (!item)
            return;
        pet.sellItem(item);
        pet.removeFromInventory(item);
        player.__updatePetActive();
    };
    Pets.prototype.sellAllPetItems = function (player) {
        var pet = this.activePet;
        if (!this.activePet)
            return;
        _.each(pet.inventory, function (item) {
            pet.sellItem(item);
            pet.removeFromInventory(item);
        });
        player.__updatePetActive();
    };
    Pets.prototype.unequipPetItem = function (player, itemId) {
        var pet = this.activePet;
        if (!this.activePet)
            return;
        if (pet.inventoryFull()) {
            return 'Pet inventory full.';
        }
        var item = _.find(_.flatten(_.values(pet.equipment)), { id: itemId });
        if (!item)
            return;
        if (item.isNothing) {
            return 'Cannot unequip nothing.';
        }
        if (item.type === 'soul') {
            return 'Souls are irreplaceable.';
        }
        pet.unequip(item, true);
        pet.addToInventory(item);
        player.__updatePetActive();
    };
    Pets.prototype.equipPetItem = function (player, itemId) {
        var pet = this.activePet;
        if (!this.activePet)
            return;
        var item = _.find(pet.inventory, { id: itemId });
        if (!item)
            return;
        if (!pet.canManuallyEquip(item)) {
            return 'No place to equip item.';
        }
        if (!pet.canEquip(item)) {
            return 'Item too strong for pet or pet does not have the correct appendages.';
        }
        pet.equip(item, true);
        pet.removeFromInventory(item);
        player.__updatePetActive();
    };
    Pets.prototype.giveItemToPet = function (player, itemId) {
        var pet = this.activePet;
        if (!this.activePet)
            return;
        if (pet.inventoryFull()) {
            return 'Pet inventory full.';
        }
        var item = _.find(_.values(player.equipment), { id: itemId });
        if (!item)
            return;
        if (item.type === 'providence') {
            return 'Providences are gifts from the gods, you cannot forsake them like this.';
        }
        if (item.isNothing) {
            return 'Cannot unequip nothing.';
        }
        item._wasEquipped = true;
        player.unequip(item, this.__emptyGear({ slot: item.type }));
        pet.addToInventory(item);
        player._updateEquipment();
        player.__updatePetActive();
    };
    Pets.prototype.takeItemFromPet = function (player, itemId) {
        var pet = this.activePet;
        if (!this.activePet)
            return;
        var item = _.find(pet.inventory, { id: itemId });
        if (!item)
            return;
        if (!player.canEquip(item, 1, false) && !item._wasEquipped) {
            return 'Item too powerful for you.';
        }
        if (player.equipment[item.type] && !player.equipment[item.type].isNothing) {
            pet.addToInventory(player.equipment[item.type]);
        }
        player.equip(item);
        pet.removeFromInventory(item);
        player._updateEquipment();
        player.__updatePetActive();
    };
    Pets.prototype.checkPets = function (player) {
        var _this = this;
        _.each(petdata, function (petData, petName) {
            if (_.find(_this.earnedPets, { name: petName }))
                return;
            if (!_this.checkPetRequirements(player, petData))
                return;
            _this.earnedPets.push({ bought: false, name: petName });
        });
    };
    Pets.prototype.changePetName = function (player, petId, petName) {
        if (!player.$premium.canConsume('renameTagPet'))
            return 'You do not have a pet rename tag!';
        player.$premium.consume(player, 'renameTagPet');
        var pet = _.find(this.$pets, { $petId: petId });
        pet.name = petName;
        this._updateSimplePetInfo(petId, 'petName', petName);
        player._updatePet();
        this.save();
    };
    Object.defineProperty(Pets.prototype, "petInfo", {
        get: function () {
            return _.reduce(_.keys(petdata), function (prev, cur) {
                prev[cur] = _.pick(petdata[cur], ['cost', 'category', 'description']);
                return prev;
            }, {});
        },
        enumerable: true,
        configurable: true
    });
    Pets.prototype.buildSaveObject = function () {
        var _this = this;
        _.each(this.$pets, function (pet) {
            _this.earnedPetData[pet.$petId] = pet.buildSaveObject();
        });
        return _.omitBy(this, function (val, key) { return _.startsWith(key, '$') || _.isNotWritable(_this, key); });
    };
    Pets.prototype.save = function () {
        this.petsDb.savePets(this.buildSaveObject());
    };
    return Pets;
}());
Pets = __decorate([
    constitute_1.Dependencies(constitute_1.Container),
    __metadata("design:paramtypes", [Object])
], Pets);
exports.Pets = Pets;
