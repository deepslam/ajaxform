/**
 * LICENSE:
 *
 * This is lightweight JS plugin to provide AJAX form functionality.
 *
 * @author Ivanov Dmitry <me@ivanovdmitry.com>
 * @url http://ivanovdmitry.com/
 */
'use strict';
jQuery.fn.ajaxForm = function(cfg) {
    var config = $.extend({
        'fields': {},
        'url': '',
        'errorClass': 'error',
        'secretkey': '',
        'secretkeyFieldName': 'frm_secret',
    }, cfg );
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
    var frm = this;
    if (String(jQuery(frm).get(0).nodeName).toUpperCase() != 'FORM') {
        if (jQuery(frm).find("form").length != 0) {
            frm = jQuery(frm).find("form").first();
        } else if (jQuery(frm).closest("form").length != 0) {
            frm = jQuery(frm).closest("form").first();
        }

    }

    if (typeof jQuery(frm).data("form") != "undefined") {
        return jQuery(frm).data("form");
    }

    this.data("form", this);

    if ((typeof cfg == "undefined" || typeof cfg.url == 'undefined')) {
        if (typeof jQuery(frm).attr("action") != "undefined") {
            config.url = jQuery(frm).attr("action");
        } else if (jQuery(frm).find("form").attr("action") != "undefined") {
            config.url = jQuery(frm).find("form").attr("action");
        } else if (jQuery(frm).closest("form").first().attr("action") != "undefined") {
            config.url = jQuery(frm).closest("form").first().attr("action");
        }
    }

    _addSecretField();
    _generateFieldsArray();

    function _addSecretField() {
        if (config.secretkey == '' || config.secretkeyFieldName == '') {
            return ;
        }
        if (frm.find('input[name=' +  config.secretkeyFieldName + ']').length > 0) {
            frm.find('input[name=' +  config.secretkeyFieldName + ']').val(config.secretkey);
        } else {
            frm.append('<input type="hidden" name="' + config.secretkeyFieldName + '" value="' + config.secretkey + '" />')
        }
    }

    function _getFieldType(field) {
        var type = 'text',
            nodeType = String(jQuery(field).get(0).nodeName).toUpperCase(),
            result = '';
        switch (nodeType) {
            case 'INPUT':
                    if (jQuery(field).attr("type")) {
                        result = String(jQuery(field).attr("type")).toUpperCase();
                    } else {
                        result = nodeType;
                    }
                break;
            default:
                    result = nodeType;
                break;
        }
        return result;
    }

    function _getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function _generateFieldsArray() {
        jQuery(frm).find("input,textarea").each(function(e) {
            var ident = jQuery(this).attr("name"),
                type = _getFieldType(jQuery(this)),
                element = {
                    pattern:    jQuery(this).attr("pattern"),
                    name:       jQuery(this).data("name"),
                    message:    jQuery(this).data("message"),
                    selector:   jQuery(this),
                    required:   (jQuery(this).prop('required') ? true : false)
                };

            if (typeof config.fields[ident] != 'undefined') {//Skip existing fields
                return ;
            }
            if (typeof ident == "undefined") {
                return ;
            }
            if (type == 'SUBMIT') {
                return ;
            }
            if (typeof element.pattern == "undefined") {
                switch (type) {
                    case 'TEL':
                            element.pattern = /^[+]?[\d]*[\s]*[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]*[0-9]+$/i;
                        break;
                    case 'EMAIL':
                            element.pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
                        break;
                    default:
                            element.pattern = /.+/i
                        break;
                }
            } else {
                element.pattern = new RegExp(element.pattern, 'i');
            }
            config.fields[ident] = element;
        });
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
                                events[event][funcKey](_this,arguments[1]);
                                break;
                            case 3:
                                events[event][funcKey](_this,arguments[1],arguments[2]);
                                break;
                        }
                    } else {
                        events[event][funcKey](_this);
                    }

                }
            }
        }
    }

    jQuery(frm).on("submit", function () {
        _this.send();
        return false;
    });

    this.check = function() {
        var result = false,
            checkResult = false;
        errors = [];
        for (var fKey in config.fields) {
            var field = config.fields[fKey];
            var element = field.selector;
            element.removeClass(config.errorClass);
            if (field.required == false && element.val() == '') {
                continue;
            }
            checkResult = field.pattern.test(element.val());
            if (checkResult == false) {
                element.addClass(config.errorClass);
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

    this.onValidationFailed = function(func) {
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

    this.onValidationFieldError = function(func) {
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
        jQuery(frm).find("input[type=text],input[type=email],input[type=url], textarea").val("");
        jQuery(frm).find("input[type=radio]").removeAttr("selected");
        jQuery(frm).find("input[type=checkbox]").prop("checked", false);
    }

    this.send = function() {
        _callEvent('before');
        if (!_this.check()) {
            _callEvent('fail');
            return false;
        }
        jQuery.ajax({
            url: config.url,
            type: "POST",
            data: jQuery(frm).serialize(),
            dataType: 'json',
        }).done(function(response) {
            _callEvent('sent', response);
        }).error(function(error) {
            _callEvent('failSend', error);
        });
    }

    this.getErrors = function() {
        return errors;
    }

    return this;
}