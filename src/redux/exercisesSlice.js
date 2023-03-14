import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';
import { fetchData } from './fetchData';
import {addExerciseSlice} from "./addExerciseSlice";


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
        try {
            let response = await fetchData(`/api/exercises/bad_formalizations/${exercise_id}/${proposition_id}`, 'GET');
            return response;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const fetchFeedbacksToBadFormalization = createAsyncThunk(
    'exercises/fetchFeedbacksToBadFormalization',
    async ({bad_formalization_id}, { rejectWithValue }) => {
        console.log("fetchFeedbacksToBadFormalization")
        try {
            let response = await fetchData(
                `/api/exercises/bad_formalizations/feedback/${bad_formalization_id}`,'GET');
            console.log(response)
            return response;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const addFeedback = createAsyncThunk(
    'exercises/addFeedback',
    async ({exercise_id, proposition_id, bad_formalization_id, i}, { getState, rejectWithValue }) => {
        // todo pomazat
        try {
            console.log("\nadd feedback slice")
            const feedback = selectFeedbackText(getState(), i);
            let response = await fetchData(
                `/api/exercises/bad_formalizations/${exercise_id}/${proposition_id}}`, 'POST',
                { bad_formalization_id, feedback }
                );
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
    feedbacks: [],
    formalizations: [],
    badPropositions: [],
    exerciseTitle: '',
    propositionTitle: '',
    newFeedbacks: [{
        feedback: ''
    }],
    status: 'idle',
    error: null
  },
  reducers: {
      updateFeedbackText: {
          reducer: (state, action) => {
              const { value, i } = action.payload;
              state.newFeedbacks[i].feedback = value;
          },
          prepare: (value, i) => {
              return { payload: { value, i } };
          }
      },
      addToList: {
          reducer: (state, action) => {
              const len = action.payload;
              while (state.newFeedbacks.length < len) {
                  state.newFeedbacks.push({
                      feedback: ''
                  });
              }
          },
          prepare: (len) => {
              return { payload: len };
          }
      },
      clearFeedbackText: {
          reducer: (state, action) => {
              const i = action.payload;
              state.newFeedbacks[i].feedback = '';
          },
          prepare: (i) => {
              return { payload: i };
          }
      },
      changeExerciseStatus: {
      reducer: (state, action) => {
        state.status = 'idle';
        state.newFeedbacks = [{
          feedback: ''
        }]
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
      state.formalization = action.payload.formalization;
      if (!state.badFormalizations.isEmpty) {
          state.propositionTitle = state.badFormalizations[0].proposition;
          state.formalizations = state.badFormalizations[0].formalizations;
      }
    },
    [fetchBadFormalizationsToProposition.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [fetchFeedbacksToBadFormalization.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchFeedbacksToBadFormalization.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.feedbacks = action.payload;
    },
    [fetchFeedbacksToBadFormalization.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    }
  }
});

/* export actions */
export const {
  changeExerciseStatus,
  updateFeedbackText,
  addToList,
  clearFeedbackText
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

export const selectPropositionFormalization = (state) => {
    return state.exercises.formalizations;
};

export const selectBadPropositions = (state) => {
  return state.exercises.badPropositions;
};

export const selectBadFormalizations = (state) => {
  return state.exercises.badFormalizations;
};

export const selectFeedbacks = (state) => {
  return state.exercises.feedbacks;
};

export const selectFeedbackText = (state, i) => {
  return {
        value: state.exercises.newFeedbacks[i].feedback
  };
};

export const selectStatus = (state) => {
  return state.exercises.status;
};

export const selectError = (state) => {
  return state.exercises.error;
};

export default exercisesSlice.reducer;
