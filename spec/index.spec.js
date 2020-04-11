/* global require,describe,it,expect */
'use strict';

describe('MainMenu', function () {

    var dispatcher = require('@crsincca/xrd-dispatch-module');

    it('should send plugin-hand-shake message', function () {
        dispatcher.on('plugin-hand-shake', function (payload) {
            expect(payload).toEqual('xrd-main-menu');
        });

        var menu = require('../index.jsx');
    });

});
