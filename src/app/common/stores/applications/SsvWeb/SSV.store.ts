import Decimal from 'decimal.js';
import { Contract } from 'web3-eth-contract';
import { action, computed, observable } from 'mobx';
import config from '~app/common/config';
// import { roundNumber } from '~lib/utils/numbers';
import BaseStore from '~app/common/stores/BaseStore';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';

class SsvStore extends BaseStore {
    @observable accountInterval: any = null;
    // Balances
    @observable walletSsvBalance: number = 0;
    @observable contractDepositSsvBalance: number = 0;

    // Calculation props
    @observable networkFee: number = 0;
    @observable accountBurnRate: number = 0;
    @observable liquidationCollateral: number = 0;

    // User state
    @observable userState: string = 'operator';

    // Allowance
    @observable userGaveAllowance: boolean = false;
    
    // Liquidate status
    @observable userLiquidated: boolean = false;

    // Contracts
    @observable ssvContractInstance: Contract | null = null;

    /**
     * Returns instance of SSV contract
     */
    @computed
    get ssvContract(): Contract {
        if (!this.ssvContractInstance) {
            const walletStore: WalletStore = this.getStore('Wallet');
            this.ssvContractInstance = new walletStore.web3.eth.Contract(
                config.CONTRACTS.SSV_TOKEN.ABI,
                this.getContractAddress('ssv_token'),
            );
        }
        return <Contract> this.ssvContractInstance;
    }

    /**
     * Check user state
     */
    @computed
    get isValidatorState() {
        return this.userState === 'validator';
    }

    /**
     * Get user account address from wallet.
     */
    @computed
    get accountAddress(): String {
        return this.getStore('Wallet').accountAddress;
    }
    /**
     * Returns days remaining before liquidation
     */
    @action.bound
    getRemainingDays({ newBalance, newBurnRate }: { newBalance?: number, newBurnRate?: number }): number {
        try { '';
            const ssvStore: SsvStore = this.getStore('SSV');
            const burnRatePerBlock = newBurnRate ?? this.accountBurnRate;
            const ssvAmount = newBalance ?? ssvStore.contractDepositSsvBalance;
            const burnRatePerDay = Math.max(burnRatePerBlock * config.GLOBAL_VARIABLE.BLOCKS_PER_DAY, 0);
            const liquidationCollateral = this.liquidationCollateral / config.GLOBAL_VARIABLE.BLOCKS_PER_DAY;
            if (ssvAmount === 0) return 0;
            // if (burnRatePerDay === 0) return 0;
            return Math.max(ssvAmount / burnRatePerDay - liquidationCollateral, 0);
        } catch (e) {
            return 0;
        }
    }

    /**
     * Init User Interval
     */
    @action.bound
    async userSyncInterval() {
        await this.checkAllowance();
        await this.getNetworkFees();
        await this.checkIfLiquidated();
        await this.getAccountBurnRate();
        await this.getBalanceFromSsvContract();
        await this.getBalanceFromDepositContract();
    }

    /**
     * Init User
     */
    @action.bound
    async initUser() {
        clearInterval(this.accountInterval);
        this.userSyncInterval();
        this.accountInterval = setInterval(this.userSyncInterval, 10000);
    }

    @action.bound
    newGetFeeForYear = (fee: number, decimalPlaces?: number): string => {
        const wrapFee = new Decimal(fee);
        return wrapFee.mul(config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR).toFixed(decimalPlaces ?? 2).toString();
    };

    /**
     * Get operators per validator
     */
    @action.bound
    getValidatorOperators = (publicKey: string): Promise<any> => {
        return new Promise<boolean>((resolve) => {
            const walletStore: WalletStore = this.getStore('Wallet');
            // const operatorStore: OperatorStore = this.getStore('Operator');
            walletStore.getContract.methods.getOperatorsByValidator(publicKey).call().then((operators: any) => {
                resolve(operators);
            });
        });
    };

    /**
     * Gets the contract address regarding the testnet/mainnet flag in url search params.
     * By default mainnet is used.
     * If testnet used - show warning in the top of the page.
     * @param contract
     */
    @action.bound
    getContractAddress(contract: string): string {
        const contractType = String(contract).toUpperCase();
        // @ts-ignore
        return config.CONTRACTS[contractType].ADDRESS;
    }

    /**
     * Deposit ssv
     * @param amount
     */
    @action.bound
    async deposit(amount: string) {
        return new Promise<boolean>((resolve) => {
            const walletStore: WalletStore = this.getStore('Wallet');
            const ssvAmount = walletStore.toWei(amount);
            walletStore.getContract.methods
                .deposit(ssvAmount).send({ from: this.accountAddress })
                .on('receipt', async () => {
                    resolve(true);
                })
                .on('transactionHash', (txHash: string) => {
                    walletStore.notifySdk.hash(txHash);
                })
                .on('error', () => {
                    resolve(false);
                });
        });
    }

    /**
     * Check Account status
     */
    @action.bound
    async checkIfLiquidated(): Promise<void> {
        try {
            const walletStore: WalletStore = this.getStore('Wallet');
            this.userLiquidated = await walletStore.getContract.methods.isOwnerValidatorsDisabled(this.accountAddress).call();
        } catch (e) {
            // TODO: handle error
            console.log(e.message);
        }
    }

    /**
     * Init settings
     */
    @action.bound
    clearSettings() {
        this.networkFee = 0;
        this.accountBurnRate = 0;
        this.walletSsvBalance = 0;
        this.userLiquidated = false;
        this.userState = 'operator';
        this.userGaveAllowance = false;
        this.liquidationCollateral = 0;
        this.contractDepositSsvBalance = 0;
    }

    /**
     * Get account balance on ssv contract
     */
    @action.bound
    async getBalanceFromSsvContract(): Promise<any> {
        const balance = await this.ssvContract.methods.balanceOf(this.accountAddress).call();
        const walletStore = this.getStore('Wallet');
        this.walletSsvBalance = parseFloat(String(walletStore.fromWei(balance, 'ether')));
    }

    /**
     * Get account balance on network contract
     */
    @action.bound
    async getBalanceFromDepositContract(): Promise<any> {
        try {
            const walletStore: WalletStore = this.getStore('Wallet');
            const balance = await walletStore.getContract.methods.totalBalanceOf(this.accountAddress).call();
            this.contractDepositSsvBalance = walletStore.fromWei(balance);
        } catch (e) {
            // TODO: handle error
            console.log(e.message);
        }
    }

    /**
     * Withdraw ssv
     * @param type
     * @param amount
     * @param withdrawAll
     */
    @action.bound
    async withdrawSsv(validatorState: boolean, amount: string, withdrawAll: boolean = false) {
        return new Promise<boolean>((resolve) => {
            const walletStore: WalletStore = this.getStore('Wallet');
            const ssvAmount = walletStore.toWei(amount);
            let contractFunction = null;
            if (withdrawAll && !validatorState) contractFunction = walletStore.getContract.methods.withdrawAll();
            if (withdrawAll && validatorState) contractFunction = walletStore.getContract.methods.liquidate([this.accountAddress]);
            if (!withdrawAll) contractFunction = walletStore.getContract.methods.withdraw(ssvAmount);

            contractFunction.send({ from: this.accountAddress })
                .on('receipt', async () => {
                    resolve(true);
                })
                .on('transactionHash', (txHash: string) => {
                    walletStore.notifySdk.hash(txHash);
                })
                .on('error', () => {
                    resolve(false);
                });
        });
    }

    /**
     * Withdraw ssv
     * @param amount
     */
    @action.bound
    async activateValidator(amount: string) {
        return new Promise<boolean>((resolve) => {
            const walletStore: WalletStore = this.getStore('Wallet');
            const applicationStore: ApplicationStore = this.getStore('Application');
            applicationStore.setIsLoading(true);
            const ssvAmount = walletStore.toWei(amount.toString());
            walletStore.getContract.methods.enableAccount(ssvAmount).send({ from: this.accountAddress })
                .on('receipt', async () => {
                    applicationStore.setIsLoading(false);
                    resolve(true);
                })
                .on('transactionHash', (txHash: string) => {
                    walletStore.notifySdk.hash(txHash);
                })
                .on('error', () => {
                    applicationStore.setIsLoading(false);
                    resolve(false);
                });
        });
    }

    /**
     *  Call userAllowance function in order to know if it has been set or not for SSV contract by user account.
     */
    @action.bound
    async checkAllowance(): Promise<void> {
        const allowance = await this.ssvContract
            .methods
            .allowance(
                this.accountAddress,
                this.getContractAddress('ssv_network'),
            ).call();
        this.userGaveAllowance = allowance !== '0';
    }

    /**
     * Set allowance to get CDT from user account.
     */
    @action.bound
    async approveAllowance(estimate: boolean = false, callBack?: () => void): Promise<any> {
        return new Promise((resolve => {
            const ssvValue = String('115792089237316195423570985008687907853269984665640564039457584007913129639935');
            const weiValue = ssvValue; // amount ? this.getStore('Wallet').web3.utils.toWei(ssvValue, 'ether') : ssvValue;
            const walletStore: WalletStore = this.getStore('Wallet');

            if (!estimate) {
                console.debug('Approving:', { ssvValue, weiValue });
            }

            const methodCall = this.ssvContract
                .methods
                .approve(this.getContractAddress('ssv_network'), weiValue);

            if (estimate) {
                return methodCall
                    .estimateGas({ from: this.accountAddress })
                    .then((gasAmount: number) => {
                        const floatString = this.getStore('Wallet').web3.utils.fromWei(String(gasAmount), 'ether');
                        return parseFloat(floatString);
                    });
            }

            return methodCall
                .send({ from: this.accountAddress })
                .on('receipt', async () => {
                    resolve(true);
                    this.userGaveAllowance = true;
                })
                .on('transactionHash', (txHash: string) => {
                    callBack && callBack();
                    walletStore.notifySdk.hash(txHash);
                })
                .on('error', (error: any) => {
                    console.debug('Contract Error', error);
                    resolve(false);
                    this.userGaveAllowance = false;
                });
        }));
    }

    /**
     * Get network fee
     */
    @action.bound
    async getNetworkFees() {
        const walletStore: WalletStore = this.getStore('Wallet');
        const networkContract = walletStore.getContract;
        const liquidationCollateral = await networkContract.methods.minimumBlocksBeforeLiquidation().call();
        const networkFee = await networkContract.methods.networkFee().call();
        // hardcoded should be replaced
        this.networkFee = walletStore.fromWei(networkFee);
        this.liquidationCollateral = Number(liquidationCollateral);
    }

    /**
     * Get account burn rate
     */
    @action.bound
    async getAccountBurnRate(): Promise<void> {
        try {
            const walletStore: WalletStore = this.getStore('Wallet');
            const burnRate = await walletStore.getContract.methods.burnRate(this.accountAddress).call();
            this.accountBurnRate = this.getStore('Wallet').web3.utils.fromWei(burnRate);
        } catch (e) {
            // TODO: handle error
            console.log(e.message);
        }
    }

    /**
     * Get new account burn rate
     */
    @action.bound
    getNewAccountBurnRate(oldOperatorsFee: number, newOperatorsFee: number): number {
      return this.accountBurnRate - oldOperatorsFee + newOperatorsFee;
    }

    // /**
    //  * @url https://docs.metamask.io/guide/registering-your-token.html
    //  */
    // @action.bound
    // registerSSVTokenInMetamask() {
    //     return new Promise((resolve, reject) => {
    //         return this.getStore('Wallet').web3.currentProvider.send({
    //             method: 'wallet_watchAsset',
    //             params: {
    //                 type: 'ERC20',
    //                 options: {
    //                     address: this.getContractAddress('ssv'),
    //                     symbol: 'SSV',
    //                     decimals: 18,
    //                 },
    //             },
    //         }, (error: any, success: any) => {
    //             if (error) {
    //                 reject(error);
    //             } else {
    //                 resolve(success);
    //             }
    //         });
    //     }).then((success: any) => {
    //         if (!success) {
    //             this.getStore('Notifications')
    //                 .showMessage('Can not add SSV to wallet!', 'error');
    //         }
    //     }).catch((error: any) => {
    //         console.error('Can not add SSV token to wallet', error);
    //         this.getStore('Notifications')
    //             .showMessage(`Can not add SSV to wallet: ${error.message}`, 'error');
    //     });
    // }
}

export default SsvStore;
