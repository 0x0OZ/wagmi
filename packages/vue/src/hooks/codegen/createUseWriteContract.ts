import type { MutateOptions } from '@tanstack/vue-query'
import type {
  Config,
  ResolvedRegister,
  WriteContractErrorType,
} from '@0xoz/core'
import type {
  ChainIdParameter,
  Compute,
  ConnectorParameter,
  SelectChains,
  UnionCompute,
  UnionStrictOmit,
} from '@0xoz/core/internal'
import type {
  WriteContractData,
  WriteContractVariables,
} from '@0xoz/core/query'
import type {
  Abi,
  Account,
  Address,
  Chain,
  ContractFunctionArgs,
  ContractFunctionName,
} from 'viem'
import type { WriteContractParameters as viem_WriteContractParameters } from 'viem/actions'

import { useAccount } from '../useAccount.js'
import { useChainId } from '../useChainId.js'
import { useConfig } from '../useConfig.js'
import {
  type UseWriteContractParameters,
  useWriteContract,
  type UseWriteContractReturnType as wagmi_UseWriteContractReturnType,
} from '../useWriteContract.js'

type stateMutability = 'nonpayable' | 'payable'

export type CreateUseWriteContractParameters<
  abi extends Abi | readonly unknown[],
  address extends Address | Record<number, Address> | undefined = undefined,
  functionName extends
    | ContractFunctionName<abi, stateMutability>
    | undefined = undefined,
> = {
  abi: abi | Abi | readonly unknown[]
  address?: address | Address | Record<number, Address> | undefined
  functionName?:
    | functionName
    | ContractFunctionName<abi, stateMutability>
    | undefined
}

export type CreateUseWriteContractReturnType<
  abi extends Abi | readonly unknown[],
  address extends Address | Record<number, Address> | undefined,
  functionName extends ContractFunctionName<abi, stateMutability> | undefined,
> = <config extends Config = ResolvedRegister['config'], context = unknown>(
  parameters?: UseWriteContractParameters<config, context>,
) => Compute<
  Omit<
    wagmi_UseWriteContractReturnType<config, context>,
    'writeContract' | 'writeContractAsync'
  > & {
    writeContract: <
      const abi2 extends abi,
      name extends functionName extends ContractFunctionName<
        abi,
        stateMutability
      >
        ? functionName
        : ContractFunctionName<abi, stateMutability>,
      args extends ContractFunctionArgs<abi2, stateMutability, name>,
      chainId extends config['chains'][number]['id'],
    >(
      variables: Variables<
        abi2,
        functionName,
        name,
        args,
        config,
        chainId,
        address
      >,
      options?:
        | MutateOptions<
            WriteContractData,
            WriteContractErrorType,
            WriteContractVariables<
              abi2,
              name,
              args,
              config,
              chainId,
              name
            >,
            context
          >
        | undefined,
    ) => void
    writeContractAsync: <
      const abi2 extends abi,
      name extends functionName extends ContractFunctionName<
        abi,
        stateMutability
      >
        ? functionName
        : ContractFunctionName<abi, stateMutability>,
      args extends ContractFunctionArgs<abi2, stateMutability, name>,
      chainId extends config['chains'][number]['id'],
    >(
      variables: Variables<
        abi2,
        functionName,
        name,
        args,
        config,
        chainId,
        address
      >,
      options?:
        | MutateOptions<
            WriteContractData,
            WriteContractErrorType,
            WriteContractVariables<
              abi2,
              name,
              args,
              config,
              chainId,
              name
            >,
            context
          >
        | undefined,
    ) => Promise<WriteContractData>
  }
>

export function createUseWriteContract<
  const abi extends Abi | readonly unknown[],
  const address extends Address | Record<number, Address> | undefined = undefined,
  functionName extends
    | ContractFunctionName<abi, stateMutability>
    | undefined = undefined,
>(
  props: CreateUseWriteContractParameters<abi, address, functionName>,
): CreateUseWriteContractReturnType<abi, address, functionName> {
  if (props.address !== undefined && typeof props.address === 'object')
    return (parameters) => {
      const config = useConfig(parameters)
      const result = useWriteContract(parameters)
      const configChainId = useChainId({ config })
      const account = useAccount({ config })
      type Args = Parameters<wagmi_UseWriteContractReturnType['writeContract']>
      return {
        ...(result as any),
        writeContract: (...args: Args) => {
          let chainId: number | undefined
          if (args[0].chainId) chainId = args[0].chainId
          else if (
            (args[0] as any).account &&
            (args[0] as any).account === account.address
          )
            chainId = account.chainId
          else if ((args[0] as any).account === undefined)
            chainId = account.chainId
          else chainId = configChainId

          const variables = {
            ...(args[0] as any),
            address: chainId ? props.address?.[chainId] : undefined,
            ...(props.functionName
              ? { functionName: props.functionName }
              : {}),
            abi: props.abi,
          }
          result.writeContract(variables, args[1] as any)
        },
        writeContractAsync: (...args: Args) => {
          let chainId: number | undefined
          if (args[0].chainId) chainId = args[0].chainId
          else if (
            (args[0] as any).account &&
            (args[0] as any).account === account.address
          )
            chainId = account.chainId
          else if ((args[0] as any).account === undefined)
            chainId = account.chainId
          else chainId = configChainId

          const variables = {
            ...(args[0] as any),
            address: chainId ? props.address?.[chainId] : undefined,
            ...(props.functionName
              ? { functionName: props.functionName }
              : {}),
            abi: props.abi,
          }
          return result.writeContractAsync(variables, args[1] as any)
        },
      }

  return (parameters) => useWriteContract(parameters)
}

// Variables type omitted for brevity
