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
exports.WEIGHT = -1;
// Get given the opportunity to leave party
var PartyLeave = (function (_super) {
    __extends(PartyLeave, _super);
    function PartyLeave() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PartyLeave.operateOn = function (player) {
        if (event_1.Event.chance.bool({ likelihood: 75 }))
            return;
        var otherOfSame = _.find(player.choices, function (choice) { return choice.event === 'PartyLeave'; });
        if (otherOfSame)
            return;
        var id = event_1.Event.chance.guid();
        var message = 'Would you like to leave your party?';
        player.addChoice({ id: id, message: message, extraData: {}, event: 'PartyLeave', choices: ['Yes', 'No'] });
    };
    PartyLeave.makeChoice = function (player, id, response) {
        if (response !== 'Yes' || !player.party)
            return;
        player.party.playerLeave(player);
    };
    return PartyLeave;
}(event_1.Event));
PartyLeave.WEIGHT = exports.WEIGHT;
exports.PartyLeave = PartyLeave;
