import hre, { ethers } from 'hardhat'
import Web3 from 'web3'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { Eip1193Provider } from '@safe-global/protocol-kit/types'
import { SafeProvider } from '@safe-global/protocol-kit/index'
import { custom, createWalletClient } from 'viem'

type Network = 'mainnet' | 'gnosis' | 'zksync' | 'goerli' | 'sepolia'

export async function getEip1193Provider(): Promise<Eip1193Provider> {
  switch (process.env.ETH_LIB) {
    case 'viem':
      const client = createWalletClient({
        transport: custom(hre.network.provider)
      })

      return { request: client.request } as Eip1193Provider

    case 'web3':
      const web3Provider = new Web3(hre.network.provider)

      return web3Provider.currentProvider as Eip1193Provider

    case 'ethers':
      const browserProvider = new ethers.BrowserProvider(hre.network.provider)

      return {
        request: async (request) => {
          return browserProvider.send(request.method, [...((request.params as unknown[]) ?? [])])
        }
      }
    default:
      throw new Error('ETH_LIB not set')
  }
}

export function getSafeProviderFromNetwork(
  network: Network,
  signer?: HardhatEthersSigner
): SafeProvider {
  let rpcUrl: string
  switch (network) {
    case 'zksync':
      rpcUrl = 'https://mainnet.era.zksync.io'
      break
    case 'gnosis':
      rpcUrl = 'https://rpc.gnosischain.com'
      break
    case 'goerli':
      rpcUrl = 'https://rpc.ankr.com/eth_goerli'
      break
    case 'sepolia':
      rpcUrl = 'https://rpc.ankr.com/eth_sepolia'
      break
    case 'mainnet':
      rpcUrl = 'https://rpc.ankr.com/eth'
      break
    default:
      throw new Error('Chain not supported')
  }

  return new SafeProvider({ providerOrUrl: rpcUrl, signerAddress: signer?.address })
}
