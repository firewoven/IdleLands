"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var game_state_1 = require("../../core/game-state");
var ProfessionChange_1 = require("../events/events/ProfessionChange");
var BattleBoss_1 = require("../events/events/BattleBoss");
var FindTreasure_1 = require("../events/events/FindTreasure");
var Events = require("../events/events/_all");
var settings_1 = require("../../static/settings");
var logger_1 = require("../../shared/logger");
var _emitter_1 = require("./_emitter");
var monster_generator_1 = require("../../shared/monster-generator");
var Chance = require("chance");
var chance = new Chance(Math.random);
var directions = [1, 2, 3, 6, 9, 8, 7, 4];
var PlayerMovement = (function () {
    function PlayerMovement() {
    }
    PlayerMovement.num2dir = function (dir, x, y) {
        switch (dir) {
            case 1: return { x: x - 1, y: y - 1 };
            case 2: return { x: x, y: y - 1 };
            case 3: return { x: x + 1, y: y - 1 };
            case 4: return { x: x - 1, y: y };
            case 6: return { x: x + 1, y: y };
            case 7: return { x: x - 1, y: y + 1 };
            case 8: return { x: x, y: y + 1 };
            case 9: return { x: x + 1, y: y + 1 };
            default: return { x: x, y: y };
        }
    };
    PlayerMovement.canEnterTile = function (player, tile) {
        var properties = _.get(tile, 'object.properties');
        if (properties) {
            if (properties.requireMap)
                return player.$statistics.getStat("Character.Maps." + properties.requireMap) > 0;
            if (properties.requireRegion)
                return player.$statistics.getStat("Character.Regions." + properties.requireRegion) > 0;
            if (properties.requireBoss)
                return player.$statistics.getStat("Character.BossKills." + properties.requireBoss) > 0;
            if (properties.requireClass)
                return player.professionName === properties.requireClass;
            if (properties.requireAchievement)
                return player.$achievements.hasAchievement(properties.requireAchievement);
            if (properties.requireCollectible)
                return player.$collectibles.hasCollectible(properties.requireCollectible);
            if (properties.requireAscension)
                return player.ascensionLevel >= properties.requireAscension;
            if (properties.requireHoliday) {
                var _a = settings_1.SETTINGS.holidays[properties.requireHoliday], start = _a.start, end = _a.end;
                var today = new Date();
                return today.getMonth() >= start.getMonth()
                    && today.getDate() >= start.getDate()
                    && today.getMonth() <= end.getMonth()
                    && today.getDate() <= end.getDate();
            }
        }
        return !tile.blocked && tile.terrain !== 'Void';
    };
    // TODO https://github.com/IdleLands/IdleLandsOld/blob/master/src/character/player/Player.coffee#L347
    PlayerMovement.handleTile = function (player, tile) {
        var type = _.get(tile, 'object.type');
        var forceEvent = _.get(tile, 'object.properties.forceEvent', '');
        if (forceEvent) {
            if (!Events[forceEvent]) {
                logger_1.Logger.error('PlayerMovement', "forceEvent " + forceEvent + " does not exist at " + player.x + ", " + player.y + " in " + player.map);
                return;
            }
            Events[forceEvent].operateOn(player, tile.object.properties);
        }
        if (!type || !this["handleTile" + type])
            return;
        this["handleTile" + type](player, tile);
    };
    PlayerMovement.handleTileTreasure = function (player, tile) {
        FindTreasure_1.FindTreasure.operateOn(player, { treasureName: tile.object.name });
    };
    PlayerMovement.handleTileBoss = function (player, tile) {
        var boss = monster_generator_1.MonsterGenerator.generateBoss(tile.object.name, player);
        if (!boss)
            return;
        BattleBoss_1.BattleBoss.operateOn(player, { bossName: tile.object.name, bosses: boss });
    };
    PlayerMovement.handleTileBossParty = function (player, tile) {
        var bossparty = monster_generator_1.MonsterGenerator.generateBossParty(tile.object.name, player);
        if (!bossparty)
            return;
        BattleBoss_1.BattleBoss.operateOn(player, { bossName: tile.object.name, bosses: bossparty });
    };
    PlayerMovement.handleTileTrainer = function (player, tile) {
        if (player.stepCooldown > 0)
            return;
        player.stepCooldown = 10;
        var professionName = tile.object.name;
        var trainerName = tile.object.properties.realName ?
            tile.object.properties.realName + ", the " + professionName + " trainer" :
            "the " + professionName + " trainer";
        ProfessionChange_1.ProfessionChange.operateOn(player, { professionName: professionName, trainerName: trainerName });
    };
    PlayerMovement.handleTileTeleport = function (player, tile, force) {
        if (force === void 0) { force = false; }
        var dest = tile.object.properties;
        dest.x = +dest.destx;
        dest.y = +dest.desty;
        if (dest.movementType === 'ascend' && player.$personalities.isActive('Delver'))
            return;
        if (dest.movementType === 'descend' && player.$personalities.isActive('ScaredOfTheDark'))
            return;
        if (!force && (dest.movementType === 'ascend' || dest.movementType === 'descend')) {
            if (player.stepCooldown > 0)
                return;
            player.stepCooldown = 10;
        }
        if (!dest.map && !dest.toLoc) {
            logger_1.Logger.error('PlayerMovement', new Error("No dest.map at " + player.x + ", " + player.y + " in " + player.map));
            return;
        }
        if (!dest.movementType) {
            logger_1.Logger.error('PlayerMovement', new Error("No dest.movementType at " + player.x + ", " + player.y + " in " + player.map));
            return;
        }
        if (!dest.fromName)
            dest.fromName = player.map;
        if (!dest.destName)
            dest.destName = dest.map;
        if (dest.toLoc) {
            var toLocData = settings_1.SETTINGS.locToTeleport(dest.toLoc);
            dest.x = toLocData.x;
            dest.y = toLocData.y;
            dest.map = toLocData.map;
            dest.destName = toLocData.formalName;
        }
        var destTile = this.getTileAt(dest.map, dest.x, dest.y);
        player.mapPath = destTile.path;
        player.map = dest.map;
        player.x = dest.x;
        player.y = dest.y;
        player.oldRegion = player.mapRegion;
        player.mapRegion = tile.region;
        player.$statistics.incrementStat("Character.Movement." + _.capitalize(dest.movementType));
        _emitter_1.emitter.emit('player:transfer', { player: player, dest: dest });
    };
    PlayerMovement.handleTileCollectible = function (player, tile) {
        var collectible = tile.object;
        var collectibleName = collectible.name;
        var collectibleRarity = _.get(collectible, 'properties.rarity', 'basic');
        if (player.$collectibles.hasCollectible(collectibleName))
            return;
        var collectibleObj = {
            name: collectibleName,
            map: player.map,
            region: player.mapRegion,
            rarity: collectibleRarity,
            description: collectible.properties.flavorText,
            storyline: collectible.properties.storyline,
            foundAt: Date.now()
        };
        player.$collectibles.addCollectible(collectibleObj);
        _emitter_1.emitter.emit('player:collectible', { player: player, collectible: collectibleObj });
    };
    PlayerMovement.getTileAt = function (map, x, y) {
        var mapInstance = game_state_1.GameState.getInstance().world.maps[map];
        if (!mapInstance) {
            mapInstance = game_state_1.GameState.getInstance().world.maps.Norkos;
            x = 10;
            y = 10;
        }
        return mapInstance.getTile(x, y);
    };
    PlayerMovement.pickFollowTile = function (player, target) {
        return [0, { x: target.x, y: target.y }, target.lastDir];
    };
    PlayerMovement.pickRandomTile = function (player, weight) {
        if (!player.stepCooldown)
            player.stepCooldown = 0;
        if (player.party) {
            var party = player.party;
            var follow = party.getFollowTarget(player);
            if (follow && follow.map === player.map) {
                return this.pickFollowTile(player, follow);
            }
        }
        var indexes = [0, 1, 2, 3, 4, 5, 6, 7];
        if (weight.length === 0) {
            logger_1.Logger.error('PlayerMovement', new Error(player.name + " in " + player.map + " @ " + player.x + "," + player.y + " is unable to move due to no weights."));
        }
        var randomIndex = chance.weighted(indexes, weight);
        var dir = directions[randomIndex];
        return [randomIndex, this.num2dir(dir, player.x, player.y), dir];
    };
    PlayerMovement.getInitialWeight = function (player) {
        var weight = [300, 40, 7, 3, 1, 3, 7, 40];
        var drunk = player.$personalities.isActive('Drunk');
        if (player.lastDir && !drunk) {
            var lastDirIndex = directions.indexOf(player.lastDir);
            if (lastDirIndex !== -1) {
                weight = weight.slice(weight.length - lastDirIndex).concat(weight.slice(0, weight.length - lastDirIndex));
            }
        }
        else if (drunk) {
            weight = [1, 1, 1, 1, 1, 1, 1, 1];
        }
        return weight;
    };
    PlayerMovement._doTeleport = function (player, _a) {
        var map = _a.map, x = _a.x, y = _a.y, toLoc = _a.toLoc;
        var tileData = {
            object: {
                properties: {
                    destx: x,
                    desty: y,
                    movementType: 'teleport',
                    map: map,
                    toLoc: toLoc
                }
            }
        };
        this.handleTileTeleport(player, tileData, true);
        var tile = this.getTileAt(player.map, player.x, player.y);
        this.handleTile(player, tile);
    };
    return PlayerMovement;
}());
exports.PlayerMovement = PlayerMovement;
