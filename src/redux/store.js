import { configureStore } from '@reduxjs/toolkit';
import addExerciseReducer from './addExerciseSlice';
import exercisesReducer from './exercisesSlice';
import progressPropositionsReducer from './progressPropositionsSlice';
import solveExerciseReducer from './solveExerciseSlice';
import userReducer from './userSlice';
import adminsReducer from './adminsSlice';
import backendReducer from './backendSlice';

export default function (backendUrl) {
  return configureStore({
    reducer: {
      addExercise: addExerciseReducer,
      exercises: exercisesReducer,
      propositions: progressPropositionsReducer,
      allUsers: adminsReducer,
      solveExercise: solveExerciseReducer,
      user: userReducer,
      backend: backendReducer(backendUrl),
    }
  });
}
