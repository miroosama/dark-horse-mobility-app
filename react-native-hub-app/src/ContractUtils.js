import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { USER_DEMO_ETH_PVK_G, USER_DEMO_ETH_ADR_G } from 'react-native-dotenv';

const MobilityCampaignsContract = require('./assets/MobilityCampaigns.json');

export async function getWeb3() {
  const web3 = await new Web3(
      new Web3.providers.HttpProvider('http://127.0.0.1:8545')
  );
  if (web3) return web3;
}

export async function getAdContract(web3) {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = MobilityCampaignsContract.networks[networkId]
  const mobilityInstance = new web3.eth.Contract(
    MobilityCampaignsContract.abi,
    deployedNetwork && deployedNetwork.address,
  );
  return mobilityInstance;
}

// export async function getAd(mobilityInstance) {
//   const tx = {
//     from: fromAddress,
//     to: toAddress,
//     gas: gasLimit,
//     value: value,
//     data: mobilityInstance.methods.getAd().encodeABI()
//   };
//   const signPromise = web3.eth.accounts.signTransaction(tx, privateKey)
//   .then((signedTx) => {
//     const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
//     sentTx.on("receipt", receipt => {
//       // do something when receipt comes back
//       });
//       sentTx.on("error", err => {
//         // do something on transaction error
//       });
//     }).catch((err) => {
//       console.log(err)
//   });
// }

export async function getActiveCampaignIds(mobilityInstance) {
  const activeCampaignIds = await mobilityInstance.getActiveCampaignIdsUsers({
    from : USER_DEMO_ETH_ADR_G
  });
  return activeCampaignIds;
}

export async function getAd(mobilityInstance, activeCampaignIds) {
  const id = sample(activeCampaignIds);
  const data = await mobilityInstance.getActiveCampaignUsers(id, { from: USER_DEMO_ETH_ADR_G });
  const fileData = await fleekStorage.getFileFromHash({ hash: data.ipfsHash });

  return {
    organization: data.organization,
    title: data.title,
    ad: fileData
  };
}

export async function enableNewUser(web3, mobilityInstance) {
  const tx = {
    from: USER_DEMO_ETH_ADR_G,
    to: '0xEAA2812e5E9cddce4cb7eDBEb4b9f91340DCbB26',
    gas: 1000000,
    data: mobilityInstance.methods.enableNewUser().encodeABI()
  };
  const signPromise = web3.eth.accounts.signTransaction(tx, USER_DEMO_ETH_PVK_G)
  .then((signedTx) => {
    const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
    sentTx.on("receipt", receipt => {
      console.log(receipt)
      });
      sentTx.on("error", err => {
        console.log(err)
      });
  }).catch((err) => {
        console.log(err)
  });
}
