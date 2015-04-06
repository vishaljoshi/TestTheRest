

/**
 * @author Vishal Joshi
 * @desc this is small utility for validating the json and parsing it
 * 
 */


var jsNavi = function() {

  var jsonValidate = function(jsonObj, exps) {
   var eq = null;
    if (exps) {
      //(^.+)(=)(.+$)
       var matchMain = new RegExp("(^.+)(=)(.+$)").exec(exps);
       if ((matchMain !== null) && (matchMain.length == 4)) {
         exps=matchMain[1];
         eq=matchMain[3];
       } 
       
      var expArray = exps.split(".");
      while (expArray.length > 0 && jsonObj !== null) {
        var ex = expArray.shift();
        var match = new RegExp("(.+)\\[([0-9]*)\\]").exec(ex);
        if ((match !== null) && (match.length == 3)) {
          
          if (jsonObj[match[1]] !== undefined) {
            jsonObj = jsonObj[match[1]][match[2]];
          } else {
           jsonObj=null;
            break ;
          }
        } else {
          jsonObj = jsonObj[ex];
        }
      }
       if (eq!=null) {
            match = new RegExp("(^true$)|(^false$)|(^[0-9]*\.?[0-9]*$)").exec(eq);
           if ((match !== null) && (match.length == 4)) {
              
             jsonObj = jsonObj == JSON.parse(match[1]!== undefined?match[1]:(match[2]!== undefined?match[2]:match[3]));
           }else{
             jsonObj = jsonObj ==eq;
           }
       }
      
    }
    return jsonObj;
  }

  return {
    startValidation: function(json, expression) {
      try {
        var data=null;
        if (typeof json == 'string' || json instanceof String){
          data = JSON.parse(json);
        }else{
          data=json
        }
        
        var _out = jsonValidate(data, expression);
      } catch (er) {
        _out=null;
        console.error(er);
      }
      return _out;
    }
  }
}();
