/**
 * LICENSE:
 *
 * This is lightweight JS plugin to provide AJAX form functionality.
 *
 * @author Ivanov Dmitry <me@ivanovdmitry.com>
 * @url http://ivanovdmitry.com/
 */
'use strict';
var ajaxForm = function(frm,cfg) {
    var config = {
        'fields': {},
        'url': '',
        'additional_params': {}
    }
    var events = {
        'sent': [],
        'fail': [],
        'failSend': [],
        'sending': [],
        'validate': [],
        'before': [],
    }
    var _this = this;
    var errors = [];

    if (typeof cfg == "object" && cfg.length > 0) {
        for (var cfgKey in cfg) {
            if (config.hasOwnProperty(cfgKey)) {
                config[cfgKey] = cfg[cfgKey];
            }
        }
    }

    if (typeof frm != 'object') {
        throw new Exception('Has been received wrong object ID');
    }

    if (typeof cfg.url == 'undefined' && typeof $(frm).attr("action") != "undefined") {
        cfg.url = $(frm).attr("action");
    }

    function _callEvent(event) {
        if (typeof events[event] == 'undefined') {
            return ;
        }
        if (events[event].length > 0) {
            for (var funcKey in events[event]) {
                if (typeof events[event][funcKey] == "function") {
                    if (arguments.length > 1) {
                        switch (arguments.length) {
                            case 2:
                                events[event][funcKey](arguments[1]);
                                break;
                            case 3:
                                events[event][funcKey](arguments[1],arguments[2]);
                                break;
                        }
                    } else {
                        events[event][funcKey]();
                    }

                }
            }
        }
    }

    frm.onsubmit = function() {
        _this.send();
        return false;
    };

    this.check = function() {
        var result = false;
        errors = [];
        for (var fKey in cfg.fields) {
            var field = cfg.fields[fKey];
            var element = $(frm).find(field.selector);
            if (field.required == false && element.val() == '') {
                continue;
            }
            if (!field.pattern.test(element.val())) {
                errors.push(field, fKey, field);
                _callEvent('validate',element, field);
            }
        }
        if (errors.length == 0) {
            result = true;
        }
        return result;
    }

    this.onSent = function(func) {
        if (typeof func == "function") {
            events.sent.push(func);
        }
    }

    this.onFail = function(func) {
        if (typeof func == "function") {
            events.fail.push(func);
        }
    }

    this.onSending = function(func) {
        if (typeof func == "function") {
            events.sending.push(func);
        }
    }

    this.onBeforeSend = function(func) {
        if (typeof func == "function") {
            events.before.push(func);
        }
    }

    this.onValidateError = function(func) {
        if (typeof func == "function") {
            events.validate.push(func);
        }
    }

    this.onFailSend = function(func) {
        if (typeof func == "function") {
            events.failSend.push(func);
        }
    }

    this.clear = function() {
        $(frm).find("input[type=text],input[type=email],input[type=url], textarea").val("");
        $(frm).find("input[type=radio]").removeAttr("selected");
        $(frm).find("input[type=checkbox]").prop("checked", false);
    }

    this.send = function() {
        _callEvent('before');
        if (!_this.check()) {
            _callEvent('fail');
            return false;
        }
        $.ajax({
            url: cfg.url,
            type: "POST",
            data: frm.serialize(),
            dataType: 'json',
        }).done(function(response) {
            _callEvent('sent', response);
        }).error(function() {
            _callEvent('failSend');
        });
    }

    this.getErrors = function() {
        return errors;
    }

    return this;
}