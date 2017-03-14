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
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var RestrictedNumber = require("restricted-number");
var character_1 = require("../../core/base/character");
var equipment_1 = require("../../core/base/equipment");
var settings_1 = require("../../static/settings");
var item_generator_1 = require("../../shared/item-generator");
var Pet = (function (_super) {
    __extends(Pet, _super);
    function Pet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Pet.prototype, "fullname", {
        get: function () {
            if (!this.attr) {
                return this.name + ", the " + this.$petId;
            }
            return this.name + ", the " + this.$petId + " with " + this.attr;
        },
        enumerable: true,
        configurable: true
    });
    Pet.prototype.init = function (opts) {
        var _this = this;
        opts.gender = opts.gender || _.sample(settings_1.SETTINGS.validGenders);
        opts.professionName = opts.professionName || 'Monster';
        _super.prototype.init.call(this, opts);
        this.createdAt = this.createdAt || Date.now();
        this.inventory = this.inventory || [];
        if (!this.scaleLevel)
            this.scaleLevel = {
                maxLevel: 0,
                maxItemScore: 0,
                inventory: 0,
                goldStorage: 0,
                battleJoinPercent: 0,
                itemFindTimeDuration: 0,
                itemSellMultiplier: 0,
                itemFindBonus: 0,
                itemFindRangeMultiplier: 0,
                xpPerGold: 0
            };
        if (this.scaleLevel.xpPerGold > 0)
            this.scaleLevel.xpPerGold = 0;
        this.$_scale = new Proxy({}, {
            get: function (target, name) {
                var scale = _this.$scale[name];
                return scale[Math.min(_this.scaleLevel[name], scale.length - 1)];
            }
        });
        if (!this.smart)
            this.smart = { self: false, sell: true, equip: true };
        if (!this.gold)
            this.gold = { minimum: 0, maximum: this.$_scale.goldStorage, __current: 0 };
        this.gold.__proto__ = RestrictedNumber.prototype;
        _.each(this.inventory, function (item) {
            delete item.isUnderNormalPercent;
            delete item.isNormallyEnchantable;
            delete item.isNothing;
            delete item.score;
            delete item.fullname;
            item.__proto__ = equipment_1.Equipment.prototype;
        });
        this._level.maximum = this.$_scale.maxLevel;
        this.updateSoul();
    };
    Pet.prototype.changeProfession = function (professionName) {
        _super.prototype.changeProfession.call(this, professionName);
        this.$manager._updateSimplePetInfo(this.$petId, 'profession', professionName);
    };
    Pet.prototype.changeAttr = function (newAttr) {
        this.attr = newAttr;
    };
    Pet.prototype.updateSoul = function () {
        var base = _.cloneDeep(this.$specialStats);
        base.name = 'Pet Soul';
        base.type = 'soul';
        base.itemFindRangeMultiplier = this.$_scale.itemFindRangeMultiplier;
        base.itemValueMultiplier = this.$_scale.itemSellMultiplier;
        base.itemFindRange = this.$_scale.maxItemScore;
        var item = new equipment_1.Equipment(base);
        this.equipment.soul = [item];
    };
    Pet.prototype.levelUp = function () {
        if (this.level === this._level.maximum)
            return;
        _super.prototype.levelUp.call(this);
        this.$manager._updateSimplePetInfo(this.$petId, 'level', this.level);
    };
    Pet.prototype._setNextItemFind = function () {
        if (!this.$_scale.itemFindTimeDuration)
            return;
        this.nextItemFind = new Date(Date.now() + this.$_scale.itemFindTimeDuration * 1000);
        this.$manager.save();
    };
    Pet.prototype.updatePlayer = function () {
        this.$updatePlayer = true;
    };
    Pet.prototype.inventoryFull = function () {
        return this.inventory.length === this.$_scale.inventory;
    };
    Pet.prototype.findItem = function () {
        var item = item_generator_1.ItemGenerator.generateItem(null, this.$_scale.itemFindBonus, this.level);
        if (!this.canEquipScore(item)) {
            this.sellItem(item);
            return;
        }
        if (this.smart.equip && this.canEquip(item)) {
            var oldItem = this.shouldEquip(item);
            if (oldItem) {
                this.unequip(oldItem);
                this.equip(item);
                this.recalculateStats();
                this.updatePlayer();
                return;
            }
        }
        // full inventory
        if (this.inventoryFull()) {
            var sellItem = item;
            // try smart sell first
            if (this.smart.sell) {
                var compareItem = _.minBy(this.inventory, '_calcScore');
                // something in inventory is worse than the current sell item
                if (compareItem.score < sellItem.score) {
                    sellItem = compareItem;
                    this.addToInventory(item);
                    this.removeFromInventory(sellItem);
                }
            }
            this.sellItem(sellItem);
        }
        else {
            this.addToInventory(item);
        }
        this.updatePlayer();
    };
    Pet.prototype.removeFromInventory = function (removeItem) {
        this.inventory = _.reject(this.inventory, function (item) { return item === removeItem; });
        this.save();
    };
    Pet.prototype.takeTurn = function () {
        if (!this.nextItemFind)
            this._setNextItemFind();
        var now = Date.now();
        if (this.nextItemFind - now <= 0) {
            this.findItem();
            this._setNextItemFind();
            this.updatePlayer();
        }
    };
    Pet.prototype.canManuallyEquip = function (item) {
        return _.find(this.equipment[item.type], { name: 'nothing' });
    };
    Pet.prototype.canEquipScore = function (item) {
        return item.score < this.liveStats.itemFindRange && item.score > 0;
    };
    Pet.prototype.canEquip = function (item) {
        return this.$slots[item.type] && this.canEquipScore(item);
    };
    Pet.prototype.shouldEquip = function (item) {
        var compareItem = _.minBy(this.equipment[item.type], '_calcScore');
        return item.score > compareItem.score ? compareItem : false;
    };
    Pet.prototype.unequipAll = function () {
        var _this = this;
        _.each(this.equipment, function (arr) {
            _.each(arr, function (item) {
                _this.unequip(item, true);
            });
        });
    };
    Pet.prototype.unequip = function (item, replace) {
        if (replace === void 0) { replace = false; }
        if (item.type === 'soul')
            return;
        this.equipment[item.type] = _.reject(this.equipment[item.type], function (checkItem) { return checkItem === item; });
        if (replace) {
            this.equipment[item.type].push(this.$manager.__emptyGear({ slot: item.type }));
        }
        this.recalculateStats();
    };
    Pet.prototype.equip = function (item, removeANothing) {
        if (removeANothing === void 0) { removeANothing = false; }
        this.equipment[item.type].push(item);
        if (removeANothing) {
            var nothing = _.find(this.equipment[item.type], { name: 'nothing' });
            if (nothing) {
                this.unequip(nothing);
            }
        }
        this.recalculateStats();
    };
    Pet.prototype.addToInventory = function (item) {
        this.inventory.push(item);
        this.inventory = _.reverse(_.sortBy(this.inventory, 'score'));
        this.save();
    };
    Pet.prototype.canGainXp = function () {
        return this.level < this.$ownerRef.level || this.level >= this._level.maximum;
    };
    Pet.prototype.gainXp = function (xp) {
        if (_.isNaN(xp) || !this.canGainXp())
            return 0;
        _super.prototype.gainXp.call(this, xp);
        if (this._xp.atMaximum())
            this.levelUp();
        return xp;
    };
    Pet.prototype.gainGold = function (gold) {
        if (_.isNaN(gold))
            return 0;
        this.gold.add(gold);
        this.checkSelfSmartUpgrades();
        return gold;
    };
    Pet.prototype.checkSelfSmartUpgrades = function () {
        var _this = this;
        if (!this.smart.self)
            return;
        _.each(_.keys(this.scaleLevel), function (attr) {
            if (_this.scaleLevel[attr] === _this.$scale[attr].length - 1)
                return;
            var cost = _this.$scaleCost[attr][_this.scaleLevel[attr] + 1];
            if (cost > _this.gold.getValue())
                return;
            _this.gold.sub(cost);
            _this.scaleLevel[attr]++;
            _this.doUpgrade(attr);
        });
    };
    Pet.prototype._doLevelUpgrade = function () {
        this._level.maximum = this.$_scale.maxLevel;
        this.levelUp();
    };
    Pet.prototype.doUpgrade = function (attr) {
        switch (attr) {
            case 'goldStorage': return this.gold.maximum = this.$_scale.goldStorage;
            case 'maxLevel': return this._doLevelUpgrade();
            case 'itemFindTimeDuration': return this._setNextItemFind();
            case 'itemFindRangeMultiplier': return this.updateSoul();
            case 'itemSellMultiplier': return this.updateSoul();
            case 'maxItemScore': return this.updateSoul();
        }
    };
    Pet.prototype.buildTransmitObject = function () {
        var _this = this;
        var base = _.omitBy(this, function (val, key) { return _.startsWith(key, '$') || _.isNotWritable(_this, key); });
        base.$petId = this.$petId;
        base.$scale = this.$scale;
        base.$scaleCost = this.$scaleCost;
        base.$slots = this.$slots;
        base.ownerEdit = this.$ownerRef.nameEdit;
        return base;
    };
    Pet.prototype.buildSaveObject = function () {
        var _this = this;
        return _.omitBy(this, function (val, key) { return _.startsWith(key, '$') || _.isNotWritable(_this, key); });
    };
    Pet.prototype.save = function () {
        this.$manager.save();
    };
    return Pet;
}(character_1.Character));
exports.Pet = Pet;
