# AirbrakeNotice

Easy creation of Airbrake (or errbit) error notifications from Node.js or the browser

# Usage examples
## Node.js
```js
  var AirbrakeNotice = require("airbrake-notice");
  var version = "2.3";
  var notice = AirbrakeNotice(version);
  var message = notice.create({
    "apiKey": 'app-key',
    "notifier": {
      "name": 'my-notifier',
      "version": '0.3',
      "url": 'http://my-notifier.com'
    },
    "error": {
      "class": "ReferenceError",
      "message": "novar is not defined",
      "backtrace": [
        {
          "file": 'foo.js',
          "number": 4,
          "method": "saySomething"
        },
        {
          "file": 'bar.js',
          "number": 29,
          "method": "sayNoVar"
        }
      ]
    },
    "request": {
      "url": "http://example.com/pages/some-page.html",
      "component": "my-component",
      "action": "RunExample",
      "cgiData": {
        "SERVER_NAME": "example.org",
        "HTTP_USER_AGENT": "Mozilla"
      }
    },
    "serverEnvironment": {
      "name": "production",
      "projectRoot": "pages/",
      "appVersion": "1.0/"
    }
  });
```

Returns the following (as string):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<notice version="2.3">
  <api-key>d41d8cd98f00b204e9800998ecf8427e</api-key>
  <notifier>
    <name>my-notifier</name>
    <version>0.3</version>
    <url>http://my-notifier.com</url>
  </notifier>
  <error>
    <class>ReferenceError</class>
    <message>novar is not defined</message>
    <backtrace>
      <line method="saySomething" file="foo.js" number="">4</line>
      <line method="sayNoVar" file="bar.js" number="">29</line>
    </backtrace>
  </error>
  <request>
    <url>http://example.com/pages/some-page.html</url>
    <component>my-component</component>
    <action>RunExample</action>
    <cgi-data>example.org</cgi-data>
  </request>
  <server-environment>
    <project-root></project-root>
    <environment-name></environment-name>
    <app-version></app-version>
  </server-environment>
</notice>
```

## Browser
```js
  var notice = AirbrakeNotice("2.3")
  notice.create(/* data */);
```