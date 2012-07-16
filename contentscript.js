(function() {

  //
  // Constants
  //
  var justKeysHighlightClass = "justKeysHighlight";
  var justKeysHighlightNumberClass = "justKeysHighlightNumber";

  //
  // Helper Functions.
  // Don't want to inject a "big" library into the site.
  //
  function addClass (element, className) {
    if (!hasClass(element, className)) {
      if (element.className) {
        element.className += " " + className;
      } else {
        element.className = className;
      }
    }
  }
  
  function removeClass (element, className) {
    var regexp = addClass[className];
    if (!regexp) {
      regexp = addClass[className] = new RegExp("(^|\\s)" + className + "(\\s|$)");
    }
    element.className = element.className.replace(regexp, "$2");
  }
  
  function hasClass (element, className) {
    var regexp = addClass[className];
    if (!regexp) {
      regexp = addClass[className] = new RegExp("(^|\\s)" + className + "(\\s|$)");
    }
    return regexp.test(element.className);
  }
  
  function toggleClass (element, className) {
    if (hasClass(element, className)) {
      removeClass(element, className);
    } else {
      addClass(element, className);
    }
  }

  function elementInViewport(el) {
    var rect = el.getBoundingClientRect()
    return (rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth)
  }

  function isVisible(element) {
    if (element && element.tagName.toLowerCase() != "body") {
      return element.style.display != "none"
        && isVisible(element.parentNode);
    }
    return true;
  }

  function insertAsFirst(parent, element) {
    if (parent.firstChild) {
      parent.insertBefore(element, parent.firstChild);
    } else {
      parent.appendChild(element);
    }
  }


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
      removeClass(elements[0], justKeysHighlightClass);
    }
    elements = document.getElementsByClassName(justKeysHighlightNumberClass);
    while(elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  function hasLink(element) {
    return element.href && element.href != "" && element.href != "#";
  }

  function shouldHighlight(element) {
    return elementInViewport(element) && isVisible(element) && hasLink(element);
  }

  function highlightLink(element, text) {
    var label = document.createElement("span");
    label.innerText = text;
    addClass(label, justKeysHighlightNumberClass);
    addClass(element, justKeysHighlightClass);
    insertAsFirst(element, label);
  }

  function highlightLinks() {
    resetHighlightedLinks();
    var elements = document.getElementsByTagName("a");
    var number = 1;
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      if (shouldHighlight(element)) {
        highlightLink(element, number++);
      }
    }
  }

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
      console.log("Register Binding:", keybinding);
      Mousetrap.bind(keybinding.keys, eval(keybinding.fn));
    }
  });
  
}) ();
