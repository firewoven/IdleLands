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
var Chance = require("chance");
var chance = new Chance();
var generator_1 = require("../core/base/generator");
var equipment_1 = require("../core/base/equipment");
var asset_loader_1 = require("../shared/asset-loader");
var Chests = require("../../assets/maps/content/chests.json");
var Treasures = require("../../assets/maps/content/treasure.json");
var ItemGenerator = (function (_super) {
    __extends(ItemGenerator, _super);
    function ItemGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemGenerator.newPlayerEquipment = function () {
        var itemNames = {
            body: ['Tattered Shirt', 'Spray Tan', 'Temporary Tattoos', 'Hero\'s Tunic', 'Grandma\'s Sweater'],
            feet: ['Cardboard Shoes', 'Wheelie Shoes', 'Sandals With Built-in Socks'],
            finger: ['Twisted Wire', 'Candy Ring', 'Hero Academy Graduation Ring'],
            hands: ['Pixelated Gloves', 'Winter Gloves', 'Mittens'],
            head: ['Miniature Top Hat', 'Fruit Hat', 'Beanie', 'Sunglasses'],
            legs: ['Leaf', 'Cargo Shorts', 'Comfy Shorts'],
            neck: ['Old Brooch', 'Candy Necklace', 'Keyboard Cat Tie'],
            mainhand: ['Empty and Broken Ale Bottle', 'Father\'s Sword', 'Butter Knife', 'Hero\'s Axe', 'Chocolate Drumstick', 'Aged Toothbrush'],
            offhand: ['Chunk of Rust', 'Shaking Fist', 'Upside-down Map', 'Sticker Book', 'Stolen Dagger'],
            charm: ['Ancient Bracelet', 'Family Photo', 'Third Place Bowling Trophy', 'Love Letter']
        };
        var r = function () { return chance.integer({ min: -2, max: 3 }); };
        var equipment = [];
        _.each(_.keys(itemNames), function (key) {
            var item = new equipment_1.Equipment({
                type: key,
                itemClass: 'newbie',
                name: _.sample(itemNames[key]),
                str: r(), con: r(), dex: r(), int: r(), agi: r(), luk: r()
            });
            equipment.push(item);
        });
        return equipment;
    };
    ItemGenerator.getAllTreasure = function (chestName, player) {
        var _this = this;
        return _.map(Chests[chestName].items, function (itemName) {
            var item = new equipment_1.Equipment(Treasures[itemName]);
            item.name = itemName;
            item.itemClass = 'guardian';
            _this.tryToVectorize(item, player.level);
            item.score;
            return _this.cleanUpItem(item);
        });
    };
    ItemGenerator.getItemClass = function (item) {
        var itemClass = 'basic';
        if (item.name.toLowerCase() !== item.name)
            itemClass = 'pro';
        if (_.includes(item.name.toLowerCase(), 'idle')
            || _.includes(item.name.toLowerCase(), 'idling'))
            itemClass = 'idle';
        if (item.score > 7500)
            itemClass = 'godly';
        return itemClass;
    };
    ItemGenerator.generateItem = function (type, bonus, genLevel) {
        if (bonus === void 0) { bonus = 0; }
        if (genLevel === void 0) { genLevel = 0; }
        if (!type) {
            type = _.sample(this.types);
        }
        var baseItem = _.sample(asset_loader_1.ObjectAssets[type]);
        var itemInst = new equipment_1.Equipment(baseItem);
        this.addPropertiesToItem(itemInst, bonus);
        this.tryToVectorize(itemInst, genLevel);
        itemInst._baseScore = itemInst.score;
        itemInst.type = type;
        itemInst.itemClass = this.getItemClass(itemInst);
        itemInst.score;
        return this.cleanUpItem(itemInst);
    };
    ItemGenerator.addPropertiesToItem = function (item, bonus) {
        if (bonus === void 0) { bonus = 0; }
        var prefixBonus = 0;
        if (bonus > 10)
            prefixBonus++;
        if (bonus > 20)
            prefixBonus++;
        if (chance.integer({ min: 0, max: 3 }) - prefixBonus <= 0) {
            this.mergePropInto(item, _.sample(asset_loader_1.ObjectAssets.prefix));
            var iter_1 = 1;
            var seti = function () { return chance.integer({ min: 0, max: Math.pow(15, iter_1) }); };
            var i = seti();
            while (i < 1 + bonus) {
                this.mergePropInto(item, _.sample(asset_loader_1.ObjectAssets.prefix));
                iter_1++;
                i = seti();
            }
        }
        if (chance.integer({ min: 0, max: 100 }) - (prefixBonus * 5) <= 0) {
            this.mergePropInto(item, _.sample(asset_loader_1.ObjectAssets['prefix-special']));
        }
        if (chance.integer({ min: 0, max: 85 }) <= 1 + bonus) {
            this.mergePropInto(item, _.sample(asset_loader_1.ObjectAssets.suffix));
        }
    };
    ItemGenerator.tryToVectorize = function (item, level) {
        if (!item.vector && (level <= 100 || chance.bool({ likelihood: 95 })))
            return;
        var funcs = [
            { name: 'linear', modify: function (stat) { return stat + stat; } },
            { name: 'scalar', modify: function (stat) { return stat * stat; } },
            { name: 'vector', modify: function (stat) { return Math.round(stat + Math.sqrt(Math.abs(stat))); } },
            { name: 'parabolic', modify: function (stat) { return stat * chance.bool() ? -2 : 2; } },
            { name: 'quadratic', modify: function (stat) { return Math.round(stat * Math.log(Math.abs(stat))); } },
            { name: 'exponential', modify: function (stat) { return Math.round(stat * Math.sqrt(Math.abs(stat))); } },
            { name: 'leve-linear', modify: function (stat) { return stat + level; } },
            { name: 'leve-scalar', modify: function (stat) { return stat * level; } },
            { name: 'leve-vector', modify: function (stat) { return Math.round(stat + Math.sqrt(level)); } },
            { name: 'leve-quadratic', modify: function (stat) { return Math.round(stat * Math.log(level)); } },
            { name: 'leve-exponential', modify: function (stat) { return Math.round(stat * Math.sqrt(level)); } }
        ];
        var weights = [
            6,
            3,
            5,
            2,
            4,
            1,
            6,
            3,
            5,
            4,
            1
        ];
        var func = chance.weighted(funcs, weights);
        var validKeys = _(item)
            .omitBy(function (val, prop) {
            return _.includes(['enchantLevel', 'foundAt', '_calcScore', '_baseScore', 'vector', 'dropPercent'], prop)
                || _.isNotWritable(item, prop)
                || val === 0
                || _.isString(item[prop]);
        })
            .keys()
            .value();
        var numKeys = item.vector ? Math.min(validKeys.length, item.vector) : chance.integer({ min: 1, max: validKeys.length });
        var chosenKeys = _.sampleSize(validKeys, numKeys);
        _.each(chosenKeys, function (key) {
            item[key] = func.modify(item[key]);
        });
        item.name = func.name + " " + item.name;
    };
    ItemGenerator.cleanUpItem = function (item) {
        _.each(item, function (val, attr) {
            if (_.isNaN(val))
                item[attr] = true;
        });
        return item;
    };
    return ItemGenerator;
}(generator_1.Generator));
exports.ItemGenerator = ItemGenerator;
