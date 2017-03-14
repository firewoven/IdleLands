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
var Coward = (function (_super) {
    __extends(Coward, _super);
    function Coward() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Coward.hasEarned = function (player) {
        return player.$statistics.getStat('Combat.Lose') >= 25;
    };
    return Coward;
}(personality_1.Personality));
Coward.disableOnActivate = ['Bloodthirsty'];
Coward.description = 'Your cowardice allows you to avoid combat more often.';
exports.Coward = Coward;
