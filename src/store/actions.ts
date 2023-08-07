import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionTypes } from "./action.type";
import axios from 'axios';


export const getList = createAsyncThunk(
    ActionTypes.GetList,
    async () => {
      const resp = await axios.get('./data.json');
      return resp.data;
    }
  );