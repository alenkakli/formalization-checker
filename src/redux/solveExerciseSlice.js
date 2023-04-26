import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';
import {
  parseConstants,
  parsePredicates,
  parseFunctions,
  parseFormulaWithPrecedence
} from '@fmfi-uk-1-ain-412/js-fol-parser';
import { fetchData } from './fetchData';
import {
  arrayToArityMap,
  parseFormalization
} from './helpers';


/* async actions */

export const fetchExercise = createAsyncThunk(
  'solveExercise/fetchExercise',
  async ({exercise_id, user_name}, { dispatch, rejectWithValue }) => {
    try {
      let response = await dispatch(fetchData(
        `/api/exercises/${exercise_id}`, 'POST', { username: user_name }
      ));
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const evaluate = createAsyncThunk(
  'solveExercise/evaluate',
  async ({ exercise_id, proposition_id, solution, user }, { dispatch, rejectWithValue }) => {
    try {
      let response = await dispatch(fetchData(
        `/api/exercises/${exercise_id}/${proposition_id}`, 'POST',
        { solution, user }
      ));
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchActiveFeedbacks = createAsyncThunk(
  'solveExercise/fetchFeedback',
  async ({ proposition_id, bad_formalization_id}, { dispatch, rejectWithValue }) => {
    try {
      let response = await dispatch(fetchData(
        `/api/feedbacks/active/bad_formalization/${bad_formalization_id}`, 'GET'));
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const feedbackRating = createAsyncThunk(
  'solveExercise/feedbackRating',
  async ({ proposition_id, index, feedback_id, solution_id }, { dispatch, rejectWithValue }) => {
    try {
      let response = await dispatch(fetchData(
        `/api/feedbacks/rating`, 'POST', {feedback_id, solution_id}));
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateRating = createAsyncThunk(
  'solveExercise/rating',
  async ({ id, rating }, { dispatch, rejectWithValue }) => {
    try {
      let response = await dispatch(fetchData(
        `/api/feedbacks/rating/${id}`, 'PATCH', {rating}));
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


/* slice */
export const solveExerciseSlice = createSlice({
  name: 'solveExercise',
  initialState: {
    exercise: null,
    status: 'idle',
    error: null,

    constants: [],
    predicates: [],
    functions: [],

    solutions: {},
    solution: null
  },
  reducers: {
    update: {
      reducer: (state, action) => {
        const { value, id } = action.payload;
        state.solutions[id].solution = value.replace(/(\r\n|\n|\r)/gm, "");
      },
      prepare: (value, id) => {
        return { payload: { value, id } };
      }
    }
  },
  extraReducers: {
    [fetchExercise.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchExercise.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.exercise = action.payload;
      state.constants = parseConstants(state.exercise.constants);
      state.predicates = parsePredicates(state.exercise.predicates);
      state.functions = parseFunctions(state.exercise.functions);
      for (let p of state.exercise.propositions) {
        state.solutions[p.proposition_id] = {
          evaluation: null,
          status: 'idle',
          error: null,
          feedbacks: []
        };
        if(p.solution === null || p.solution === undefined){
          state.solutions[p.proposition_id]["solution"] = '';
        }
        else{
          state.solutions[p.proposition_id]["solution"] = p.solution
        }
      }
    },
    [fetchExercise.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },

    [evaluate.pending]: (state, action) => {
      let { proposition_id } = action.meta.arg;
      let solution = state.solutions[proposition_id];
      solution.status = 'loading';
    },
    [evaluate.fulfilled]: (state, action) => {
      let { proposition_id } = action.meta.arg;
      let evaluation = action.payload;
      let solution = state.solutions[proposition_id];
      solution.status = 'succeeded';
      solution.evaluation = evaluation;
    },
    [evaluate.rejected]: (state, action) => {
      let { proposition_id } = action.meta.arg;
      let { error } = action.payload;
      let solution = state.solutions[proposition_id];
      solution.status = 'failed';
      solution.error = error;
    },

    [fetchActiveFeedbacks.pending]: (state, action) => {
    },
    [fetchActiveFeedbacks.fulfilled]: (state, action) => {
      let { proposition_id } = action.meta.arg;
      let solution = state.solutions[proposition_id];
      solution.feedbacks = action.payload;
    },
    [fetchActiveFeedbacks.rejected]: (state, action) => {
    },

    [feedbackRating.pending]: (state, action) => {
    },
    [feedbackRating.fulfilled]: (state, action) => {
      let { proposition_id, index } = action.meta.arg;
      let feedback = state.solutions[proposition_id].feedbacks[index];
      feedback.rating_id = action.payload;
    },
    [feedbackRating.rejected]: (state, action) => {
    }
  }
});


/* export actions */
export const {
  update
} = solveExerciseSlice.actions;


/* selectors */

export const selectExercise = (state) => {
  return state.solveExercise.exercise;
};

export const selectSolution = (state, id) => {
  const value = state.solveExercise.solutions[id].solution;
  let error = parseFormalization(
    value, new Set(state.solveExercise.constants),
    arrayToArityMap(state.solveExercise.predicates),
    arrayToArityMap(state.solveExercise.functions),
    parseFormulaWithPrecedence
  );
  return { value, error };
};

export const selectStatus = (state) => {
  return state.solveExercise.status;
};

export const selectError = (state) => {
  return state.solveExercise.error;
};

export const selectEvaluation = (state, id) => {
  return state.solveExercise.solutions[id].evaluation;
};

export const selectEvalStatus = (state, id) => {
  return state.solveExercise.solutions[id].status;
};

export const selectEvalError = (state, id) => {
  return state.solveExercise.solutions[id].error;
};

export const selectFeedbacks = (state, id) => {
  return state.solveExercise.solutions[id].feedbacks;
};


export default solveExerciseSlice.reducer;
