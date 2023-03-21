import { keccak256 } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { action, makeObservable } from 'mobx';
import config from '~app/common/config';
import Validator from '~lib/api/Validator';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
// import { propertyCostByPeriod } from '~lib/utils/numbers';

const annotations = {
  getClusterData: action.bound,
  getClusterHash: action.bound,
  getClusterRunWay: action.bound,
  getClusterBalance: action.bound,
};

class ClusterStore extends BaseStore {

  constructor() {
    super();
    makeObservable(this, annotations);
  }

  getSortedOperatorsIds(operators: any[]) {
    if (typeof operators[0] === 'number') return operators.map(Number).sort((a: number, b: number) => a - b);
    return operators.map(operator => operator.id).map(Number).sort((a: number, b: number) => a - b);
  }

  getClusterHash(operators: any[]) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const ownerAddress: string = walletStore.accountAddress;
    const operatorsIds = this.getSortedOperatorsIds(operators);
    return keccak256(walletStore.web3.utils.encodePacked(ownerAddress, ...operatorsIds));
  }

  async getClusterBalance(operators: any[], injectedClusterData?: any) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const operatorsIds = this.getSortedOperatorsIds(operators);
    const contract: Contract = walletStore.getterContract;
    const clusterData = injectedClusterData ?? await this.getClusterData(this.getClusterHash(operators));
    if (!clusterData) return;
    try {
      const balance = await contract.methods.getBalance(walletStore.accountAddress, operatorsIds, clusterData).call();
      return balance;
    } catch (e) {
      return 0;
    }
  }

  getClusterNewBurnRate(cluster: any, newAmountOfValidators: number) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const clusterBurnRate = walletStore.fromWei(cluster.burnRate);
    return clusterBurnRate / cluster.validator_count * newAmountOfValidators;
  }

  async isClusterLiquidated(operators: any[], injectedClusterData?: any) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const operatorsIds = this.getSortedOperatorsIds(operators);
    const contract: Contract = walletStore.getterContract;
    const clusterData = injectedClusterData ?? await this.getClusterData(this.getClusterHash(operators));
    if (!clusterData) return;
    try {
      const isLiquidated = await contract.methods.isLiquidated(walletStore.accountAddress, operatorsIds, clusterData).call();
      return isLiquidated;
    } catch (e) {
      return false;
    }
  }

  async getClusterBurnRate(operators: any[], injectedClusterData?: any) {
    const walletStore: WalletStore = this.getStore('Wallet');
    const contract: Contract = walletStore.getterContract;
    const operatorsIds = this.getSortedOperatorsIds(operators);
    const clusterData = injectedClusterData ?? await this.getClusterData(this.getClusterHash(operators));
    try {
      const burnRate = await contract.methods.getBurnRate(walletStore.accountAddress, operatorsIds, clusterData).call();
      return burnRate;
    } catch (e) {
      return 0;
    }
  }

  getClusterRunWay(cluster: any) {
    const ssvStore: SsvStore = this.getStore('SSV');
    const walletStore: WalletStore = this.getStore('Wallet');
    const liquidationCollateral = walletStore.fromWei(cluster.burnRate) * ssvStore.liquidationCollateralPeriod;
    return (walletStore.fromWei(cluster.balance) - liquidationCollateral) / (walletStore.fromWei(cluster.burnRate) * config.GLOBAL_VARIABLE.BLOCKS_PER_DAY);
  }

  async getClusterData(clusterHash: string) {
    try {
      const response = await Validator.getInstance().getClusterData(clusterHash);
      const clusterData = response.cluster;
      if (clusterData === null) {
        return {
          validatorCount: 0,
          networkFeeIndex: 0,
          index: 0,
          balance: 0,
          active: true,
        };
      }
      return {
        validatorCount: clusterData.validatorCount,
        networkFeeIndex: clusterData.networkFeeIndex,
        index: clusterData.index,
        balance: clusterData.balance,
        active: clusterData.active,
      };
    } catch (e) {
      return null;
    }
  }

  async setFeeRecipient(feeRecipient: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const applicationStore: ApplicationStore = this.getStore('Application');
      const walletStore: WalletStore = this.getStore('Wallet');
      const contract: Contract = walletStore.setterContract;
      try {
        await contract.methods.setFeeRecipientAddress(feeRecipient).send({ from: walletStore.accountAddress })
            .on('receipt', async (receipt: any) => {
              console.log(receipt);
              resolve(true);
            })
            .on('transactionHash', (txHash: string) => {
              applicationStore.txHash = txHash;
              applicationStore.showTransactionPendingPopUp(true);
            })
            .on('error', (error: any) => {
              console.debug('Contract Error', error.message);
              applicationStore.setIsLoading(false);
              applicationStore.showTransactionPendingPopUp(false);
              resolve(false);
            });
      } catch (e: any) {
        console.log('<<<<<<<<<<<<<<<<her>>>>>>>>>>>>>>>>');
        console.log(e.message);
        console.log('<<<<<<<<<<<<<<<<her>>>>>>>>>>>>>>>>');
        resolve(false);
      }
    });
  }
}

export default ClusterStore;