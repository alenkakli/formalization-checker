import {
  createSlice,
  createSelector,
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
  parseLanguageSubset,
  parseFormalization
} from './helpers';


/* async actions */

export const addNewExercise = createAsyncThunk(
  'addExercise/addNewExercise',
  async (_, { getState, rejectWithValue }) => {
    let exercise = selectExercise(getState());
    if (!exercise) {
      return rejectWithValue("Exercise contains errors.");
    }
    try {
      let response = await fetchData(
        '/api/exercises', 'POST', exercise
      );
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveExercise = createAsyncThunk(
  'saveExercise',
  async (_, { getState, rejectWithValue }) => {
    let exercise = selectExercise(getState());
    if (!exercise) {
      return rejectWithValue("Exercise contains errors.");
    }
    try {
      let response = await fetchData(
        '/api/exercises/edit', 'POST', exercise
      );
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeExercise = createAsyncThunk(
  'saveExercise',
  async (_, { getState, rejectWithValue }) => {
    let exercise = selectExercise(getState());
    if (!exercise) {
      return rejectWithValue("Exercise contains errors.");
    }
    try {
      let response = await fetchData(
        '/api/exercises/edit/remove', 'POST', exercise
      );
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchSavedExercise = createAsyncThunk(
  'fetchSavedExercise',
  async (exercise_id, { getState, rejectWithValue }) => {
    try {
      let response = await fetchData(
          `/api/exercises/edit/${exercise_id}`, 'GET'
      );
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchExercise = createAsyncThunk(
    'fetchExercise',
    async (exercise_id, { rejectWithValue }) => {
      try {
        let response = await fetchData(
            `/api/exercises/${exercise_id}`, 'GET'
        );
        return response;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
);

/* slice */
export const addExerciseSlice = createSlice({
  name: 'addExercise',
  initialState: {
    title: '',
    description: '',
    constants: '',
    predicates: '',
    functions: '',
    constraint: '',
    id: '',
    propositions: [{
      proposition: '',
      proposition_id: '',
      formalizations: [''],
      constraints: ['']
    }],

    status: 'idle',
    error: null,
    added: null,
  },
  reducers: {
    updateExerciseTitle: (state, action) => {
      state.title = action.payload;
    },
    updateDescription: (state, action) => {
      state.description = action.payload;
    },
    updateConstants: (state, action) => {
      state.constants = action.payload;
    },
    updatePredicates: (state, action) => {
      state.predicates = action.payload;
    },
    updateFunctions: (state, action) => {
      state.functions = action.payload;
    },
    updateConstraint: (state, action) => {
      state.constraint = action.payload;
    },
    updateInformalValue: {
      reducer: (state, action) => {
        const { value, i } = action.payload;
        state.propositions[i].proposition = value;
      },
      prepare: (value, i) => {
        return { payload: { value, i } };
      }
    },
    updateFormalization: {
      reducer: (state, action) => {
        const { value, i, j } = action.payload;
        state.propositions[i].formalizations[j] = value;
      },
      prepare: (value, i, j) => {
        return { payload: { value, i, j } };
      }
    },
    addNewProposition: (state) => {
      state.propositions.push({
        proposition: '',
        formalizations: [''],
        constraints: ['']
      });
    },
    addNewFormalization: (state, action) => {
      const i = action.payload;
      state.propositions[i].formalizations.push('');
      state.propositions[i].constraints.push('');
    },
    removeProposition: (state, action) => {
      const i = action.payload;
      state.propositions.splice(i, 1);
    },
    removeFormalization: {
      reducer: (state, action) => {
        const { i, j } = action.payload;
        state.propositions[i].formalizations.splice(j, 1);
        state.propositions[i].constraints.splice(j, 1);
      },
      prepare: (i, j) => {
        return { payload: { i, j } };
      }
    },
    updateConstraints: {
      reducer: (state, action) => {
        const { value, i, j } = action.payload;
        state.propositions[i].constraints[j] = value;
      },
      prepare: (value, i, j) => {
        return { payload: { value, i, j} };
      }
    },
    changeStatus: {
      reducer: (state, action) => {
        state.added = null;
        state.status = 'idle';
        state.title = '';
        state.description = '';
        state.constants = '';
        state.predicates = '';
        state.functions = '';
        state.constraint = '';
        state.id = '';
        state.propositions = [{
          proposition: '',
          proposition_id: '',
          formalizations: [''],
          constraints: ['']
        }];

      }
    },
  },
  extraReducers: {
    [addNewExercise.pending]: (state, action) => {
      state.status = 'loading';
    },
    [addNewExercise.fulfilled]: (state, action) => {
      state.added = true;
      state.title =  ''
      state.description =  ''
      state.constants =  ''
      state.predicates = ''
      state.functions =  ''
      state.constraint = ''
      state.propositions= [{
        "proposition": '',
        "formalizations": [''],
        "constraints": ['']
      }]

      state.status = 'idle'
    },
    [addNewExercise.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [saveExercise.pending]: (state, action) => {
      state.status = 'loading';
    },
    [saveExercise.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.title = '';
      state.description = '';
      state.constants = '';
      state.predicates = '';
      state.functions = '';
      state.constraint = '';
      state.id = '';
      state.propositions = [{
        proposition: '',
        proposition_id: '',
        formalizations: [''],
        constraints: ['']
      }];
    },
    [saveExercise.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [removeExercise.pending]: (state, action) => {
      state.status = 'loading';
    },
    [removeExercise.fulfilled]: (state, action) => {
      state.status = 'removed';
      state.title = '';
      state.description = '';
      state.constants = '';
      state.predicates = '';
      state.functions = '';
      state.constraint = '';
      state.id = '';
      state.propositions = [{
        proposition: '',
        proposition_id: '',
        formalizations: [''],
        constraints: ['']
      }];
    },
    [removeExercise.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [fetchExercise.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchExercise.fulfilled]: (state, action) => {
      state.status = 'succeeded';
    },
    [fetchExercise.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    [fetchSavedExercise.pending]: (state, action) => {
      state.status = 'loading';
    },
    [fetchSavedExercise.fulfilled]: (state, action) => {
      state.status = 'idle';
      const exercise = action.payload;
      state.title = exercise.title;
      state.description = exercise.description;
      state.constants = exercise.constants;
      state.predicates = exercise.predicates;
      state.functions = exercise.functions;
      state.constraint = exercise.constraints === undefined? "": exercise.constraints;
      state.id = exercise.exercise_id;
      state.propositions = [];
      for (let i = 0; i < exercise.propositions.length; i++) {
        let formalization = [];
        let constraint = [];
        for (let j = 0; j < exercise.propositions[i].formalization.length; j++) {
          formalization.push(exercise.propositions[i].formalization[j].formalization);
          constraint.push(exercise.propositions[i].formalization[j].constraints);
        }
        state.propositions.push({
          proposition: exercise.propositions[i].proposition,
          proposition_id: exercise.propositions[i].proposition_id,
          formalizations: formalization,
          constraints: constraint
        })
      }
    },
    [fetchSavedExercise.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  }
});


/* export actions */
export const {
  updateExerciseTitle,
  updateDescription,
  updateConstants,
  updatePredicates,
  updateFunctions,
  updateInformalValue,
  updateFormalization,
  addNewProposition,
  addNewFormalization,
  removeProposition,
  removeFormalization,
  updateConstraints,
  updateConstraint,
    changeStatus
} = addExerciseSlice.actions;


/* definition of helper functions used in selectors */

function checkForDuplicates(values, name) {
  let found = new Set();
  for (let x of values) {
    if (found.has(x)) {
      return `Found duplicate symbol: '${x}' in ${name}`;
    } else {
      found.add(x);
    }
  }

  return null;
}

function checkForClashes(constants, predicates, functions) {
  for (let x of constants) {
    if (predicates.has(x)) {
      return `Found clash in language definition: '${x}' in constants and predicates`;
    }
    if (functions.has(x)) {
      return `Found clash in language definition: '${x}' in constants and functions`;
    }
  }

  for (let x of predicates.keys()) {
    if (functions.has(x)) {
      return `Found clash in language definition: '${x}' in predicates and functions`;
    }
  }

  return null;
}


/* selectors */

export const selectExerciseTitle = (state) => {
  return {
    value: state.addExercise.title
  };
};

export const selectDescription = (state) => {
  return {
    value: state.addExercise.description
  };
};

export const selectConstantsParsed = createSelector(
  [ state => state.addExercise.constants ],
  (value) => {
    let result = parseLanguageSubset(value, parseConstants);
    return {
      value: value,
      array: result.array,
      error: result.error
    };
  }
);

export const selectPredicatesParsed = createSelector(
  [ state => state.addExercise.predicates ],
  (value) => {
    let result = parseLanguageSubset(value, parsePredicates);
    return {
      value: value,
      array: result.array,
      error: result.error
    };
  }
);

export const selectFunctionsParsed = createSelector(
  [ state => state.addExercise.functions ],
  (value) => {
    let result = parseLanguageSubset(value, parseFunctions);
    return {
      value: value,
      array: result.array,
      error: result.error
    };
  }
);

export const selectLanguage = createSelector(
  [
    selectConstantsParsed,
    selectPredicatesParsed,
    selectFunctionsParsed
  ],
  (constantsParsed, predicatesParsed, functionsParsed) => {
    let constants = new Set(constantsParsed.array);
    let predicates = arrayToArityMap(predicatesParsed.array);
    let functions = arrayToArityMap(functionsParsed.array);

    let containsErrors = constantsParsed.error
      || predicatesParsed.error
      || functionsParsed.error;
    let containsDuplicates = checkForDuplicates(constantsParsed.array, "constants")
      || checkForDuplicates(predicatesParsed.array.map(x => x.name), "predicates")
      || checkForDuplicates(functionsParsed.array.map(x => x.name), "functions");
    
    let errorMessage = null;
    if (containsErrors) {
      errorMessage = "Language definition contains errors";
    } else if (containsDuplicates) {
      errorMessage = containsDuplicates;
    } else {
      errorMessage = checkForClashes(constants, predicates, functions);
    }

    return { constants, predicates, functions, errorMessage };
  }
);

export const selectPropositions = (state) => {
  return state.addExercise.propositions;
};

export const selectFormalizations = (state, i) => {
  return state.addExercise.propositions[i].formalizations;
};

export const selectInformalValue = (state, i) => {
  return state.addExercise.propositions[i].proposition;
};

export const selectFormalization = createSelector(
  [
    (state, i, j) => state.addExercise.propositions[i].formalizations[j],
    (state, i, j) => selectLanguage(state)
  ],
  (value, language) => {
    let error = parseFormalization(
      value, language.constants, language.predicates,
      language.functions, parseFormulaWithPrecedence
    );
    return { value, error };
  }
);
export const selectConstraints = createSelector(
  [
    (state, i, j) => state.addExercise.propositions[i].constraints[j],
    (state, i, j) => selectLanguage(state)
  ],
  (value, language) => {
    if(value === ''){
      return { value, error: ""};
    }
    let error = parseFormalization(
      value, language.constants, language.predicates,
      language.functions, parseFormulaWithPrecedence
    );
    return { value, error };
  }
);
export const selectConstraint = createSelector(
  [
    (state) => state.addExercise.constraint,
    (state) => selectLanguage(state)
  ],
  (value, language) => {
    if(value === ''){
      return { value, error: ""};
    }
    let error = parseFormalization(
      value, language.constants, language.predicates,
      language.functions, parseFormulaWithPrecedence
    );
    return { value, error };
  }
);

const selectExercise = (state) => {
  let language = selectLanguage(state);
  if (language.errorMessage || selectExerciseTitle(state).value === "") {
    return null;
  }

  let propositions = selectPropositions(state);
  for (let i = 0; i < propositions.length; i++) {
    if (propositions[i].proposition === "") {
      return null;
    }
    let formalizations = propositions[i].formalizations;
    for (let j = 0; j < formalizations.length; j++) {
      let formalization = selectFormalization(state, i, j);
      if (formalization.error) {
        return null;
      }
      let constraint = selectConstraints(state, i, j);
      if (constraint.error) {
        return null;
      }
    }
  }
  
  return {
    title: state.addExercise.title,
    description: state.addExercise.description,
    constants: state.addExercise.constants,
    predicates: state.addExercise.predicates,
    functions: state.addExercise.functions,
    constraint: state.addExercise.constraint,
    id: state.addExercise.id,
    propositions: state.addExercise.propositions,
  };
};

export const checkExercise = (state) => {
  let exercise = selectExercise(state);
  return !exercise;
};


export default addExerciseSlice.reducer;
