const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const debugging = true;
const baseurl = debugging ? 'https://api.testwyre.com' : 'https://api.sendwyre.com';
const submitKey = '/v2/sessions/auth/key';
const accountRoute = '/v3/accounts';

const STATUS_BAD_REQUEST = 400;

const multer  = require('multer');
const upload = multer({ });

app.post('/accounts', async (req, res) => {
    try {
        // Generate random token
        const buf = await crypto.randomBytes(25);
        const secretKey = Date.now() + buf.toString('base64').replace(/\//g,'').replace(/\+/g,'');

        // Wyre creds for processing the data on account creation
        const url = baseurl + submitKey;

        const configKey = {
            headers: {'Content-Type': 'application/json'}
        };

        console.log('secretKey: ', secretKey);

        let res = await axios.post(url, { secretKey }, configKey);

        const data = {
            "type":"INDIVIDUAL",
            "country": "US",
            "subaccount": true,
            "profileFields":[
              {
                "fieldId": "individualLegalName",
                "value": "John Nikolas O'Sullivan"
              },
              {
                "fieldId": "individualEmail",
                "value": "jnosullivan+1@icloud.com"
              },
              {
                "fieldId": "individualResidenceAddress",
                "value": {
                  "street1": "1 Market St",
                  "street2": "Suite 402",
                  "city": "San Francisco",
                  "state": "CA",
                  "postalCode": "94105",
                  "country": "US"
                }
              }
            ]
          };

        console.log(res.data);
        console.log(data);

        const configAccount = {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secretKey
            }
        };

        let resaccount = await axios.post(baseurl + accountRoute, data, configAccount);
        console.log(resaccount.data);
    
        res.json({ submitResponse });
    } catch (error) {
        res.status(STATUS_BAD_REQUEST);
        res.json({ error });
    }
});

app.get('/accounts', async (req, res) => {
    try {
        const config = {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secretKey
            }
        };

        let response = await axios.get(baseurl + accountRoute + '/' + accountId, config);

        res.json({ account: response.data || { } });
    } catch (error) {
        res.status(STATUS_BAD_REQUEST);
        res.json({ error });
    }
});



app.put('/accounts/:id', upload.single('file'), async (req, res) => {
    try {
        // Debugging

        const { params: { id }, body } = req;

        let baseRequest = {
            'type':'INDIVIDUAL',
            'country': 'US',
            'subaccount': true,
            'profileFields': []
        };

        const fieldMap = {
           'legalName': 'individualLegalName',
           'phone': 'individualCellphoneNumber',
           'email': 'individualEmail',
           'residenceAddress': 'individualResidenceAddress',
           'ssn': 'individualSsn',
           'sourceOfFunds': 'individualSourceOfFunds'
        };

        let fileUpload = false;
        let fileType = '';

        switch(id) {
            case 'details':
                for (key of Object.keys(body)) {
                    if (fieldMap[key]) {
                        baseRequest['profileFields'].push({
                            'fieldId': fieldMap[key], 'value': body[key]
                        });
                    }
                }
                break;
            case 'govid':
                fileUpload = true;
                fileType = 'individualGovernmentId';
                break;
            case 'poa':
                fileUpload = true;
                fileType = 'individualProofOfAddress';
                break;
            default:
                throw new Error('XXX');
        }

        let account;
        if (!fileUpload) {
            const config = {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secretKey
                }
            };

            let response = await axios.post(baseurl + accountRoute + '/' + accountId, baseRequest, config);
            account = response.data;
        } else {
            const { mimetype, buffer } = req.file;

            const config = {
                headers: { 
                    'Content-Type': mimetype,
                    'Authorization': 'Bearer ' + secretKey
                }
            };
            let response = await axios.post(baseurl + accountRoute + '/' + accountId + '/' + fileType, buffer, config);
            account = response.data;
        }

        res.json({ account: account || { } });
    } catch (e) {
        res.status(400);
        res.json({ error: e });
    }
});

app.listen(port, () => console.log(`${port}`))