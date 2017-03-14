"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Achievement = (function () {
    function Achievement() {
    }
    Achievement.achievementData = function () { };
    Achievement.log = function (base, number) {
        return Math.log(number) / Math.log(base);
    };
    return Achievement;
}());
exports.Achievement = Achievement;
exports.AchievementTypes = {
    PROGRESS: 'Progress',
    EXPLORE: 'Explore',
    COMBAT: 'Combat',
    SPECIAL: 'Special',
    EVENT: 'Event',
    PET: 'Pet'
};
