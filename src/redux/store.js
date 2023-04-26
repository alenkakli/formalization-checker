import { configureStore } from '@reduxjs/toolkit';
import addExerciseReducer from './addExerciseSlice';
import progressPropositionsReducer from './progressPropositionsSlice';
import solveExerciseReducer from './solveExerciseSlice';
import userReducer from './userSlice';
import adminsReducer from './adminsSlice';
import { badFormalizationsSlice } from './badFormalizationsSlice';
import { feedbacksSlice } from './feedbacksSlice';
import backendReducer from './backendSlice';

export default function (backendUrl) {
  return configureStore({
    reducer: {
      addExercise: addExerciseReducer,
      propositions: progressPropositionsReducer,
      allUsers: adminsReducer,
      solveExercise: solveExerciseReducer,
      user: userReducer,
      backend: backendReducer(backendUrl),
      [badFormalizationsSlice.reducerPath]: badFormalizationsSlice.reducer,
      [feedbacksSlice.reducerPath]: feedbacksSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(badFormalizationsSlice.middleware, feedbacksSlice.middleware)
  });
}
