import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';
import { fetchData } from './fetchData';


/* async actions */

export const fetchAllUsersToExercise = createAsyncThunk(
    'exercises/fetchAllUsersToExercise',
    async (exercise_id, { dispatch, rejectWithValue }) => {
      try {
        let response = await dispatch(fetchData(`/api/progress/${exercise_id}`, 'GET'));
        return response;
      } catch (err) {
        console.error(err);
        console.error(err.stack);
        return rejectWithValue(err.message);
      }
    }
);

export const fetchAllExercisesToUser = createAsyncThunk(
  'exercises/fetchAllExercisesToUser',
  async (exercise_id, { dispatch, rejectWithValue }) => {
    try {
      let response = await dispatch(fetchData(`/api/progress`, 'GET'));
      return response;
    } catch (err) {
      console.error(err);
      console.error(err.stack);
      return rejectWithValue(err.message);
    }
  }
);
export const fetchUsersSolutions = createAsyncThunk(
    'exercises/fetchUsersSolutions',
    async ({exercise_id, user_name}, { dispatch, rejectWithValue }) => {
      try {
        let response = await dispatch(fetchData(`/api/progress/${exercise_id}/${user_name}`, 'GET'));
        return response;
      } catch (err) {
        console.error(err);
        console.error(err.stack);
        return rejectWithValue(err.message);
      }
    }
);


/* slice */
export const progressPropositionsSlice = createSlice({
  name: 'users',
  initialState: {
    exercises: [],
    users: [],
    status: 'idle',
    error: null,
    solutions: [],
    exercise_id: null,
    user: '',
    title:''
  },
  reducers: {},
  extraReducers: {
    [fetchAllUsersToExercise.pending]: (state, action) => {
      state.status = 'loading';
      state.exercise_id = action.meta.arg;
    },
    [fetchAllUsersToExercise.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.users = action.payload;
      if (!state.users.isEmpty)
        state.title = state.users[0].title;
    },
    [fetchAllUsersToExercise.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [fetchAllExercisesToUser.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchAllExercisesToUser.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.exercises = action.payload;
    },
    [fetchAllExercisesToUser.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [fetchUsersSolutions.pending]: (state, action) => {
      state.status = 'loading';
      state.user = action.meta.arg.user_name;
      state.exercise_id = action.meta.arg.exercise_id;
    },
    [fetchUsersSolutions.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.solutions = action.payload;
      if (!state.solutions.isEmpty)
        state.title = state.solutions[0].title;
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

export const selectExerciseTitle = (state) => {
  return state.propositions.title;
};

export const selectExercises = (state) => {
  return state.propositions.exercises;
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
