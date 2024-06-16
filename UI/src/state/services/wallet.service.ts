import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { BrowserProvider, JsonRpcSigner, ethers } from 'ethers';
import { RootState } from '../store';

let config: {
    provider?: BrowserProvider;
    signer?: JsonRpcSigner;
} = {}

export const getSigner = () => config.signer

if ((window as any).ethereum !== null) {
    config.provider = new ethers.BrowserProvider((window as any).ethereum);

    (window as any).ethereum?.on("accountsChanged", () => {
        window.location.reload()
    });
    (window as any).ethereum?.on("chainChanged", () => {
        window.location.reload()
    });
}

export const attachWallet = createAsyncThunk<{ address: string, netowrkId: number } | null, void, { state: RootState }>(
    'wallet/attachWallet',
    async (_, { getState }) => {
        let state = getState();
        if (state.wallet.noMetamask || config.provider == undefined) return null;
        let accounts = await config.provider.listAccounts()
        if (accounts.length == 0) return null;
        config.signer = await config.provider.getSigner();
        let netowrkId = Number((await config.provider.getNetwork()).chainId);
        return { address: accounts[0].address, netowrkId };
    }
)
export const connectWallet = createAsyncThunk<{ address: string, netowrkId: number } | null, void, { state: RootState }>(
    'wallet/connectWallet',
    async (_, { getState }) => {
        let state = getState();
        if (state.wallet.noMetamask || config.provider == undefined) return null;
        config.signer = await config.provider.getSigner();

        let accounts = await config.provider.listAccounts()
        let netowrkId = Number((await config.provider.getNetwork()).chainId);
        return { address: accounts[0].address, netowrkId };
    }
)

interface walletState {
    isConnecting: boolean,
    isConnected: boolean,
    errorConnecting: boolean,

    accountAddress?: string,
    networkId?: number,
    noMetamask: boolean
}

const initialState = {
    isConnecting: false,
    isConnected: false,
    errorConnecting: false,
    noMetamask: (window as any).ethereum == undefined
} as walletState

export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
    },
    extraReducers(builder) {

        builder.addCase(connectWallet.pending, (state, action) => {
            state.isConnected = false
            state.isConnecting = true;
            state.errorConnecting = false;
        }).addCase(connectWallet.fulfilled, (state, action) => {
            let payload = action.payload
            state.isConnecting = false;
            if (!payload) return state;

            state.isConnected = true;
            state.accountAddress = payload.address;
            state.networkId = payload.netowrkId;
        }).addCase(connectWallet.rejected, (state, action) => {
            state.isConnected = false
            state.isConnecting = false;
            state.errorConnecting = true;
        }).addCase(attachWallet.pending, (state, action) => {
            state.isConnected = false
            state.isConnecting = true;
            state.errorConnecting = false;
        }).addCase(attachWallet.fulfilled, (state, action) => {
            let payload = action.payload
            state.isConnecting = false;
            if (!payload) return state;

            state.isConnected = true;
            state.accountAddress = payload.address;
            state.networkId = payload.netowrkId;
        }).addCase(attachWallet.rejected, (state, action) => {
            state.isConnected = false
            state.isConnecting = false;
            state.errorConnecting = true;
        })
    },
})

export const { } = walletSlice.actions
export default walletSlice.reducer