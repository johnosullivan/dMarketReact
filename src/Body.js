import React from 'react'
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
//import AddProduct from './AddProduct';
import ipfsClient from 'ipfs-http-client';
import randomstring from 'randomstring';

import abi from './abi.json';

import DataProvider from './DataProvider';

import {
  Button
} from 'react-bootstrap';

import PubSub from 'pubsub-js';
import { Document, Page } from 'react-pdf';

import path from 'path';

import cryptojs from 'crypto-js';
import aesjs from 'aes-js';
import { sha256, sha224 } from 'js-sha256';
import { or } from 'ip';


const web3 = new window.Web3(window.web3.currentProvider);

class Body extends React.Component {

  state = {
    numPages: null,
    pageNumber: 1,
    file: ''
  }

  constructor(props) {
    super(props);


    this.fileManager = web3.eth.contract(abi.filemanager).at('0x97d6ad12e0a15156fbe5f59d2c67a7ebd8ae7f4e');
    this.file = web3.eth.contract(abi.file);
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

    const dataProvider = DataProvider['DataProvider'];

    await dataProvider.addFile(selectorFiles[0], { });

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

    const bytecode = '0x60806040523480156200001157600080fd5b50604051620010b1380380620010b1833981018060405260408110156200003757600080fd5b8101908080516401000000008111156200005057600080fd5b828101905060208101848111156200006757600080fd5b81518560018202830111640100000000821117156200008557600080fd5b50509291906020018051640100000000811115620000a257600080fd5b82810190506020810184811115620000b957600080fd5b8151856001820283011164010000000082111715620000d757600080fd5b50509291905050508160029080519060200190620000f792919062000119565b5080600390805190602001906200011092919062000119565b505050620001c8565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200015c57805160ff19168380011785556200018d565b828001600101855582156200018d579182015b828111156200018c5782518255916020019190600101906200016f565b5b5090506200019c9190620001a0565b5090565b620001c591905b80821115620001c1576000816000905550600101620001a7565b5090565b90565b610ed980620001d86000396000f3fe6080604052600436106100b9576000357c01000000000000000000000000000000000000000000000000000000009004806395a078e81161008157806395a078e81461039e578063a3ffd0f014610407578063c124a90014610497578063c4a85bc1146104c6578063d2c0e0321461052f578063f088d547146106ae576100b9565b806312065fe0146100bb57806324c8c698146100e65780633bc5de301461017657806367709e2b146102a55780638823da6c14610335575b005b3480156100c757600080fd5b506100d06106f2565b6040518082815260200191505060405180910390f35b3480156100f257600080fd5b506100fb610711565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561013b578082015181840152602081019050610120565b50505050905090810190601f1680156101685780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561018257600080fd5b5061018b6107af565b604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001838103835285818151815260200191508051906020019080838360005b838110156102015780820151818401526020810190506101e6565b50505050905090810190601f16801561022e5780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b8381101561026757808201518184015260208101905061024c565b50505050905090810190601f1680156102945780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b3480156102b157600080fd5b506102ba610975565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102fa5780820151818401526020810190506102df565b50505050905090810190601f1680156103275780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561034157600080fd5b506103846004803603602081101561035857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610a17565b604051808215151515815260200191505060405180910390f35b3480156103aa57600080fd5b506103ed600480360360208110156103c157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610b21565b604051808215151515815260200191505060405180910390f35b34801561041357600080fd5b5061041c610b41565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561045c578082015181840152602081019050610441565b50505050905090810190601f1680156104895780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156104a357600080fd5b506104ac610bdf565b604051808215151515815260200191505060405180910390f35b3480156104d257600080fd5b50610515600480360360208110156104e957600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c33565b604051808215151515815260200191505060405180910390f35b34801561053b57600080fd5b506106ac6004803603606081101561055257600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019064010000000081111561058f57600080fd5b8201836020820111156105a157600080fd5b803590602001918460018302840111640100000000831117156105c357600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561062657600080fd5b82018360208201111561063857600080fd5b8035906020019184600183028401116401000000008311171561065a57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290505050610d3b565b005b6106f0600480360360208110156106c457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610dae565b005b60003073ffffffffffffffffffffffffffffffffffffffff1631905090565b60028054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107a75780601f1061077c576101008083540402835291602001916107a7565b820191906000526020600020905b81548152906001019060200180831161078a57829003601f168201915b505050505081565b6000606080600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151561080c57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660026003818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108c75780601f1061089c576101008083540402835291602001916108c7565b820191906000526020600020905b8154815290600101906020018083116108aa57829003601f168201915b50505050509150808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109635780601f1061093857610100808354040283529160200191610963565b820191906000526020600020905b81548152906001019060200180831161094657829003601f168201915b50505050509050925092509250909192565b606060028054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610a0d5780601f106109e257610100808354040283529160200191610a0d565b820191906000526020600020905b8154815290600101906020018083116109f057829003601f168201915b5050505050905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610a7457600080fd5b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16159050919050565b60016020528060005260406000206000915054906101000a900460ff1681565b60038054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bd75780601f10610bac57610100808354040283529160200191610bd7565b820191906000526020600020905b815481529060010190602001808311610bba57829003601f168201915b505050505081565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c9057600080fd5b60018060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050919050565b826000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508160029080519060200190610d91929190610e08565b508060039080519060200190610da8929190610e08565b50505050565b60018060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610e4957805160ff1916838001178555610e77565b82800160010185558215610e77579182015b82811115610e76578251825591602001919060010190610e5b565b5b509050610e849190610e88565b5090565b610eaa91905b80821115610ea6576000816000905550600101610e8e565b5090565b9056fea165627a7a72305820b9b392d856e68322e657c9ff29e54c887c4f654920d8ba59998d623350bee8f10029';


    /*let MyContract = web3.eth.contract(abi['file']);
    const myContract = new web3.eth.Contract(['Rama','Nick'], {
      from: this.public_address,
      gasPrice: '20000000000',
      data: bytecode
    });*/

    // Contract object
  const contract = web3.eth.contract(abi['file']);

  // Deploy contract instance
  const contractInstance = contract.new('a','b',{
      data: bytecode,
      from: '0xf56eEBd4A787Ab0FBa4fEd65a3A4ed77CB330A9B',
      gas: 200000*6
  }, (err, res) => {
      if (err) {
          console.log(err);
          return;
      }

      // Log the tx, you can explore status with eth.getTransaction()
      console.log(res.transactionHash);

      // If we have an address property, the contract was deployed
      if (res.address) {
          console.log('Contract address: ' + res.address);
          // Let's test the deployed contract
      }
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



  testTrasaction = async () => {


    const d = DataProvider['DataProvider'];

    const getMyFiles = await d.getMyFiles();

    console.log(getMyFiles);


/*
    Contract.getMyFilesAt(0, function(err, data) {
      if (err) {
      }
      console.log(data);
  });*/

/*
    const address = '0xb565e58bda6f31647719a1b162080e982f80bc87';
    let FileManager = web3.eth.contract(abi.filemanager);
    let Contract = FileManager.at(address);
    const data = Contract.addFile.getData("","","","","","description");

    try {
      const result = await this.sendTransaction(data, address);
      console.log(result);
    } catch (error) { } */

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

  testGetFiles = () => {

  };

  render() {
    console.log('Body: ', this.props);

    const { pageNumber, numPages, file } = this.state;

    const listItems = this.props.productListings.map((item, i) =>
      <div key={item.id}>{item.title}</div>
    );



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
        <Button variant="primary" onClick={this.back}>
                  B
                </Button>
                <Button variant="primary" onClick={this.forward}>
                  F
                </Button>
                <Button variant="primary" onClick={this.testTrasaction}>
                  Test Transaction
                </Button>
                <Button variant="primary" onClick={this.testingIPFS}>
                  Test IPFS
                </Button>
      </div>
        <br/>
        <br/>
        <input onChange={ (e) => this.handleAddDCFile(e.target.files) } type='file'/>
        <br/>

        {listItems}

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
