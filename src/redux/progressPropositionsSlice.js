import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';
import { fetchData } from './fetchData';


/* async actions */

export const fetchAllUsersToExercise = createAsyncThunk(
    'exercises/fetchAllUsersToExercise',
    async (exercise_id, { rejectWithValue }) => {
      try {
        let response = await fetchData(`/api/exercises/progress/${exercise_id}`, 'GET');
        return response;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
);
export const fetchUsersSolutions = createAsyncThunk(
    'exercises/fetchUsersSolutions',
    async ({exercise_id, user_name}, { rejectWithValue }) => {
      try {
        let response = await fetchData(`/api/exercises/progress/user/${user_name}/${exercise_id}`, 'GET');
        return response;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
);


/* slice */
export const progressPropositionsSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    status: 'idle',
    error: null,
    solutions: [],
    exercise_id: null,
    user: '',
  },
  reducers: {},
  extraReducers: {
    [fetchAllUsersToExercise.pending]: (state, action) => {
      state.status = 'loading';
      state.exercise_id = action.meta.arg
    },
    [fetchAllUsersToExercise.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.users = action.payload;
    },
    [fetchAllUsersToExercise.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [fetchUsersSolutions.pending]: (state, action) => {
      state.status = 'loading';
      state.user = action.meta.arg.user_name;
    },
    [fetchUsersSolutions.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.solutions = action.payload;
    },
    [fetchUsersSolutions.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    }
  }
});


/* selectors */

export const selectUsers = (state) => {
  return state.propositions.users;
};

export const selectProposition = (state) => {
  if(state.propositions.users[0] !== undefined){
    return state.propositions.users[0].proposition_id;
  }
  return null;
};

export const selectExerciseId = (state) => {
  return state.propositions.exercise_id;
};

export const selectExerciseTitle = (state) => {
  for(let i = 0; i < state.exercises.exercises.length; i++){
    if(state.exercises.exercises[i].exercise_id === state.propositions.exercise_id){
      return state.exercises.exercises[i].title
    }
  }
  return null;
};


export const selectUsersSolution = (state) => {
  return state.propositions.solutions;
};
export const selectUserName = (state) => {
  return state.propositions.user;
};

export const selectStatus = (state) => {
  return state.propositions.status;
};

export const selectError = (state) => {
  return state.propositions.status;
};


export default progressPropositionsSlice.reducer;
