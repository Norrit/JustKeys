'use strict';

// Mock some chrome functions
var fn = function () {
};
window.chrome = {};
window.chrome.tabs = {};
window.chrome.tabs.update = fn;
window.chrome.tabs.create = fn;

describe('Background Page', function () {
    it('should define the JustKeys module', function () {
        expect(JustKeys).toBeDefined();
    });
});

describe('JustKeys Module', function () {
    it('should return all available actions', function () {
        expect(JustKeys.actions).toBeDefined();
        expect(Object.keys(JustKeys.actions).length).toBeGreaterThan(0);
    });

    it('should call action if dispatch message is received', function () {
        var request = {action: 'echo'},
            sender = {},
            response = function (response) {
                expect(response).toBe(response);
            };
        JustKeys.dispatch(request, sender, response);
    });
});

describe('Action keybindings', function () {
    it('should return the list of keybindings', function () {
        var validateKeybindingFormat = function (key) {
            var keybinding = this[key];
            expect(Object.keys(keybinding).length).toEqual(3);
            expect(keybinding.keys).toBeDefined();
            expect(keybinding.fn).toBeDefined();
            expect(keybinding.keyCode).toBeDefined();
        };
        JustKeys.dispatch({action: 'keybindings'}, {}, function (response) {
            var keybindings = Object.keys(response);
            expect(keybindings.length).toBeGreaterThan(0);
            keybindings.forEach(validateKeybindingFormat.bind(response));
        });
    });
});

describe('Action filter', function () {
    it('should return the list of filtered sites and elements', function () {
        var validateFilterFormat = function (filter) {
            expect(Object.keys(filter).length).toEqual(2);
            expect(filter.urlRegex).toBeDefined();
            expect(filter.classes).toBeDefined();
            expect(filter.classes.length).toBeGreaterThan(0);
        };
        JustKeys.dispatch({action: 'filter'}, {}, function (filter) {
            expect(filter.length).toBeGreaterThan(0);
            filter.forEach(validateFilterFormat);
        });
    });
});


describe("Action follow", function () {
    it('should update url of the current tab', function () {
        var res = {},
            url = 'url',
            callback = function (response) {
                expect(response).toBe(res);
            };
        spyOn(chrome.tabs, 'update').andReturn(res);
        JustKeys.dispatch({action: 'follow', url: url}, {}, callback);
        expect(chrome.tabs.update).toHaveBeenCalledWith({url: url}, callback);
    });
});

describe("Action goto", function () {
    it('should open url in new tab (and pass along background state)', function () {
        var res = {},
            url = 'url',
            active = true,
            callback = function (response) {
                expect(response).toBe(res);
            };
        spyOn(chrome.tabs, 'create').andReturn(res);
        JustKeys.dispatch({action: 'goto', url: url, active: active}, {}, callback);
        expect(chrome.tabs.create).toHaveBeenCalledWith({url: url, active: active}, callback);
    });
});