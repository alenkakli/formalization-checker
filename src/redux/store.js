import { configureStore } from '@reduxjs/toolkit';
import addExerciseReducer from './addExerciseSlice';
import exercisesReducer from './exercisesSlice';
import progressPropositionsReducer from './progressPropositionsSlice';
import solveExerciseReducer from './solveExerciseSlice';
import userReducer from './userSlice';
import adminsReducer from './adminsSlice';

export default configureStore({
  reducer: {
    addExercise: addExerciseReducer,
    exercises: exercisesReducer,
    propositions: progressPropositionsReducer,
    allUsers: adminsReducer,
    solveExercise: solveExerciseReducer,
    user: userReducer
  }
});
