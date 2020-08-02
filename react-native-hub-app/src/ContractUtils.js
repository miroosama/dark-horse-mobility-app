import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import {
  REACT_APP_FLEEK_API_KEY,
  REACT_APP_FLEEK_API_SECRET,
  USER_DEMO_ETH_PVK_G,
  USER_DEMO_ETH_ADR_G } from 'react-native-dotenv';
import fleekStorage from '@fleekhq/fleek-storage-js';

const MobilityCampaignsContract = require('./assets/MobilityCampaigns.json');
const ADS_DIRECTORY = 'campaigns';
const BUCKET = 'hackfs-dark-horse-bucket';

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

export async function onAdRender(key, data) {
  try {
    console.log('writing data...', data);

    const res = await fleekStorage.upload({
      apiKey: REACT_APP_FLEEK_API_KEY,
      apiSecret: REACT_APP_FLEEK_API_SECRET,
      key: `${ADS_DIRECTORY}/${key}/results`,
      bucket: BUCKET,
      data: JSON.stringify(data)
    });

    console.log(`uploaded json data to: ${`${ADS_DIRECTORY}/${key}/results`}`);
    console.log(res.hash);
    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getActiveCampaignIds(mobilityInstance) {
  const activeCampaignIds = await mobilityInstance.methods.getActiveCampaignIdsUsers().call();
  return activeCampaignIds;
}

export async function getAd(mobilityInstance, activeCampaignIds) {
  // const id = sample(activeCampaignIds);
  const id = activeCampaignIds[0];
  const data = await mobilityInstance.methods.getActiveCampaignUsers(id).call();
  const fileData = await fleekStorage.getFileFromHash({ hash: data.ipfsHash });
  return {
    organization: data.organization,
    title: data.title,
    ad: fileData,
    data
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
