(function() {

  //
  // Actions.
  // All actions defined here can be invoked by the frontend.
  //
  var actions = {

    keybindings: function(request, sender, response) {
      // TODO: Load keybindings from preferences
      // One Place to define action name, keybinding and the name of the
      // function to execute
      var bindings = {showTabs: {keys: "ctrl+c b", fn: "showTabs"},
                      highlightLinks: {keys: "f", fn: "highlightLinks"}}; 
      response(bindings);
    },

    tabs: function(request, sender, response) {
      // chrome query directly uses the response function to send back
      // the response
      chrome.tabs.query({currentWindow: true}, response);
    }
  };
  
  var justKeys = {
    
    /**
     * Dispatches the received message from the `JustKeys` frontend.
     * The messages should have the following type:
     * {action: "Name of the action" [, <extra option properties if needed>]}
     */
    dispatch: function(request, sender, response) {
      var action = actions[request.action];
      if (action) {
        action(request, sender, response);
      }
    }
  };
  
  // Expose `JustKeys` to the global object
  window.JustKeys = justKeys;
   
})();
 
 /**
  * Message Handling Setup
  */
 chrome.extension.onRequest.addListener(JustKeys.dispatch);
