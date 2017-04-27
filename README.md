# AjaxForm - Lightweight jQuery AJAX form plugin.

<a href="http://ivanovdmitry.com/" target="_blank">Plugin official page</a>

## About

This plugin provides follow functions:

* Validate data before submit
* Useful event model

Plugin expects that response will be in JSON.

# AjaxForm - Lightweight jQuery AJAX form plugin.

<a href="http://ivanovdmitry.com/" target="_blank">Plugin official page</a>

## About

This plugin provides follow functions:

* Validate data before submit
* Useful event model

Plugin expects that response will be in JSON.

The plugin is an ideal solution for creating feedback, survey and other forms.

The plugin doesn't support file uploading.

## Installation:

Include jQuery first.

```javascript
    <script language="javascript" src="https://code.jquery.com/jquery-3.2.1.min.js">
```    

Just add the script on your page:

```javascript
    <script language="javascript" src="/ajaxform/dist/ajaxform.jquery.min.js"></script>
```

That's all! You don't need anything else!

## Usage

### Initialization

```javascript
    $("#form").ajaxForm();
```

The plugin automatically scans your form and find input in it.
If input element is required in your form it would be marked as required in the plugin.
You can also use pattern input attribute for pass pattern of needle element's value.
You can also specify element name in "data-name" attribute.

For example:

```html
    <input type="text" name="floor" value="" pattern="\d+" data-name="Floor number" required />
```

If you want to specify certain field options you can provide it in validate_options.fields element.

Validate_options must be JavaScript object with follow properties:

```javascript
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
```

Validate options array is optional.

The plugin also supports anti-spam protection:

You can specify the secret key in your config array and check it further in backend module.
The plugin will add hidden field contains your secret key value.

Example:

```javascript
    var validate_options = {
       ...
       'secretkey': '<secretkey>',
       ...
    }
```

The plugin doesn't support file uploading.

### Functions

There a few useful functions in the plugin:

#### Check

You can call this function if you need to check form data and submit it.
This function also automatically called when the form is being submitted.

#### Clear

This function automatically cleans all user data in the form. Usually, it can be called after successful form sending.

### Events

There are some useful event in the plugin:

#### onBeforeSend(<plugin instance>)

This event is triggered before sending a form.
As a parameter, this function receives a link to the plugin instance.

#### onSent(<plugin instance>, <response>)

Final event when a form has been sent.
As the first parameter, this function receives a link to the plugin instance.
As second parameter this function receives server response.

#### onSending(<plugin instance>)

This event is called before data check and send. You can use it to add preloader in your form (for example).
As a parameter, this function receives a link to the plugin instance.

#### onValidationFailed(<plugin instance>)

A common event that data checking hasn't been successfully completed.
There were errors found while checking data.
As a parameter, this function receives a link to the plugin instance.

#### onValidationFieldError(<plugin instance>,<selector>,<field from config>)

This event is called when there is an error while field data checking.
The first parameter is a link to the plugin instance.
The second parameter is element selector.
The third parameter is a row from config array about this field.

#### onFailSend(<plugin instance>,<error>)

This is a common event that sending was failed.
As the first parameter, this function receives a link to the plugin instance.
As second parameter this function receives error object.

## Support

You can write me on me@ivanovdmitry.com if you found a bug or have a question.