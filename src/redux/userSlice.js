import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';
import {fetchData} from "./fetchData";




/* async actions */

export const logIn = createAsyncThunk(
  'user/logIn',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      let data = {};
      data["username"] = username;
      data["password"] = password;
      let response = await fetchData(
          `/api/exercises/logIn`, 'POST', data
      );

    return response;
    } catch (err) {
      console.error(err)
      return rejectWithValue(err.message);
    }
  }
);
export const logInByGithub = createAsyncThunk(
  'user/logInGithub',
  async ( {code},  { rejectWithValue }) => {
    try {
      let data = {};
      data["code"] = code;
      let response = await fetchData(
          `/api/exercises/logIn/github/auth`, 'POST', data
      );
      return response;
    } catch (err) {
      console.error(err.message)
      return rejectWithValue(err.message);
    }
  }
);


/* slice */
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    isAdmin: false,
    user: null,
    
    status: 'idle',
    error: null,

    usernameValue: '',
    passwordValue: ''
  },
  reducers: {
    updateUsername: (state, action) => {
      state.usernameValue = action.payload;
    },
    updatePassword: (state, action) => {
      state.passwordValue = action.payload;
    },
    logOut: (state) => {
      localStorage.removeItem("token");
      state.isLoggedIn = false;
      state.user = null;
      state.status = 'idle';
      state.error = '';
    },
  },
  extraReducers: {
    [logIn.pending]: (state, action) => {
      state.status = 'loading';
    },
    [logIn.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.usernameValue = '';
      state.passwordValue = '';
      if (action.payload) {
        let data = JSON.parse(Buffer.from(action.payload.token.split(".")[1], "base64").toString());
        state.user = {"username": data.username};
        state.isLoggedIn = true;
        state.isAdmin = data.isAdmin;
        localStorage["token"] = action.payload.token
      } else {
        state.error = '';
      }
    },
    [logIn.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = 'No such combination of username and password found.';
    } ,
    [logInByGithub.pending]: (state, action) => {
      state.status = 'loading';
    },
    [logInByGithub.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.usernameValue = '';
      state.passwordValue = '';
      if (action.payload) {
        let data = JSON.parse(Buffer.from(action.payload.token.split(".")[1], "base64").toString());
        state.user = {"username": data.username};
        state.isLoggedIn = true;
        state.isAdmin = data.isAdmin;
        localStorage["token"] = action.payload.token
      } else {
        state.error = '';
      }
    },
    [logInByGithub.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = 'No such combination of username and password found.';
    } ,
  }
});


/* export actions */
export const {
  updateUsername,
  updatePassword,
  logOut
} = userSlice.actions;


export default userSlice.reducer;
