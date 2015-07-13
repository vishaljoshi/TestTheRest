var jsonAssertions = function(jsonParser) {
var jsonParser=jsonParser;
  var funcUtil = {
    isNumber: function(val) {
      return (val - 0) == val && ('' + val).trim().length > 0;
    },
    isFloat: function(val) {
      return (!isNaN(val) && val.toString().indexOf('.') != -1);
    },
    isString: function(val) {
      return (typeof val == 'string')
    },
    has: function(expsValue, testValue) {
      return (expsValue.indexOf(testValue[0]) != -1)
    },
    arrayLength: function(expsValue) {
      if (expsValue instanceof Array) {
        return expsValue.length;
      }
      return null;
    },
    arrayHas: function(expsValue,testValue) {
      if (expsValue instanceof Array) {
        for (var i = 0; i < expsValue.length; i++) {
          if (jsonParser.parse(expsValue[i], testValue[0]).indexOf(testValue[1]) != -1) {
              return true;
          }
        }
      }
      return false;

    },
    regTest: function(expsValue, testValue) {
      var patt = new RegExp(testValue[0]);
      return patt.test(expsValue[0]);
    }

  }

  var evaluate = function(l, r, o) {
    switch (o) {
      case '=':
        return l == r;
      case '!=':
        return l != r;
      case '>':
        return l > r;
      case '<':
        return l < r;
      case '=>':
        var funcMatch = new RegExp('(^[^(]+)([(])(.*)([)])').exec(r);
        var eq = null;
        var fn = funcMatch[1];
        if ((eq = funcMatch[3]) !== undefined && ((eq = eq.trim()) && /^\".*\"$/.test(eq))) {
          eq = eq.substring(1, eq.length - 1);
          var t = eq.split("\",\"");
          if(t){
            eq=t;
          }
        }
        if (fn != null) {
          var _function = funcUtil[fn];
          if (_function) {
            return _function(l, eq)
          }
        }


        return true;
    }

  }

  var assertion = function(json, exps) {
    var op = null;
    var eq = null;
    var fn = null;
    if (exps) {
      var matchMain = new RegExp('(^.+?)(\!=|=>|=|>|<)(.+$)').exec(exps);
      if ((matchMain !== null) && (matchMain.length == 4)) {
        exps = matchMain[1];
        op = matchMain[2];
        if (matchMain[3] !== undefined) {
          eq = matchMain[3].trim();
          if (/^\".*\"$/.test(eq)) {
            // string
            eq = eq.substring(1, eq.length - 1);
          } else {
            var match = new RegExp("(^null$)|(^true$)|(^false$)|(^[0-9]*\.?[0-9]*$)").exec(eq);
            if ((match !== null) && (match.length == 5)) {
              eq = match[1] !== undefined ? null : (match[2] !== undefined ? true : (match[3] !== undefined ? false : match[4]));
            }
          }


        }
      }
      // match the function
      var funcMatch = new RegExp('((^isNumber)|(^isFloat)|(^has)|(^arrayLength)|(^arrayHas))([(])(.*)([)])').exec(exps);
      if ((funcMatch !== null) && (funcMatch.length == 10)) {
        exps = funcMatch[8]
        fn = funcMatch[1];

      }
    }

    json = jsonParser.parse(json, exps);

    if (fn != null) {
      var _function = funcUtil[fn];
      if (_function) {
        json = _function(json)
      }
    }
    if (op != null) {
      json = evaluate(json, eq, op);
    }
    return json;
  }

  return {
    assert: assertion,
    jsonParser:jsonParser
  }
}(jsonParser);
