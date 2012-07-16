(function() {
  
  // Function to hide the chrome module
  function request(action, callback) {
    chrome.extension.sendRequest({action: action}, callback);
  };
  
  //
  // Setup. 
  // Hook all keybindings into the current site.
  //
  request("keybindings", function(keybindings) {
    for(var prop in keybindings) {
      var keybinding = keybindings[prop];
      // eval is dangerous ... but should be fine here because no user
      // input is evaluated. Somehow invokeing the functions by scope
      // doesnt work.
      console.log(keybinding);
      Mousetrap.bind(keybinding.keys, eval(keybinding.fn));
    }
  });

  //
  // Display Functions
  //
  function showTabs() {
    request("tabs", function(response) {
      console.log("Tabs", response);
    });    
  };
  
}) ();
