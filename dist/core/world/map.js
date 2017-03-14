"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var settings_1 = require("../../static/settings");
var asset_loader_1 = require("../../shared/asset-loader");
var gidMap = settings_1.SETTINGS.gidMap;
var blockers = [16, 17, 3, 33, 37, 38, 39, 44, 45, 46, 47, 50, 53, 54, 55, 56, 57, 81, 83];
// const interactables = [1, 2, 12, 13, 14, 15, 18, 40, 41, 42, 43, 48, 51];
var Map = (function () {
    function Map(path, mapName) {
        this.map = _.cloneDeep(require("" + path));
        this.tileHeight = this.map.tileheight;
        this.tileWidth = this.map.tilewidth;
        this.height = this.map.height;
        this.width = this.map.width;
        if (this.map && this.map.properties) {
            this.name = this.map.properties.name;
        }
        this.path = path.split('assets/maps/world-maps/')[1];
        this.mapName = mapName;
        this.nameTrainers();
        this.loadRegions();
        this.loadCollectibles();
    }
    Map.prototype.loadCollectibles = function () {
        var _this = this;
        this.collectibles = {};
        _.each(this.map.layers[2].objects, function (object) {
            if (object.type !== 'Collectible')
                return;
            _this.collectibles[object.name] = object.properties;
            if (!object.properties.rarity)
                object.properties.rarity = 'basic';
            object.properties.description = object.properties.flavorText;
            object.properties.map = _this.mapName;
            object.properties.region = _this.regions[((object.y / 16) * _this.width) + (object.x / 16)] || 'Wilderness';
        });
    };
    Map.prototype.loadRegions = function () {
        var _this = this;
        this.regions = [];
        if (!this.map.layers[3])
            return;
        _.each(this.map.layers[3].objects, function (region) {
            var startX = region.x / 16;
            var startY = region.y / 16;
            var width = region.width / 16;
            var height = region.height / 16;
            for (var x = startX; x < startX + width; x++) {
                for (var y = startY; y < startY + height; y++) {
                    _this.regions[(y * _this.width) + x] = region.name;
                }
            }
        });
    };
    Map.prototype.nameTrainers = function () {
        var allTrainers = _.filter(this.map.layers[2].objects, function (obj) { return obj.type === 'Trainer'; });
        _.each(allTrainers, function (trainer) {
            var validNames = _.reject(asset_loader_1.ObjectAssets.trainer, function (npc) { return npc.class && npc.class !== trainer.name; });
            trainer.properties = trainer.properties || {};
            trainer.properties.realName = _.sample(validNames).name;
        });
    };
    // layers[0] will always be the terrain
    // layers[1] will always be the blocking tiles
    // layers[2] will always be the interactable stuff
    // layers[3] will always be map regions, where applicable
    Map.prototype.getTile = function (x, y) {
        var tilePosition = (y * this.width) + x;
        var tileObject = _.find(this.map.layers[2].objects, { x: this.tileWidth * x, y: this.tileHeight * (y + 1) });
        return {
            terrain: gidMap[this.map.layers[0].data[tilePosition]] || 'Void',
            blocked: _.includes(blockers, this.map.layers[1].data[tilePosition]),
            blocker: gidMap[this.map.layers[1].data[tilePosition]],
            region: this.regions[tilePosition] || 'Wilderness',
            object: tileObject,
            path: this.path
        };
    };
    return Map;
}());
exports.Map = Map;
