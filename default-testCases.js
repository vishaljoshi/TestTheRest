var defaultStruct = {
  "projects": [{
      "projectName": "default project",
      "projectDesc": "this is a first test 1 project",
      "baseUrl":"http://www.telize.com/geoip",
      "testSuits": [{
        "testSuitName": "default  test suit",
        "tests": [{
          "testName": "Geo Ip service",
          "url": "http://www.telize.com/geoip",
          "method": "GET",
          "timeout": 5000,
          "req_headers": [],
          "req_params":[],
          "res_assertions": [{
            "assertName": "longitude",
            "assertType":"response",
            "expression": "longitude"
          },{
            "assertName": "country",
            "assertType":"response",
            "expression": "country=Singapore"
          },{
            "assertName": "country_code",
            "assertType":"response",
            "expression": "country_code=SG"
          }]
        },{
          "testName": "Bit Coin",
          "url": "http://coinabul.com/api.php",
          "method": "GET",
          "timeout": 5000,
          "req_headers": [],
          "req_params":[],
          "res_assertions": [{
            "assertName": "BTC",
            "assertType":"response",
            "expression": "BTC"
          },{
            "assertName": "BTC value USD",
            "assertType":"response",
            "expression": "BTC.USD"
          },{
            "assertName": "BTC value USD",
            "assertType":"response",
            "expression": "BTC.Ounces"
          },{
            "assertName": "BTC value USD",
            "assertType":"response",
            "expression": "BTC.Grams"
          }]
        },{
          "testName": "Acronym Lookup",
          "url": "http://www.nactem.ac.uk/software/acromine/dictionary.py",
          "method": "GET",
          "timeout": 5000,
          "req_headers": [],
          "req_params":[{"sf":"BMI"} ],
          "res_assertions": [{
            "assertName": "Assert1",
            "assertType":"response",
            "expression": "0.sf=BMI"
          },{
            "assertName": "Assert2",
            "assertType":"response",
            "expression": "0.lfs[0].lf=body mass index"
          },{
            "assertName": "Assert3",
            "assertType":"response",
            "expression": "0.lfs[0].freq=15893"
          }]
        },{
              "testName": "random generator",
              "url": "http://qrng.anu.edu.au/API/jsonI.php",
              "method": "GET",
              "timeout": "5000",
              "req_headers": [],
              "req_params": [
                {
                  "length": "1"
                },
                {
                  "type": "uint8"
                }
              ],
              "res_assertions": [
                {
                  "assertName": "success",
                  "assertType": "response",
                  "expression": "success=true",
                  "assertStatus": "pass"
                },
                {
                  "assertName": "assert2",
                  "assertType": "response",
                  "expression": "data[0]",
                  "assertStatus": "pass"
                },
                {
                  "assertName": "assert3",
                  "assertType": "response",
                  "expression": "length=1",
                  "assertStatus": "pass"
                }
              ]
            }]
      }]
      }]
    }
