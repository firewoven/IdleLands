"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var asset_loader_1 = require("./asset-loader");
var StringGenerator = (function () {
    function StringGenerator() {
    }
    StringGenerator._stringFromGrammar = function (grammar) {
        if (!grammar)
            return '';
        return _.map(grammar.split(' '), function (piece) {
            if (!_.includes(piece, '%'))
                return piece;
            return _.sample(asset_loader_1.StringAssets[piece.split('%')[1]]);
        })
            .join(' ');
    };
    StringGenerator.providence = function () {
        var grammar = _.sample(asset_loader_1.StringAssets.providenceGrammar);
        return this._stringFromGrammar(grammar);
    };
    StringGenerator.battle = function () {
        var grammar = _.sample(asset_loader_1.StringAssets.battleGrammar);
        return this._stringFromGrammar(grammar);
    };
    StringGenerator.party = function () {
        var grammar = _.sample(asset_loader_1.StringAssets.partyGrammar);
        return this._stringFromGrammar(grammar);
    };
    return StringGenerator;
}());
exports.StringGenerator = StringGenerator;
