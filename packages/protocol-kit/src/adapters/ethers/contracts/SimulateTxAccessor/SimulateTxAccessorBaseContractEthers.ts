import { AbstractSigner, Contract, ContractRunner, InterfaceAbi } from 'ethers'

import SafeProvider from '@safe-global/protocol-kit/adapters/ethers/SafeProvider'
import SimulateTxAccessorBaseContract from '@safe-global/protocol-kit/adapters/SimulateTxAccessorBaseContract'
import { SafeVersion } from '@safe-global/safe-core-sdk-types'

/**
 * Abstract class SimulateTxAccessorBaseContractEthers extends SimulateTxAccessorBaseContract to specifically integrate with the Ethers.js v6 library.
 * It is designed to be instantiated for different versions of the Safe contract.
 *
 * This abstract class sets up the Ethers v6 Contract object that interacts with a SimulateTxAccessor contract version.
 *
 * Subclasses of SimulateTxAccessorBaseContractEthers are expected to represent specific versions of the contract.
 *
 * @template SimulateTxAccessorContractAbiType - The ABI type specific to the version of the SimulateTxAccessor contract, extending InterfaceAbi from Ethers.
 * @extends SimulateTxAccessorBaseContract<SimulateTxAccessorContractAbiType> - Extends the generic SimulateTxAccessorBaseContract with Ethers-specific implementation.
 *
 * Example subclasses:
 * - SimulateTxAccessorContract_v1_4_1_Ethers extends SimulateTxAccessorBaseContractEthers<SimulateTxAccessorContract_v1_4_1_Abi>
 * - SimulateTxAccessorContract_v1_3_0_Ethers extends SimulateTxAccessorBaseContractEthers<SimulateTxAccessorContract_v1_3_0_Abi>
 */
abstract class SimulateTxAccessorBaseContractEthers<
  SimulateTxAccessorContractAbiType extends InterfaceAbi
> extends SimulateTxAccessorBaseContract<SimulateTxAccessorContractAbiType> {
  contract: Contract

  /**
   * @constructor
   * Constructs an instance of SimulateTxAccessorBaseContractEthers.
   *
   * @param chainId - The chain ID of the contract.
   * @param safeProvider - An instance of SafeProvider.
   * @param defaultAbi - The default ABI for the SimulateTxAccessor contract. It should be compatible with the specific version of the contract.
   * @param safeVersion - The version of the Safe contract.
   * @param customContractAddress - Optional custom address for the contract. If not provided, the address is derived from the Safe deployments based on the chainId and safeVersion.
   * @param customContractAbi - Optional custom ABI for the contract. If not provided, the ABI is derived from the Safe deployments or the defaultAbi is used.
   */
  constructor(
    chainId: bigint,
    signer: AbstractSigner,
    defaultAbi: SimulateTxAccessorContractAbiType,
    safeVersion: SafeVersion,
    customContractAddress?: string,
    customContractAbi?: SimulateTxAccessorContractAbiType,
    runner?: ContractRunner | null
  ) {
    super(chainId, defaultAbi, safeVersion, customContractAddress, customContractAbi)

    this.contract = new Contract(this.contractAddress, this.contractAbi, runner || signer)
  }
}

export default SimulateTxAccessorBaseContractEthers
