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
var Professions = require("../core/professions/_all");
var item_generator_1 = require("./item-generator");
var generator_1 = require("../core/base/generator");
var equipment_1 = require("../core/base/equipment");
var asset_loader_1 = require("../shared/asset-loader");
var Bosses = require("../../assets/maps/content/boss.json");
var BossParties = require("../../assets/maps/content/bossparties.json");
var BossItems = require("../../assets/maps/content/bossitems.json");
var bossTimers = {};
var MonsterGenerator = (function (_super) {
    __extends(MonsterGenerator, _super);
    function MonsterGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MonsterGenerator._setBossTimer = function (name) {
        var respawn = Bosses[name] ? Bosses[name].respawn : BossParties[name].respawn;
        bossTimers[name] = Date.now() + (1000 * respawn);
    };
    MonsterGenerator._isBossAlive = function (name) {
        return bossTimers[name] ? bossTimers[name] - Date.now() < 0 : true;
    };
    MonsterGenerator.generateBoss = function (name, forPlayer) {
        var boss = _.cloneDeep(Bosses[name]);
        if (!this._isBossAlive(name))
            return;
        boss.stats.name = "" + name;
        boss.stats._name = "" + name;
        var monster = this.augmentMonster(boss.stats, forPlayer);
        monster.$isBoss = true;
        this.equipBoss(monster, boss.items);
        monster._collectibles = boss.collectibles;
        return [monster];
    };
    MonsterGenerator.generateBossParty = function (name, forPlayer) {
        var _this = this;
        var bossparty = BossParties[name];
        if (!this._isBossAlive(name))
            return;
        return _.map(bossparty.members, function (member) {
            var boss = _.cloneDeep(Bosses[member]);
            boss.stats.name = "" + member;
            boss.stats._name = "" + member;
            var monster = _this.augmentMonster(boss.stats, forPlayer);
            monster.$isBoss = true;
            _this.equipBoss(monster, boss.items);
            monster._collectibles = boss.collectibles;
            return monster;
        });
    };
    MonsterGenerator.equipBoss = function (monster, items) {
        if (!items || !items.length)
            return;
        _.each(items, function (item) {
            var itemInst = new equipment_1.Equipment(BossItems[item.name]);
            itemInst.name = item.name;
            itemInst.itemClass = 'guardian';
            itemInst.dropPercent = item.dropPercent;
            item_generator_1.ItemGenerator.tryToVectorize(itemInst, monster.level);
            monster.equip(itemInst);
        });
    };
    MonsterGenerator.generateMonsters = function (party) {
        var _this = this;
        return _.map(party.players, function (p) {
            return _this.augmentMonster(_this.pickMonster(p), p);
        });
    };
    MonsterGenerator.pickMonster = function (player) {
        return _.clone(_(asset_loader_1.ObjectAssets.monster)
            .reject(function (mon) { return mon.level > player.level + 5 || mon.level < player.level - 5; })
            .sample());
    };
    MonsterGenerator.equipMonster = function (monster, baseMonster) {
        // give it some equipment to defend itself with
        _.each(generator_1.Generator.types, function (type) {
            var item = item_generator_1.ItemGenerator.generateItem(type, monster.level * 15, monster.level);
            if (monster.canEquip(item, monster.level * 5, false)) {
                monster.equip(item);
            }
        });
        // base stats = "monster essence"; always given to a monster after other equipment
        var baseEssence = _.pick(baseMonster, generator_1.Generator.stats);
        baseEssence.type = 'essence';
        baseEssence.name = 'monster essence';
        var essence = new equipment_1.Equipment(baseEssence);
        monster.equip(essence);
    };
    MonsterGenerator.generateVectorMonster = function (forPlayer) {
        var profession = _.sample(_.keys(Professions));
        return {
            name: "Vector " + profession,
            class: profession,
            level: forPlayer.level
        };
    };
    MonsterGenerator.augmentMonster = function (baseMonster, forPlayer) {
        if (!baseMonster)
            baseMonster = this.generateVectorMonster(forPlayer);
        baseMonster.professionName = baseMonster.class;
        if (!baseMonster.professionName || baseMonster.professionName.toLowerCase() === 'random') {
            baseMonster.professionName = _.sample(_.keys(Professions));
        }
        // TODO personalities
        // TODO other additions
        if (baseMonster.name && chance.bool({ likelihood: 1 })) {
            var chanceOpts = { prefix: chance.bool(), suffix: chance.bool(), middle: chance.bool() };
            if (baseMonster.gender) {
                chanceOpts.gender = _.sample(['male', 'female']);
            }
            baseMonster.name = chance.name(chanceOpts) + ", the " + baseMonster.name;
        }
        var Monster = require('../plugins/combat/monster').Monster;
        var monster = new Monster();
        if (baseMonster.mirror) {
            baseMonster.professionName = forPlayer && forPlayer.professionName ? forPlayer.professionName : 'Monster';
            baseMonster.level = forPlayer && forPlayer.professionName ? forPlayer.level : baseMonster.level;
        }
        monster.init(baseMonster);
        if (baseMonster.mirror && forPlayer) {
            _.each(_.values(forPlayer.equipment), function (item) {
                var cloned = _.cloneDeep(item);
                monster.equip(cloned);
            });
        }
        else {
            this.equipMonster(monster, baseMonster);
        }
        return monster;
    };
    return MonsterGenerator;
}(generator_1.Generator));
exports.MonsterGenerator = MonsterGenerator;
