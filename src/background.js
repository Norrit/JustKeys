window.JustKeys = (function (tabs) {
    "use strict";
    //
    // Actions.
    // All actions defined here can be invoked by the frontend.
    //
    var actions = {
        keybindings: function (request, sender, response) {
            // TODO: Load keybindings from preferences
            // One place to define action name, keybinding, keycode and the name of the
            // function to execute
            var bindings = {
                followLink: {keys: "f", fn: "initFollowLink", keyCode: 70},
                gotoLink: {keys: "g", fn: "initGotoLink", keyCode: 71},
                gotoLinkInBackground: {keys: "G", fn: "initGotoLinkInBackground", keyCode: 71},
                esc: {keys: "esc", fn: "reset", keyCode: null},
                remove: {keys: "d", fn: "removeLastCharacter", keyCode: 68}
            };
            response(bindings);
        },

        follow: function (request, sender, response) {
            tabs.update({url: request.url}, response);
        },

        goto: function (request, sender, response) {
            tabs.create({url: request.url, active: request.active}, response);
        },

        filter: function (request, sender, response) {
            var filter = [
                {
                    urlRegex: ".*google.*",
                    classes: ["kl", "kls", "lcos", "fl", "gbqla", "gbt", "gbzt", "gbgt", "ab_button", "q", "qs", "gbmt", "ab_dropdownchecklist", "ab_dropdownlnk", "pplsrsl"]
                }
            ];
            response(filter);
        }
    };

    return {
        /**
         * Dispatches the received message from the `JustKeys` frontend.
         * The messages should have the following type:
         * {action: "Name of the action" [, <extra option properties if needed>]}
         */
        dispatch: function (request, sender, response) {
            var action = actions[request.action];
            if (action) {
                action(request, sender, response);
            }
        }
    };

}(chrome.tabs));

/**
 * Message Handling Setup
 */
chrome.extension.onRequest.addListener(JustKeys.dispatch);
