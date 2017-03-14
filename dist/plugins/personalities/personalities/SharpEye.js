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
var personality_1 = require("../personality");
var SharpEye = (function (_super) {
    __extends(SharpEye, _super);
    function SharpEye() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SharpEye.hasEarned = function (player) {
        return player.$statistics.getStat('Character.Item.Equip') >= 25;
    };
    return SharpEye;
}(personality_1.Personality));
SharpEye.description = 'You can more easily discern valuable equipment.';
exports.SharpEye = SharpEye;
