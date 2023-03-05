import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';
import { fetchData } from './fetchData';
import proposition from "../components/addExercise/Proposition";


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

export const fetchBadExercises = createAsyncThunk(
    'exercises/fetchAllBadExercises',
    async (_, { rejectWithValue }) => {
      try {
        let response = await fetchData('/api/exercises/bad_formalizations', 'GET');
        return response;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
);

export const fetchBadPropositionsToExercise = createAsyncThunk(
    'exercises/fetchBadPropositionsToExercise',
    async (exercise_id, { rejectWithValue }) => {
      try {
        let response = await fetchData(`/api/exercises/bad_formalizations/${exercise_id}`, 'GET');
        return response;
      } catch (err) {
        return rejectWithValue(err.message);
      }

    }
);

export const fetchBadFormalizationsToProposition = createAsyncThunk(
    'exercises/fetchBadFormalizationsToProposition',
    async ({exercise_id, proposition_id}, { rejectWithValue }) => {
        console.log("fetchBadFormalizationsToProposition")
      try {
        let response = await fetchData(`/api/exercises/bad_formalizations/${exercise_id}/${proposition_id}`, 'GET');
          console.log(response)
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
    badFormalizations: [],
    badPropositions: [],
    exerciseTitle: '',
    propositionTitle: '',
    status: 'idle',
    error: null
  },
  reducers: {changeExerciseStatus: {
      reducer: (state, action) => {
        state.status = 'idle';
      }
    },},
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
    },
    [fetchBadExercises.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchBadExercises.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.exercises = action.payload;
    },
    [fetchBadExercises.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [fetchBadPropositionsToExercise.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchBadPropositionsToExercise.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.badPropositions = action.payload;
      if (!state.badPropositions.isEmpty)
          state.exerciseTitle = state.badPropositions[0].title;
    },
    [fetchBadPropositionsToExercise.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [fetchBadFormalizationsToProposition.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchBadFormalizationsToProposition.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.badFormalizations = action.payload;
      if (!state.badFormalizations.isEmpty)
          state.propositionTitle = state.badFormalizations[0].proposition;
    },
    [fetchBadFormalizationsToProposition.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    }
  }
});

/* export actions */
export const {
  changeExerciseStatus
} = exercisesSlice.actions;

/* selectors */

export const selectExercises = (state) => {
  return state.exercises.exercises;
};

export const selectExerciseTitle = (state) => {
    return state.exercises.exerciseTitle;
};

export const selectPropositionTitle = (state) => {
    return state.exercises.propositionTitle;
};

export const selectBadPropositions = (state) => {
  return state.exercises.badPropositions;
};

export const selectBadFormalizations = (state) => {
  return state.exercises.badFormalizations;
};

export const selectStatus = (state) => {
  return state.exercises.status;
};

export const selectError = (state) => {
  return state.exercises.error;
};

export default exercisesSlice.reducer;
