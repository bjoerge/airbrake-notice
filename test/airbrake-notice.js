var fs = require("fs");
var assert = require("assert");
var AirbrakeNotice = require("../");


describe('AirbrakeNotice', function(){
  describe('#create()', function(){
    it('match expected output', function(){
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
      assert.equal(message, fs.readFileSync(__dirname + "/expectation.xml").toString());
    })
  })
})