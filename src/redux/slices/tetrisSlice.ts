import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface TetrisState {
    winners: any[];
    connectionState: boolean;
    skillLevel: number;
    confLevel: number;
    myWalletAddress: string;
    balance: number,
    beatScore:number,
}

const initialState: TetrisState = {
    winners: [],
    connectionState: false,
    skillLevel: 1,
    confLevel: 0,
    myWalletAddress:"",
    balance: 0,
    beatScore: 0
}

export const tetrisSlice = createSlice({
    name: 'chat',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setLeaderboard: (state, action: PayloadAction<any>) => {
            state.winners = action.payload.result;
        },
        setConnectionState: (state, action: PayloadAction<any>) => {
            state.connectionState = action.payload.state;
        },
        setSkillLevel: (state, action: PayloadAction<any>) => {
            state.skillLevel = action.payload.skill;
        },
        setConfLevel: (state, action: PayloadAction<any>) => {
            state.confLevel = action.payload.confident;
        },
        setMyWalletAddress: (state, action: PayloadAction<any>) => {
            state.myWalletAddress = action.payload.address;
        },
        setMyBalance: (state, action: PayloadAction<any>) => {
            state.balance = action.payload.balance;
        },
        setBeatScore: (state, action: PayloadAction<any>) => {
            state.beatScore = action.payload.beatScore;
        },
    },
})

export const {
  setLeaderboard,
  setConnectionState,
  setConfLevel,
  setSkillLevel,
  setMyWalletAddress,
  setMyBalance,
  setBeatScore
} = tetrisSlice.actions

export default tetrisSlice.reducer
