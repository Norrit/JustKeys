(function (window, tabs) {

    //
    // Actions.
    // All actions defined here can be invoked by the frontend.
    //
    var actions = {

        keybindings: function (request, sender, response) {
            // TODO: Load keybindings from preferences
            // One place to define action name, keybinding and the name of the
            // function to execute
            var bindings = {followLink: {keys: "f", fn: "initFollowLink"},
                            gotoLink: {keys: "g", fn: "initGotoLink"}};
            response(bindings);
        },

        tabs: function (request, sender, response) {
            // chrome query directly uses the response function to send back
            // the response
            tabs.query({currentWindow: true}, response);
        },

        follow: function(request, sender, response) {
            tabs.update({url: request.url}, response);
        },

        goto: function(request, sender, response) {
            tabs.create({url: request.url}, response);
        }
    };

    // Expose `JustKeys` to the global object
    window.JustKeys = {

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

})(window, chrome.tabs);

/**
 * Message Handling Setup
 */
chrome.extension.onRequest.addListener(JustKeys.dispatch);
