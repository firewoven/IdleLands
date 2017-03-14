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
var event_1 = require("../event");
var adventure_log_1 = require("../../../shared/adventure-log");
var _emitter_1 = require("../../players/_emitter");
exports.WEIGHT = -1;
// Get given the opportunity to change classes
var ProfessionChange = (function (_super) {
    __extends(ProfessionChange, _super);
    function ProfessionChange() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProfessionChange.operateOn = function (player, _a) {
        var professionName = _a.professionName, trainerName = _a.trainerName;
        var otherOfSame = _.find(player.choices, function (choice) { return choice.event === 'ProfessionChange'; });
        if (player.professionName === professionName || otherOfSame) {
            var message_1 = this._parseText("%player met with " + trainerName + ", the " + professionName + " trainer, but already has an offer from a different trainer.", player);
            this.emitMessage({ affected: [player], eventText: message_1, category: adventure_log_1.MessageCategories.PROFESSION });
            return;
        }
        var id = event_1.Event.chance.guid();
        var message = "Would you like to change your profession to " + professionName + "?";
        var extraData = { professionName: professionName, trainerName: trainerName };
        player.addChoice({ id: id, message: message, extraData: extraData, event: 'ProfessionChange', choices: ['Yes', 'No'] });
    };
    ProfessionChange.makeChoice = function (player, id, response) {
        if (response !== 'Yes')
            return;
        var choice = _.find(player.choices, { id: id });
        player.changeProfession(choice.extraData.professionName);
        _emitter_1.emitter.emit('player:changeclass', { player: player, choice: choice });
    };
    return ProfessionChange;
}(event_1.Event));
ProfessionChange.WEIGHT = exports.WEIGHT;
exports.ProfessionChange = ProfessionChange;
