(function() {

  //
  // Constants
  //
  var justKeysHighlightClass = "justKeysHighlight";
  var justKeysHighlightNumberClass = "justKeysHighlightNumber";
  var h = JustKeysHelper;

  var Highlight = function (elements) {
    var text = "";
    return {
      getFilter: function() {
        return text;
      },
      addToFilter: function(character) {
        text += character;
      },  
      removeLastFromFilter: function() {
        text = text.substring(0, text.length-1);
      },
      filter: function() {
        var selection = {};
        for (var i in elements) {
          if (i.toString().indexOf(text) == 0) { 
            console.log("Match ", text, "->", i.toString());
            selection[i] = elements[i];
          }
        }
        return selection;
      }, 
      count: function() {
        return Object.keys(this.filter()).length;
      }
    }
  };

  //
  // Display Functions
  //
  function showTabs() {
    request("tabs", function(response) {
      // TODO: Implement this stuff ...
      console.log("Tabs", response);
    });    
  }
  
  function resetHighlightedLinks() {
    var elements = document.getElementsByClassName(justKeysHighlightClass);
    while(elements.length > 0) {
      h.removeClass(elements[0], justKeysHighlightClass);
    }
    elements = document.getElementsByClassName(justKeysHighlightNumberClass);
    while(elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  function shouldHighlight(element) {
    return h.hasLink(element) && h.elementInViewport(element) && h.isVisible(element);
  }

  function highlightLink(element, text) {
    var label = document.createElement("span");
    label.innerText = text;
    h.addClass(label, justKeysHighlightNumberClass);
    h.addClass(element, justKeysHighlightClass);
    h.insertAsFirst(element, label);
  }

  function highlightLinks() {
    var elements = document.getElementsByTagName("a");
    var highlights = {};
    var number = 1;
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      if (shouldHighlight(element)) {
        highlightLink(element, number);
        highlights[number] = element;
        number++;
      }
    }
    return highlights;
  }

  function bindSelectionKeys(highlights) {
    bindKeys("backspace", function() { highlights.removeLastFromFilter(); console.log(highlights.getFilter(), "->", highlights.count());;});
    for (var i = 0; i < 10; i++) {
      bindNumKey(highlights, i.toString());
    }
  }

  function bindNumKey(highlights, key) {
    bindKeys(key, function() { highlights.addToFilter(key); console.log(highlights.getFilter(), "->", highlights.count()); });
  }

  function initFollowLink() {
    resetHighlightedLinks();
    var elements = highlightLinks();    
    highlights = new Highlight(elements);
    bindSelectionKeys(highlights);
  }


  // Function to hide the chrome module
  function request(action, callback) {
    chrome.extension.sendRequest({action: action}, callback);
  }
  
  // Function to hide Mousetrap.js
  function bindKeys(keys, fn) {
    Mousetrap.bind(keys, fn);
  }

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
      console.log("Register Binding:", keybinding);
      bindKeys(keybinding.keys, eval(keybinding.fn));
    }
  });
  
}) ();
