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
              "timeout": 3000,
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
                  "assertName": "Customer is valid",
                  "assertType": "response",
                  "expression": "jsonData.customers[0].customerName=TELSTRA INTERNATIONAL LIMITED"
                },
                {
                  "assertName": "ucmid is valid",
                  "assertType": "response",
                  "expression": "jsonData.customers[0].ucmid=1000002040"
                },
                {
                  "assertName": "customer number is valid",
                  "assertType": "response",
                  "expression": "jsonData.customers[0].customerNumber=126141"
                }
              ]
            },
            {
              "testName": "Customer List APAC and HK1",
              "url": "http://sv2lxgppdi01.corp.equinix.com:9000/gpp/api/customersByRegionAndIbx/APAC/HK1/false",
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
                  "assertName": "Customer is valid",
                  "assertType": "response",
                  "expression": "jsonData.customers[0].customerName=HEWLETT PACKARD AUSTRALIA PTY LTD"
                },
                {
                  "assertName": "ucmid is valid",
                  "assertType": "response",
                  "expression": "jsonData.customers[0].ucmid=1000003008"
                },
                {
                  "assertName": "customer number is valid",
                  "assertType": "response",
                  "expression": "jsonData.customers[0].customerNumber=135074"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}