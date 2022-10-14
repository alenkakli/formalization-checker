import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';
import {fetchData} from "./fetchData";

/* async actions */

export const fetchAllUsers = createAsyncThunk(
  'users',
  async (user, { rejectWithValue }) => {
    try {
      let response = await fetchData(
          `/api/exercises/allUsers/${user}`, 'GET'
      );
    return response;
    } catch (err) {
      console.error(err)
      return rejectWithValue(err.message);
    }
  }
);

export const saveAdmins = createAsyncThunk(
  'admins',
  async (admins, { rejectWithValue }) => {
    try {
      let response = await fetchData(
          `/api/exercises/allUsers`, 'POST', admins
      );

     return response;
    } catch (err) {
      console.error(err)
      return rejectWithValue(err.message);
    }
  }
);

/* slice */
export const adminsSlice = createSlice({
  name: 'admins',
  initialState: {
    users: [''],
    
    status: 'idle',
    error: null,

    changed: {}
  },
  reducers: {
    addChanged: (state, action) => {
      state.changed[action.payload] = !state.changed[action.payload] ;
    },
    },
  extraReducers: {
    [fetchAllUsers.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchAllUsers.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.users = action.payload
      for(let i = 0; i < state.users.length; i++){
        state.changed[state.users[i].user_name] = state.users[i].is_admin;
      }
    },
    [fetchAllUsers.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = 'There are no users';
    } ,
    [saveAdmins.pending]: (state, action) => {
      state.status = 'loading';
    },
    [saveAdmins.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.users = [];
      for(let [key, value] of Object.entries(action.payload)){
        state.users.push({"user_name": key, "is_admin": value});
      }
    },
    [saveAdmins.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = 'Unsuccessful saving admins';
    } ,
  }
});

export const selectAllUsers = (state) => {
  return state.allUsers.users;
};

export const selectStatus = (state) => {
  return state.allUsers.status;
};

export const selectError = (state) => {
  return state.allUsers.error;
};

export const selectChangedAdmins = (state) => {
  return state.allUsers.changed;
};

/* export actions */
export const {
  addChanged
} = adminsSlice.actions;

export default adminsSlice.reducer;
