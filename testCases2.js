{
  "projects": [
    {
      "projectName": "PMP",
      "projectDesc": "Power Monitoring Portal",
      "testSuits": [
        {
          "testSuitName": "common service",
          "tests": [
            {
              "testName": "IBX list",
              "url": "http://sv2lxgppdi01.corp.equinix.com:9000/gpp/api/ibxsByRegion/APAC",
              "method": "get",
              "timeout": 7000,
              "req_headers": [
                {
                  "EMAIL": "vjoshi@ap.equinix.com"
                },
                {
                  "FIRSTNAME": "Vishal"
                },
                {
                  "LASTNAME": "Joshi"
                }
              ],
              "req_params": [],
              "res_assertions": [
                {
                  "assertName": " There are no errors",
                  "assertType": "response",
                  "expression": "errorList=0"
                },
                {
                  "assertName": "status is true",
                  "assertType": "response",
                  "expression": "success=true"
                },
                {
                  "assertName": "Region is valid",
                  "assertType": "response",
                  "expression": "jsonData.ibxs[0].region=APAC"
                },
                {
                  "assertName": "valid IBX exists",
                  "assertType": "response",
                  "expression": "jsonData.ibxs[0].ibxName=HK1"
                }
              ]
            },
            {
              "testName": "Customer List all APAC",
              "url": "http://sv2lxgppdi01.corp.equinix.com:9000/gpp/api/customersByRegionAndIbx/APAC/NA/false",
              "method": "get",
              "timeout": 10000,
              "req_headers": [
                {
                  "EMAIL": "vjoshi@ap.equinix.com"
                },
                {
                  "FIRSTNAME": "Vishal"
                },
                {
                  "LASTNAME": "Joshi"
                }
              ],
              "req_params": [],
              "res_assertions": [
                {
                  "assertName": " There has errors",
                  "assertType": "response",
                  "expression": "errorList=0"
                },
                {
                  "assertName": "status is not true",
                  "assertType": "response",
                  "expression": "success=true"
                },
                {
                  "assertName": "Customer is not valid",
                  "assertType": "response",
                  "expression": "jsonData.customers[323].customerName=LIQUIDNET ASIA LIMITED"
                },
                {
                  "assertName": "ucmid is not valid",
                  "assertType": "response",
                  "expression": "jsonData.customers[323].ucmid=1000001527"
                },
                {
                  "assertName": "customer number is not valid",
                  "assertType": "response",
                  "expression": "jsonData.customers[323].customerNumber=116853"
                }
              ]
            },
            {
              "testName": "Customer List APAC and HK1",
              "url": "http://sv2lxgppdi01.corp.equinix.com:9000/gpp/api/customersByRegionAndIbx/APAC/HK2/false",
              "method": "get",
              "timeout": 10000,
              "req_headers": [
                {
                  "EMAIL": "vjoshi@ap.equinix.com"
                },
                {
                  "FIRSTNAME": "Vishal"
                },
                {
                  "LASTNAME": "Joshi"
                }
              ],
              "req_params": [],
              "res_assertions": [
                {
                  "assertName": " There is error object",
                  "assertType": "response",
                  "expression": "errorList=0"
                },
                {
                  "assertName": "status is not true",
                  "assertType": "response",
                  "expression": "success=true"
                },
                {
                  "assertName": "Customer is not valid",
                  "assertType": "response",
                  "expression": "jsonData.customers[323].customerName=LIQUIDNET ASIA LIMITED"
                },
                {
                  "assertName": "ucmid is not valid",
                  "assertType": "response",
                  "expression": "jsonData.customers[323].ucmid=1000001527"
                },
                {
                  "assertName": "customer number is not valid",
                  "assertType": "response",
                  "expression": "jsonData.customers[323].customerNumber=116853"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}