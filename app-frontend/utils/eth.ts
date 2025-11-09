
// utils/eth.ts
export function getProvider(): any | null {
    if (typeof window === 'undefined') return null;
    return (window as any).ethereum ?? null;
}

export async function connectWallet() {
    const ethereum = getProvider();
    if (!ethereum) throw new Error('MetaMask não encontrada');
    const [account] = await ethereum.request({ method: 'eth_requestAccounts' });
    const chainIdHex = await ethereum.request({ method: 'eth_chainId' }); // ex: '0x1'
    return { account, chainIdHex };
}

export async function getChainId() {
    const ethereum = getProvider();
    if (!ethereum) throw new Error('MetaMask não encontrada');
    const chainIdHex = await ethereum.request({ method: 'eth_chainId' });
    return parseInt(chainIdHex, 16);
}

export async function switchOrAddChain(chain: EvmChain) {
    const ethereum = getProvider();
    if (!ethereum) throw new Error('MetaMask não encontrada');

    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chain.hex }],
        });
    } catch (err: any) {
        // se a rede não estiver adicionada
        if (err.code === 4902) {
            await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: chain.hex,
                    chainName: chain.chainName,
                    rpcUrls: chain.rpcUrls,
                    nativeCurrency: chain.nativeCurrency,
                    blockExplorerUrls: chain.blockExplorerUrls,
                }],
            });
        } else {
            throw err;
        }
    }
}

export type EvmChain = {
    chainId: number;
    hex: string;
    chainName: string;
    rpcUrls: string[];
    nativeCurrency: { name: string; symbol: string; decimals: number };
    blockExplorerUrls?: string[];
};
