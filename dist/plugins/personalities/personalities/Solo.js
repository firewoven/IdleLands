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
var Solo = (function (_super) {
    __extends(Solo, _super);
    function Solo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Solo.hasEarned = function (player) {
        return player.$statistics.getStat('Character.Party.Join') >= 5;
    };
    Solo.enable = function (player) {
        if (!player.party)
            return;
        _super.enable.call(this, player);
        player.party.playerLeave(player);
    };
    return Solo;
}(personality_1.Personality));
Solo.description = 'You will never join parties.';
exports.Solo = Solo;
