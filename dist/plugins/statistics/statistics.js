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
var Statistics = (function () {
    function Statistics(container) {
        var _this = this;
        var StatisticsDb = require('./statistics.db').StatisticsDb;
        try {
            container.schedulePostConstructor(function (statisticsDb) {
                _this.statisticsDb = statisticsDb;
            }, [StatisticsDb]);
        }
        catch (e) {
            logger_1.Logger.error('Statistics', e);
        }
    }
    // clear current variables and set new
    Statistics.prototype.init = function (opts) {
        this._id = undefined;
        this.stats = undefined;
        _.extend(this, opts);
    };
    Statistics.prototype.getStat = function (stat) {
        var val = _.get(this.stats, stat, 0);
        if (!_.isObject(val) && !_.isFinite(val) || _.isNaN(val)) {
            val = 0;
            this.setStat(stat, 0);
            logger_1.Logger.error('Statistics', new Error("Someone has infinity or NaN for " + stat + ". Fix it!"));
        }
        return val;
    };
    Statistics.prototype._addStat = function (stat, value) {
        if (value === void 0) { value = 1; }
        if (!_.isFinite(value)) {
            logger_1.Logger.error('Statistics', new Error("Someone is attempting to add a non-finite number to " + stat + ". Fix it!"));
            return;
        }
        var val = _.get(this.stats, stat, 0);
        var oldVal = val;
        val += value;
        if (_.isNaN(val))
            val = _.isNaN(oldVal) ? 0 : oldVal;
        _.set(this.stats, stat, val);
    };
    Statistics.prototype.setStat = function (stat, value) {
        if (value === void 0) { value = 1; }
        if (!_.isFinite(value) || !_.isNumber(value)) {
            logger_1.Logger.error('Statistics', new Error("Someone is attempting to set a non-finite number to " + stat + ". Fix it!"));
            return;
        }
        _.set(this.stats, stat, value);
    };
    Statistics.prototype.countChild = function (stat) {
        var obj = _.get(this.stats, stat, {});
        return _.sum(_.values(obj)) || 0;
    };
    Statistics.prototype.incrementStat = function (stat, value, doSave) {
        if (value === void 0) { value = 1; }
        if (doSave === void 0) { doSave = false; }
        this._addStat(stat, value);
        if (doSave) {
            this.save();
        }
    };
    Statistics.prototype.batchIncrement = function (stats, doSave) {
        var _this = this;
        if (doSave === void 0) { doSave = false; }
        _.each(stats, function (stat) { return _this._addStat(stat); });
        if (doSave) {
            this.save();
        }
    };
    Statistics.prototype.save = function () {
        this.statisticsDb.saveStatistics(this);
    };
    return Statistics;
}());
Statistics = __decorate([
    constitute_1.Dependencies(constitute_1.Container),
    __metadata("design:paramtypes", [Object])
], Statistics);
exports.Statistics = Statistics;
