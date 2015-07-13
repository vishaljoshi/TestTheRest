/**
 * @author Vishal Joshi
 * @desc this is small utility for validating the json and parsing it
 *
 */





var jsonParser = function() {

  var jsonValidate = function(jsonObj, exps) {
    if (exps) {
      var expArray = exps.split(".");
      while (expArray.length > 0 && jsonObj !== null) {
        var ex = expArray.shift();
        var match = new RegExp("(.+)\\[([0-9]*)\\]").exec(ex);
        if ((match !== null) && (match.length == 3)) {

          if (jsonObj[match[1]] !== undefined) {
            jsonObj = jsonObj[match[1]][match[2]];
          } else {
            jsonObj = null;
            break;
          }
        } else {
          jsonObj = jsonObj[ex];
        }
      }
    }
    return jsonObj;
  }

  return {
    parse: function(json, expression) {
      try {
        var data = null;
        if (typeof json == 'string' || json instanceof String) {
          data = JSON.parse(json);
        } else {
          data = json
        }

        var _out = jsonValidate(data, expression);
      } catch (er) {
        _out = null;
        console.error(er);
      }
      return _out;
    }
  }
}();
