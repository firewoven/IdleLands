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
var effect_1 = require("../effect");
var AllStatsDown = (function (_super) {
    __extends(AllStatsDown, _super);
    function AllStatsDown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AllStatsDown.prototype.affect = function (target) {
        var _this = this;
        _.each(['str', 'dex', 'agi', 'luk', 'int', 'con'], function (stat) {
            _this.setStat(target, stat, -_this.statByPercent(target, stat, _this.potency));
        });
    };
    return AllStatsDown;
}(effect_1.Effect));
exports.AllStatsDown = AllStatsDown;
