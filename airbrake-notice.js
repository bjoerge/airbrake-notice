(function (win) {

  function getProps(obj, props, undefined) {
    var prop;
    while (prop = props.shift()) {
      obj = obj[prop];
      if (typeof obj == 'undefined') return undefined;
    }
    return obj;
  }

  function render(template, data, decorators) {
    return template.replace(/#\{([^{}]*)\}/g, function (a, b) {
      var val = getProps(data, b.split("."));
      if (typeof val != 'undefined' && decorators && decorators.hasOwnProperty(b)) {
        val = decorators[b](val);
      }
      return typeof val === 'undefined' ? '' : val;
    });
  }

  var VERSIONS = {
    '2.3': {
      decorators: {
        'error.backtrace': function(backtrace) {
          return backtrace.map(function(line) {
            return render('<line method="#{method}" file="#{file}" number="#{number}"></line>', line)
          }).join("\n");
        },
        'request.cgiData': function(cgiData) {
          return Object.keys(cgiData).map(function(key) {
            return render('<var key="#{key}">#{value}</var>', {key: key, value: cgiData[key]})
          }).join("\n");
        }
      },
      template: '<notice version="2.3">\
                  <api-key>#{apiKey}</api-key>\
                  <notifier>\
                    <name>#{notifier.name}</name>\
                    <version>#{notifier.version}</version>\
                    <url>#{notifier.url}</url>\
                  </notifier>\
                  <error>\
                    <class>#{error.class}</class>\
                    <message>#{error.message}</message>\
                    <backtrace>\
                      #{error.backtrace}\
                    </backtrace>\
                  </error>\
                  <request>\
                    <url>#{request.url}</url>\
                    <component>#{request.component}</component>\
                    <action>#{request.action}</action>\
                    <cgi-data>\
                      #{request.cgiData}\
                    </cgi-data>\
                  </request>\
                  <server-environment>\
                    <project-root>#{serverEnvironment.projectRoot}</project-root>\
                    <environment-name>#{serverEnvironment.name}</environment-name>\
                    <app-version>#{serverEnvironment.appVersion}</app-version>\
                  </server-environment>\
                </notice>'.replace(/\s+/g, ' ')
    }
  };
  function AirbrakeNotice(version) {
    var api;
    if (!VERSIONS.hasOwnProperty(version)) throw new Error("Unsupported Airbrake API version "+version);
    api = VERSIONS[version];
    return {
      create: function(data) {
        return '<?xml version="1.0" encoding="UTF-8"?>\n'+render(api.template, data, api.decorators);
      }
    };
  }
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = AirbrakeNotice;
    }
  } else if (win) {
    win.AirbrakeNotice = AirbrakeNotice;
  }
}(typeof window !== 'undefined' && window));
