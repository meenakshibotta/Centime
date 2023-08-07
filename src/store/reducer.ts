import { createSlice } from "@reduxjs/toolkit";
import {
    getList,
} from "./actions";
import { State, initialState } from "./state";
import { Node } from "../type";

const slice = createSlice({
    name: "inflow_outflow",
    initialState: initialState,
    reducers: {
        addIlowOutFlowData: (state, val) => {
            state.inflowOutFlowData!.nodes = val.payload.node
           // state.inflowOutFlowData!.nodes.push(!source ? {name:val.payload.source,category:'outflow'} :!target : {name:val.payload.source,category:'outflow' )
            state.inflowOutFlowData!.links = [...state.inflowOutFlowData!.links, val.payload.values];
           
        },
        updatedata: (state, input) => {
            state.inflowOutFlowData!.nodes = input.payload.nodes
            state.inflowOutFlowData!.links[input.payload.rowIndex] = input.payload.value
        },
        deleteData:(state,input)=>{
            state.inflowOutFlowData!.links.splice(input.payload.rowIndex,1);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(
            getList.fulfilled,
            (state: State, action: { payload: any }) => {
                return {
                    ...state,
                    inflowOutFlowData: action.payload ?? {},
                };
            }
        );
        builder.addCase(
            getList.rejected,
            (state: State, action: { payload: any }) => {
                return {
                    ...state,
                    error: action.payload,
                };
            }
        );

    },
});

function addNewNode(name:string):Node{
    return {name:name,category:'outflow'}
}
export const { actions, reducer } = slice;
