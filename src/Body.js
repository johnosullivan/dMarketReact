import React from 'react'
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
//import AddProduct from './AddProduct';
import ipfsClient from 'ipfs-http-client';
import randomstring from 'randomstring';

import abi from './abi.json';

import dataProvider from './DataProvider';

import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import PubSub from 'pubsub-js';
import { Document, Page } from 'react-pdf';

import path from 'path';

import cryptojs from 'crypto-js';
import aesjs from 'aes-js';
import { sha256, sha224 } from 'js-sha256';
import { or } from 'ip';


const web3 = new window.Web3(window.web3.currentProvider);

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];

class Body extends React.Component {

  state = {
    numPages: null,
    pageNumber: 1,
    file: '',
    version: '',
    price: '',
    description: '',
    name:'',
    author: '',
    acontract: ''
  }

  constructor(props) {
    super(props);


    this.fileManager = web3.eth.contract(abi.filemanager).at('0x97d6ad12e0a15156fbe5f59d2c67a7ebd8ae7f4e');
    this.file = web3.eth.contract(abi.file);
    this.tempfile = {};
  }

  back = () => {
    this.setState({ pageNumber: --this.state.pageNumber });
  }

  forward = () => {
    this.setState({ pageNumber: ++this.state.pageNumber });
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  bytesToHex = (bytes) => {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
  }

  hexToBytes = (hex) => {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  }

  async handleAddDCFile(selectorFiles) {

    //const dataProvider = DataProvider['DataProvider'];
    //await dataProvider.addFile(selectorFiles[0], { });

  /*  const x = dataProvider['dataProvider'];

    const data = await x.addFile(selectorFiles[0], { });
    console.log(data);
    this.tempfile = data;
*/

    this.setState({ file: selectorFiles[0]});
    /*
    var reader = new FileReader();
    var self = this;

    reader.onload = async function() {
      const password = randomstring.generate();

      const rawData = new Uint8Array(reader.result);
      const hexData = self.bytesToHex(rawData);
      const encryptData = cryptojs.AES.encrypt(hexData, password).toString();

      let ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
      let content = ipfs.types.Buffer.from(encryptData);
      let results = await ipfs.add(content);
      let hash = results[0].hash;

      const data = self.fileManager.addFile.getData("application/pdf",hash,"chuck","name",'Resume.pdf',"Accepisse has partiales reliquiae archetypi consortio uti. Sequentium tum tur falsitatem realitatis usu. Eae probatur qualitas singulae cui supponam arbitror quadrati. Facultates satyriscos exponantur me ac at continuata ne excoluisse perfectior. Praesertim sae cucurbitas quantumvis sua objectioni secernitur cogitantem duo. Res qualis quinta sub loquor cau soleam multae etc mandat. To in nulli novam pappo athei sequi ausim ei. Diversi et ex occasio agnosci divelli im videmus. Cum creatione industria mea cur sic cerebella. ");
      const result = await self.sendTransaction(data, '0x97d6ad12e0a15156fbe5f59d2c67a7ebd8ae7f4e');

      const fileData = await ipfs.cat(hash);
      const decryptbytes  = cryptojs.AES.decrypt(fileData.toString('utf8'), password);
      const encoding = decryptbytes.toString(cryptojs.enc.Utf8);
      const bytes = new Uint8Array(self.hexToBytes(encoding));

      const blob = new Blob([bytes], { type: 'application/pdf' });
      const urlCreator = window.URL || window.webkitURL;
      const file = urlCreator.createObjectURL(blob);

      self.setState({ file });
    }
    reader.readAsArrayBuffer(selectorFiles[0]);*/

  }

  uploadDataIPFS = async (data) => {
    let ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
    let content = ipfs.types.Buffer.from(data);
    let results = await ipfs.add(content);
    return results[0];
  };

  testingIPFS = async () => {
    console.log('testingIPFS');

    const bytecode = '60806040523480156200001157600080fd5b50604051620013a2380380620013a2833981018060405260808110156200003757600080fd5b8101908080516401000000008111156200005057600080fd5b828101905060208101848111156200006757600080fd5b81518560018202830111640100000000821117156200008557600080fd5b50509291906020018051640100000000811115620000a257600080fd5b82810190506020810184811115620000b957600080fd5b8151856001820283011164010000000082111715620000d757600080fd5b50509291906020018051640100000000811115620000f457600080fd5b828101905060208101848111156200010b57600080fd5b81518560018202830111640100000000821117156200012957600080fd5b505092919060200180516401000000008111156200014657600080fd5b828101905060208101848111156200015d57600080fd5b81518560018202830111640100000000821117156200017b57600080fd5b5050929190505050600260606040519081016040528085815260200184815260200186815250908060018154018082558091505090600182039060005260206000209060030201600090919290919091506000820151816000019080519060200190620001ea929190620002e6565b50602082015181600101908051906020019062000209929190620002e6565b50604082015181600201908051906020019062000228929190620002e6565b505050508060039080519060200190620002449291906200036d565b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060018060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550505050506200041c565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200032957805160ff19168380011785556200035a565b828001600101855582156200035a579182015b82811115620003595782518255916020019190600101906200033c565b5b509050620003699190620003f4565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620003b057805160ff1916838001178555620003e1565b82800160010185558215620003e1579182015b82811115620003e0578251825591602001919060010190620003c3565b5b509050620003f09190620003f4565b5090565b6200041991905b8082111562000415576000816000905550600101620003fb565b5090565b90565b610f76806200042c6000396000f3fe6080604052600436106100b9576000357c0100000000000000000000000000000000000000000000000000000000900480639596797911610081578063959679791461049b578063c124a900146104d6578063c4a85bc114610505578063c6d48e0d1461056e578063e167944514610599578063f088d5471461064d576100b9565b80630178fe3f146100bb57806312065fe01461020e5780632d361af31461023957806367709e2b146103a25780638823da6c14610432575b005b3480156100c757600080fd5b506100f4600480360360208110156100de57600080fd5b8101908080359060200190929190505050610691565b604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001838103835285818151815260200191508051906020019080838360005b8381101561016a57808201518184015260208101905061014f565b50505050905090810190601f1680156101975780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156101d05780820151818401526020810190506101b5565b50505050905090810190601f1680156101fd5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b34801561021a57600080fd5b50610223610895565b6040518082815260200191505060405180910390f35b34801561024557600080fd5b506103a06004803603606081101561025c57600080fd5b81019080803590602001909291908035906020019064010000000081111561028357600080fd5b82018360208201111561029557600080fd5b803590602001918460018302840111640100000000831117156102b757600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561031a57600080fd5b82018360208201111561032c57600080fd5b8035906020019184600183028401116401000000008311171561034e57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506108b4565b005b3480156103ae57600080fd5b506103b761097e565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103f75780820151818401526020810190506103dc565b50505050905090810190601f1680156104245780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561043e57600080fd5b506104816004803603602081101561045557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610a20565b604051808215151515815260200191505060405180910390f35b3480156104a757600080fd5b506104d4600480360360208110156104be57600080fd5b8101908080359060200190929190505050610b2a565b005b3480156104e257600080fd5b506104eb610bd8565b604051808215151515815260200191505060405180910390f35b34801561051157600080fd5b506105546004803603602081101561052857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c2c565b604051808215151515815260200191505060405180910390f35b34801561057a57600080fd5b50610583610d34565b6040518082815260200191505060405180910390f35b3480156105a557600080fd5b506105d2600480360360208110156105bc57600080fd5b8101908080359060200190929190505050610d41565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156106125780820151818401526020810190506105f7565b50505050905090810190601f16801561063f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61068f6004803603602081101561066357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610e03565b005b6000606080600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615156106ee57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660028581548110151561071f57fe5b906000526020600020906003020160000160028681548110151561073f57fe5b9060005260206000209060030201600101818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107e55780601f106107ba576101008083540402835291602001916107e5565b820191906000526020600020905b8154815290600101906020018083116107c857829003601f168201915b50505050509150808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108815780601f1061085657610100808354040283529160200191610881565b820191906000526020600020905b81548152906001019060200180831161086457829003601f168201915b505050505090509250925092509193909250565b60003073ffffffffffffffffffffffffffffffffffffffff1631905090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561090f57600080fd5b8160028481548110151561091f57fe5b90600052602060002090600302016000019080519060200190610943929190610e5d565b508060028481548110151561095457fe5b90600052602060002090600302016001019080519060200190610978929190610e5d565b50505050565b606060038054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610a165780601f106109eb57610100808354040283529160200191610a16565b820191906000526020600020905b8154815290600101906020018083116109f957829003601f168201915b5050505050905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610a7d57600080fd5b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16159050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610b8557600080fd5b600281815481101515610b9457fe5b906000526020600020906003020160008082016000610bb39190610edd565b600182016000610bc39190610edd565b600282016000610bd39190610edd565b505050565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c8957600080fd5b60018060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050919050565b6000600280549050905090565b6060600282815481101515610d5257fe5b90600052602060002090600302016002018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610df75780601f10610dcc57610100808354040283529160200191610df7565b820191906000526020600020905b815481529060010190602001808311610dda57829003601f168201915b50505050509050919050565b60018060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610e9e57805160ff1916838001178555610ecc565b82800160010185558215610ecc579182015b82811115610ecb578251825591602001919060010190610eb0565b5b509050610ed99190610f25565b5090565b50805460018160011615610100020316600290046000825580601f10610f035750610f22565b601f016020900490600052602060002090810190610f219190610f25565b5b50565b610f4791905b80821115610f43576000816000905550600101610f2b565b5090565b9056fea165627a7a7230582031b70e8ae2b2640734ff49094fc2a41952ad84f92c2a80fa748d433bd00cf4850029';

    const {
      fileHash,
      hashDetails,
      password
    } = this.tempfile;

    // Contract object
    const contract = web3.eth.contract(abi['file']);

    // Deploy contract instance
    const contractInstance = contract.new('v1.0', fileHash, password, hashDetails, {
      data: bytecode,
      from: web3.eth.defaultAccount
    }, (err, res) => {
      if (err) {
          console.log(err);
          return;
      }

      console.log(res.transactionHash);

      if (res.address) { console.log('Contract address: ' + res.address); }
    });
    /*
    const data = {
      'productName':'COMP 150 Study Guide',
      'productTags':'Study Guide,PDF,LUC,COMP 150'
    };
    const results = await this.uploadDataIPFS(JSON.stringify(data));
    console.log(results);
    */
  };


  getMyFilesCount = async () => {
    const self = this;
    return new Promise(function(resolve, reject) {
      self.fileManager.getMyFilesCount(function(err, data) {
        if (err) { reject(err); } else { resolve(data['c'][0]); }
      });
    });
  };

  getMyFilesAt = async (index) => {
    const self = this;
    return new Promise(function(resolve, reject) {
      self.fileManager.getMyFilesAt(index, function(err, data) {
        if (err) { reject(err); } else { resolve(data); }
      });
    });
  };

  getFilePublicDetails = async (address) => {
    const self = this;
    return new Promise(function(resolve, reject) {
      self.file.at(address).getPublicDetails(function(err, data) {
        if (err) { reject(err); } else { resolve(data); }
      });
    });
  };

  add = async () => {
    const bytecode = '60806040523480156200001157600080fd5b50604051620013a2380380620013a2833981018060405260808110156200003757600080fd5b8101908080516401000000008111156200005057600080fd5b828101905060208101848111156200006757600080fd5b81518560018202830111640100000000821117156200008557600080fd5b50509291906020018051640100000000811115620000a257600080fd5b82810190506020810184811115620000b957600080fd5b8151856001820283011164010000000082111715620000d757600080fd5b50509291906020018051640100000000811115620000f457600080fd5b828101905060208101848111156200010b57600080fd5b81518560018202830111640100000000821117156200012957600080fd5b505092919060200180516401000000008111156200014657600080fd5b828101905060208101848111156200015d57600080fd5b81518560018202830111640100000000821117156200017b57600080fd5b5050929190505050600260606040519081016040528085815260200184815260200186815250908060018154018082558091505090600182039060005260206000209060030201600090919290919091506000820151816000019080519060200190620001ea929190620002e6565b50602082015181600101908051906020019062000209929190620002e6565b50604082015181600201908051906020019062000228929190620002e6565b505050508060039080519060200190620002449291906200036d565b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060018060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550505050506200041c565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200032957805160ff19168380011785556200035a565b828001600101855582156200035a579182015b82811115620003595782518255916020019190600101906200033c565b5b509050620003699190620003f4565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620003b057805160ff1916838001178555620003e1565b82800160010185558215620003e1579182015b82811115620003e0578251825591602001919060010190620003c3565b5b509050620003f09190620003f4565b5090565b6200041991905b8082111562000415576000816000905550600101620003fb565b5090565b90565b610f76806200042c6000396000f3fe6080604052600436106100b9576000357c0100000000000000000000000000000000000000000000000000000000900480639596797911610081578063959679791461049b578063c124a900146104d6578063c4a85bc114610505578063c6d48e0d1461056e578063e167944514610599578063f088d5471461064d576100b9565b80630178fe3f146100bb57806312065fe01461020e5780632d361af31461023957806367709e2b146103a25780638823da6c14610432575b005b3480156100c757600080fd5b506100f4600480360360208110156100de57600080fd5b8101908080359060200190929190505050610691565b604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001838103835285818151815260200191508051906020019080838360005b8381101561016a57808201518184015260208101905061014f565b50505050905090810190601f1680156101975780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156101d05780820151818401526020810190506101b5565b50505050905090810190601f1680156101fd5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b34801561021a57600080fd5b50610223610895565b6040518082815260200191505060405180910390f35b34801561024557600080fd5b506103a06004803603606081101561025c57600080fd5b81019080803590602001909291908035906020019064010000000081111561028357600080fd5b82018360208201111561029557600080fd5b803590602001918460018302840111640100000000831117156102b757600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561031a57600080fd5b82018360208201111561032c57600080fd5b8035906020019184600183028401116401000000008311171561034e57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506108b4565b005b3480156103ae57600080fd5b506103b761097e565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103f75780820151818401526020810190506103dc565b50505050905090810190601f1680156104245780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561043e57600080fd5b506104816004803603602081101561045557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610a20565b604051808215151515815260200191505060405180910390f35b3480156104a757600080fd5b506104d4600480360360208110156104be57600080fd5b8101908080359060200190929190505050610b2a565b005b3480156104e257600080fd5b506104eb610bd8565b604051808215151515815260200191505060405180910390f35b34801561051157600080fd5b506105546004803603602081101561052857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c2c565b604051808215151515815260200191505060405180910390f35b34801561057a57600080fd5b50610583610d34565b6040518082815260200191505060405180910390f35b3480156105a557600080fd5b506105d2600480360360208110156105bc57600080fd5b8101908080359060200190929190505050610d41565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156106125780820151818401526020810190506105f7565b50505050905090810190601f16801561063f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61068f6004803603602081101561066357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610e03565b005b6000606080600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615156106ee57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660028581548110151561071f57fe5b906000526020600020906003020160000160028681548110151561073f57fe5b9060005260206000209060030201600101818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107e55780601f106107ba576101008083540402835291602001916107e5565b820191906000526020600020905b8154815290600101906020018083116107c857829003601f168201915b50505050509150808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108815780601f1061085657610100808354040283529160200191610881565b820191906000526020600020905b81548152906001019060200180831161086457829003601f168201915b505050505090509250925092509193909250565b60003073ffffffffffffffffffffffffffffffffffffffff1631905090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561090f57600080fd5b8160028481548110151561091f57fe5b90600052602060002090600302016000019080519060200190610943929190610e5d565b508060028481548110151561095457fe5b90600052602060002090600302016001019080519060200190610978929190610e5d565b50505050565b606060038054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610a165780601f106109eb57610100808354040283529160200191610a16565b820191906000526020600020905b8154815290600101906020018083116109f957829003601f168201915b5050505050905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610a7d57600080fd5b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16159050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610b8557600080fd5b600281815481101515610b9457fe5b906000526020600020906003020160008082016000610bb39190610edd565b600182016000610bc39190610edd565b600282016000610bd39190610edd565b505050565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c8957600080fd5b60018060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050919050565b6000600280549050905090565b6060600282815481101515610d5257fe5b90600052602060002090600302016002018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610df75780601f10610dcc57610100808354040283529160200191610df7565b820191906000526020600020905b815481529060010190602001808311610dda57829003601f168201915b50505050509050919050565b60018060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610e9e57805160ff1916838001178555610ecc565b82800160010185558215610ecc579182015b82811115610ecb578251825591602001919060010190610eb0565b5b509050610ed99190610f25565b5090565b50805460018160011615610100020316600290046000825580601f10610f035750610f22565b601f016020900490600052602060002090810190610f219190610f25565b5b50565b610f4791905b80821115610f43576000816000905550600101610f2b565b5090565b9056fea165627a7a7230582031b70e8ae2b2640734ff49094fc2a41952ad84f92c2a80fa748d433bd00cf4850029';

    const {
      author,
      name,
      description,
      price,
      version,
      file
    } = this.state;
    const provider = dataProvider['dataProvider'];
    const { hashDetails, fileHash, password } = await provider.addFile(file, { author, name, description, price, version });

    // Contract object
    const contract = web3.eth.contract(abi['file']);

    // Deploy contract instance
    const contractInstance = contract.new(version, fileHash, password, hashDetails, {
      data: bytecode,
      from: web3.eth.defaultAccount
    }, (err, res) => {
      if (err) {
          console.log(err);
          return;
      }

      console.log(res.transactionHash);

      if (res.address) { console.log('Contract address: ' + res.address); }
    });
  }

  sendTransaction = (data, address) => {
    const transactionData = data;
    const transactionAddress = address;
    return new Promise(function(resolve, reject) {
        web3.eth.sendTransaction({from: web3.currentProvider.selectedAddress , to: transactionAddress, data: transactionData }, function(err, transactionHash) {
          if (err) {
            reject(err);
          } else {
            resolve(transactionHash);
          }
        });
    });
  }

  load = () => {
    const { acontract } = this.state;

    // Contract object
    const contract = web3.eth.contract(abi['file']).at(acontract);

    contract.getData.call(0, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
      }
    });

    console.log(contract);
  };

  render() {
    console.log('Body: ', this.props);

    const { pageNumber, numPages, file } = this.state;

    const listItems = this.props.productListings.map((item, i) =>
      <div key={item.id}>{item.title}</div>
    );

//0x8119aaBc94CdE2aB47d0C9Bc60d4829514b89481

    return (
      <Container text style={{ marginTop: '5em', marginBottom: '2em' }}>


<div>
        <Document
          file={file}
          onLoadSuccess={this.onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <p>Page {pageNumber} of {numPages}</p>

      </div>
        <br/>
        <TextField
          id="version"
          label="Version"
          margin="normal"
          value={this.state.version} onChange={(event) => { this.setState({version: event.target.value}); }}
        />
        <br/>
        <TextField
          id="name"
          label="Name"
          margin="normal"
          value={this.state.name} onChange={(event) => { this.setState({name: event.target.value}); }}
        />
        <br/>
        <TextField
          id="description"
          label="Description"
          margin="normal"
          value={this.state.description} onChange={(event) => { this.setState({description: event.target.value}); }}
        />
        <br/>
        <TextField
          id="price"
          label="Price"
          margin="normal"
          value={this.state.price} onChange={(event) => { this.setState({price: event.target.value}); }}
        />
        <br/>
        <TextField
          id="author"
          label="Author"
          margin="normal"
          value={this.state.author} onChange={(event) => { this.setState({author: event.target.value}); }}
        />
        <br/>
        <input onChange={ (e) => this.handleAddDCFile(e.target.files) } type='file'/>
        <br/>
        <br/>
        <Button variant="contained" color="secondary" onClick={this.add}>
            Add
        </Button>
        <br/>
        <br/>
        <br/>
        <br/>
        <TextField
          id="address_contract"
          label="Address Contract"
          margin="normal"
          value={this.state.acontract} onChange={(event) => { this.setState({acontract: event.target.value}); }}
        />
        <br/>
        <br/>
        <Button variant="contained" color="secondary" onClick={this.load}>
            Load
        </Button>
      </Container>
  );
  };

}

function mapStateToProps(state, ownProps) {
  console.log(state);
  return {
    productListings: state.dmarket.productListings
  }
}
export default connect(mapStateToProps)(Body)
