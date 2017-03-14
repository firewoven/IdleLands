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
var Delver = (function (_super) {
    __extends(Delver, _super);
    function Delver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Delver.hasEarned = function (player) {
        return player.$statistics.getStat('Character.Movement.Ascend') >= 5;
    };
    return Delver;
}(personality_1.Personality));
Delver.description = 'You will never go up stairs, because the thrill of adventure is too great.';
exports.Delver = Delver;
