export interface IENVS {
  NETWORK: string,
  BEACONCHA_URL: string,
  LAUNCHPAD_URL: string,
  ETHERSCAN_URL: string,
  INSUFFICIENT_BALANCE_URL: string,
}

export type NetworkDataType = {
  api: string;
  logo: string;
  networkId: number;
  faucetApi: string;
  apiVersion: string;
  apiNetwork: string;
  optionLabel: string;
  activeLabel: string;
  contractToken: string;
  getterContractAddress: string;
  setterContractAddress: string;
};

type NetworkDataFromEnvironmentType = Pick<NetworkDataType, 'networkId'
  | 'api'
  | 'apiVersion'
  | 'apiNetwork'
  | 'contractToken'
  | 'setterContractAddress'
  | 'getterContractAddress'>;


export const MAINNET_NETWORK_ID = 1;
export const GOERLI_NETWORK_ID = 5;
export const HOLESKY_NETWORK_ID = 17000;

export const NETWORKS = {
  MAINNET: MAINNET_NETWORK_ID,
  GOERLI: GOERLI_NETWORK_ID,
  HOLESKY: HOLESKY_NETWORK_ID,
};

/**
 * Check if network is in list of other networks
 * @param network number or hex representation string
 * @param networks array of numbers or hex representation strings
 */
export const inNetworks = (network: string | number, networks: string[] | number[]): boolean => {
  return getNetworkIndex(network, networks) !== -1;
};

/**
 * Return network index in list of networks
 * @param network number or hex representation string
 * @param networks array of numbers or hex representation strings
 */
export const getNetworkIndex = (network: string | number, networks: string[] | number[]): number => {
  return getHexNetworks(networks).indexOf(toHexString(network));
};

/**
 * Return hex representation strings for given list of networks
 * @param networks numbers or hex representation strings array
 */
export const getHexNetworks = (networks: string[] | number[]): string[] => {
  return networks.map((n: string | number) => {
    return toHexString(n).toLowerCase();
  });
};

export const API_VERSIONS = {
  V3: 'v3',  // TODO: cleanup from v3
  V4: 'v4',
};

const NETWORK_VARIABLES = {
  [`${NETWORKS.MAINNET}_${API_VERSIONS.V4}`]: {
    logo: 'dark',
    activeLabel: 'Ethereum',
    optionLabel: 'Ethereum Mainnet',
  },
  [`${NETWORKS.GOERLI}_${API_VERSIONS.V4}`]: {
    logo: 'light',
    activeLabel: 'Goerli',
    optionLabel: 'Goerli Testnet',
  },
  [`${NETWORKS.HOLESKY}_${API_VERSIONS.V4}`]: {
    logo: 'light',
    activeLabel: 'Holesky',
    optionLabel: 'Holesky Testnet',
  },
};

const data = process.env.REACT_APP_SSV_NETWORKS;

const fillNetworkData = (network: NetworkDataFromEnvironmentType, networkId: number, apiVersion: string): NetworkDataType => ({
  ...network, ...NETWORK_VARIABLES[`${networkId}_${apiVersion}`],
  api: `${network.api}/${network.apiVersion}/${network.apiNetwork}`,
  faucetApi: `${network.api}/faucet`,
});

export const NETWORKS_DATA = data ? JSON.parse(data).map((network: NetworkDataFromEnvironmentType) => fillNetworkData(network, network.networkId, network.apiVersion)) : null;

const _envs = {
  [NETWORKS.GOERLI]: {
    NETWORK: 'prater',
    BEACONCHA_URL: 'https://prater.beaconcha.in',
    LAUNCHPAD_URL: 'https://prater.launchpad.ethereum.org/en/',
    ETHERSCAN_URL: 'https://goerli.etherscan.io',
    INSUFFICIENT_BALANCE_URL: 'https://faucet.ssv.network',
  },
  [NETWORKS.HOLESKY]: {
    NETWORK: 'holesky',
    BEACONCHA_URL: 'https://holesky.beaconcha.in',
    LAUNCHPAD_URL: 'https://holesky.launchpad.ethereum.org/en/',
    ETHERSCAN_URL: 'https://holesky.etherscan.io',
    INSUFFICIENT_BALANCE_URL: 'https://faucet.ssv.network',
  },
  [NETWORKS.MAINNET]: {
    NETWORK: 'mainnet',
    BEACONCHA_URL: 'https://beaconcha.in',
    LAUNCHPAD_URL: 'https://launchpad.ethereum.org/en/',
    ETHERSCAN_URL: 'https://etherscan.io',
    INSUFFICIENT_BALANCE_URL: 'https://coinmarketcap.com/currencies/ssv-network/#Markets',
  },
};

export const ENV = (): IENVS => {
  const finalNetworkId = getCurrentNetwork().networkId;
  return _envs[parseInt(String(finalNetworkId), 10)];
};

export const transactionLink = (txHash: string) => `${ENV().ETHERSCAN_URL}/tx/${txHash}`;

export const toHexString = (val: any) => typeof val === 'number' ? `0x${val.toString(16)}` : val;

export const changeCurrentNetwork = (networkId: number, version?: string) => {
  // Find already persisted network index in supported networks list
  const value = window.localStorage.getItem('current_network');
  const networkIdHex = toHexString(networkId).toLowerCase();
  const networkIndex = NETWORKS_DATA.findIndex((network: NetworkDataType) => {
    const chainIdHex = toHexString(network.networkId).toLowerCase();
    if (version) {
      return networkIdHex === chainIdHex && network.apiVersion === version;
    } else {
      return networkIdHex === chainIdHex;
    }
  });
  if (networkIndex === -1) {
    throw new Error(`Network with ID:${networkId} is not found in supported networks`);
  }
  if (Number(value) === networkIndex) return;
  window.localStorage.setItem('current_network', String(networkIndex));
  window.location.reload();
};

export const getCurrentNetwork = () => {
  if (!NETWORKS_DATA && !process.env.REACT_APP_DISABLE_NETWORK_DATA_CHECK) throw new Error('Provide network data');
  const value = window.localStorage.getItem('current_network');
  if (value && NETWORKS_DATA.length > 1) {
    const networkId = NETWORKS_DATA[value].networkId;
    return { ...NETWORKS_DATA[value], ...NETWORK_VARIABLES[networkId] };
  }
  window.localStorage.setItem('current_network', '0');
  const networkId = NETWORKS_DATA[0].networkId;
  return { ...NETWORKS_DATA[0], ...NETWORK_VARIABLES[networkId] };
};

export const networkTitle = getCurrentNetwork().networkId === NETWORKS.MAINNET ? 'Mainnet' : 'Testnet';
