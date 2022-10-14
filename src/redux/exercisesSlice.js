import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';
import { fetchData } from './fetchData';


/* async actions */

export const fetchAllExercises = createAsyncThunk(
  'exercises/fetchAllExercises',
  async (_, { rejectWithValue }) => {
    try {
      let response = await fetchData('/api/exercises', 'GET');
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


/* slice */
export const exercisesSlice = createSlice({
  name: 'exercises',
  initialState: {
    exercises: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: {
    [fetchAllExercises.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchAllExercises.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.exercises = action.payload;
    },
    [fetchAllExercises.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    }
  }
});


/* selectors */

export const selectExercises = (state) => {
  return state.exercises.exercises;
};

export const selectPropositions = (state) => {
  return state.exercises;
};

export const selectStatus = (state) => {
  return state.exercises.status;
};

export const selectError = (state) => {
  return state.exercises.error;
};


export default exercisesSlice.reducer;
