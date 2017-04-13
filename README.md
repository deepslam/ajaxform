# AjaxForm - Lightweight jQuery AJAX form plugin.

<a href="http://ivanovdmitry.com/" target="_blank">Plugin official page</a>

## About

This plugin provides follow functions:

* Validate data before submit
* Useful event model

Plugin expects that response will be in JSON.

The plugin'll be ideal solution for creating feedback, survey and another forms.

The plugin doesn't support file uploading.

## Installation:

Include jQuery first.

	<script language="javascript" src="https://code.jquery.com/jquery-3.2.1.min.js">

Just add script on your page:

	<script language="javascript" src="/ajaxform/dist/ajaxform.jquery.min.js"></script>

That's all! You don't need anything else!

## Usage

	var form = new feedbackForm(<form object>,validate_options);

<form object> is jQuery object with form. For example $("#form").

validate_options must be JavaScript object with follow properties:

	var validate_options = {
	   'fields': {
		   <field id>: {
			   'name': <field name>,
			   'pattern': <preg match for check>,
			   'required': <is field required?>,
			   'selector': <jQuery selector>,
		   },
		   etc
	   }
	}