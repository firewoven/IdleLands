"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var stat_calculator_1 = require("../../shared/stat-calculator");
var DirtyChecker = (function () {
    function DirtyChecker() {
        var _this = this;
        this._flags = {};
        _.each(stat_calculator_1.ALL_STATS.concat(['itemFindRange', 'itemFindRangeMultiplier']), function (stat) { return _this._flags[stat] = true; });
        this.flags = new Proxy({}, {
            get: function (target, name) {
                return _this._flags[name];
            },
            set: function (target, name) {
                _this._flags[name] = name;
                return true;
            }
        });
    }
    DirtyChecker.prototype.reset = function () {
        var _this = this;
        _.each(_.keys(this._flags), function (flag) { return _this._flags[flag] = false; });
    };
    return DirtyChecker;
}());
exports.DirtyChecker = DirtyChecker;
