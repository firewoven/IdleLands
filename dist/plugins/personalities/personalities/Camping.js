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
var Camping = (function (_super) {
    __extends(Camping, _super);
    function Camping() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Camping.hasEarned = function (player) {
        var hoursPlayed = Math.abs(player.joinDate - Date.now()) / 36e5;
        return hoursPlayed > 24 * 7;
    };
    Camping.enable = function (player) {
        if (!player.party)
            return;
        _super.enable.call(this, player);
        player.party.playerLeave(player);
    };
    return Camping;
}(personality_1.Personality));
Camping.description = 'You will not move or have any events affect you.';
exports.Camping = Camping;
