"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var map_1 = require("./map");
var fs = require("fs");
var Bosses = require("../../../assets/maps/content/boss.json");
var World = (function () {
    function World() {
        this.maps = {};
        this.uniqueRegions = [];
        this.loadAllMaps();
        this.loadAllCollectibles();
    }
    World.prototype.getMapsInFolder = function (dir) {
        var _this = this;
        var results = [];
        var list = fs.readdirSync(__dirname + '/../../../' + dir);
        _.each(list, function (basefilename) {
            var filename = dir + "/" + basefilename;
            var stat = fs.statSync(__dirname + '/../../../' + filename);
            if (_.includes(filename, 'promo'))
                return;
            if (stat && stat.isDirectory())
                results = results.concat(_this.getMapsInFolder(filename));
            else
                results.push({ map: basefilename.split('.')[0], path: __dirname + '/../../../' + filename });
        });
        return results;
    };
    World.prototype.loadAllMaps = function () {
        var _this = this;
        _.each(this.getMapsInFolder('assets/maps/world-maps'), function (_a) {
            var map = _a.map, path = _a.path;
            var mapRef = new map_1.Map(path, map);
            _this.maps[map] = mapRef;
            (_b = _this.uniqueRegions).push.apply(_b, _.uniq(_.compact(mapRef.regions)));
            var _b;
        });
    };
    World.prototype.loadAllCollectibles = function () {
        var _this = this;
        this.allCollectibles = {};
        _.each(Bosses, function (boss, bossName) {
            if (!boss.collectibles)
                return;
            _.each(boss.collectibles, function (coll) {
                coll.rarity = 'guardian';
                coll.map = 'Boss';
                coll.region = bossName;
                _this.allCollectibles[coll.name] = coll;
            });
        });
        _.each(_.values(this.maps), function (map) {
            _.extend(_this.allCollectibles, map.collectibles);
        });
    };
    return World;
}());
exports.World = World;
