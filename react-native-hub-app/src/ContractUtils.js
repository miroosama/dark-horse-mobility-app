import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

export default function ContractUtils() {
  useEffect(() => {
    const getWeb3 = async () => {
      const web3 = await new Web3(
          new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/5e044d2bade54929a78905f13194ddb1')
      );
      web3.eth.getBlock('latest').then(console.log);
    }
    getWeb3();
  }, [])
}
