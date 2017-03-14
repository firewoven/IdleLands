"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
exports.migrate = function (player) {
    var choiceMigrate = _.get(player.$statistics.stats, 'Character.Choice.Choose');
    if (!_.isObject(choiceMigrate)) {
        _.set(player.$statistics.stats, 'Character.Choice.Choose', {});
    }
    var profMigrate = _.get(player.$statistics.stats, 'Character.Professions');
    if (!_.isObject(profMigrate)) {
        _.set(player.$statistics.stats, 'Character.Professions', {});
    }
    var mapMigrate = _.get(player.$statistics.stats, 'Character.Maps');
    if (!_.isObject(mapMigrate)) {
        _.set(player.$statistics.stats, 'Character.Maps', {});
    }
    var regionMigrate = _.get(player.$statistics.stats, 'Character.Regions');
    if (!_.isObject(regionMigrate)) {
        _.set(player.$statistics.stats, 'Character.Regions', {});
    }
};
