import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import ExerciseList from './components/solveExercise/ExerciseList';
import { SolveExercise } from './components/solveExercise/SolveExercise';
import initStore from './redux/store';
import {
  logInByGithub, setUser, selectUser
} from './redux/userSlice';
import { Alert, Spinner } from 'react-bootstrap';
import {
  selectExercise,
  selectStatus,
  selectError,
  fetchExercise
} from './redux/solveExerciseSlice';
import { connect } from 'react-redux';

import './static/css/bootstrap.min.iso.css';
import styles from './AppComponent.module.scss';

function makePropositionIdToIndexMap(exercise) {
  let m = {}
  for (let i = 0; i < exercise.propositions.length; i++) {
    m[exercise.propositions[i].proposition_id] = i;
  }
  return m;
}

export default function configure(backendUrl) {
  return {
    prepare: (initialState, additionalArgs) => {
      const syncedState = JSON.parse(JSON.stringify(initialState)) || {}
      const pid2index = syncedState.exercise ? makePropositionIdToIndexMap(syncedState.exercise) : undefined;
      const instance = {
        store: initStore(backendUrl),
        syncedState,
        pid2index,
        ghAccessToken: additionalArgs?.ghAccessToken,
      };
      const getState = (instance) => JSON.parse(JSON.stringify(instance.syncedState));
      return {
        instance,
        getState
      };
    },
    AppComponent: (props) => (
      <div
        className={`formalization-checker-ZF2r5pOxUp${
          props.isEdited ? '' : (' ' + styles.viewMode)
        }`}
      >
        <Provider store={props.instance.store}>
          <AppComponent instance={props.instance} onStateChange={props.onStateChange} />
        </Provider>
      </div>
    )
  }
}


const SolveExerciseEmbedded = connect((state) => {
  return {
    exercise: selectExercise(state),
    status: selectStatus(state),
    error: selectError(state),
    user: selectUser(state),
  }
}, {})(SolveExercise);

function AppComponent({ instance, onStateChange, isEdited }) {
  const { ghAccessToken } = instance;
  const [exerciseId, setExerciseId] = useState(instance.syncedState.exerciseId)
  const { exercise } = instance.syncedState;
  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem("formalization_checker_token") !== null) {
      dispatch(setUser());
    } else {
      dispatch(logInByGithub({ token: ghAccessToken }));
    }
  }, [])

  const [selectionError, setSelectionError] = useState(undefined);
  const status = useSelector(selectStatus);
  const username = useSelector(selectUser);
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

  useEffect(async () => {
    if (exerciseId && username && exercise && status === 'idle') {
      dispatch({
        type: 'solveExercise/fetchExercise/fulfilled',
        payload: JSON.parse(JSON.stringify(exercise)),
      })
    }
  }, [exerciseId, exercise, username, status])

  const handleSelect = async (id) => {
    const r = await dispatch(fetchExercise({ exercise_id: id, username }));
    if (r.type === 'solveExercise/fetchExercise/fulfilled') {
      instance.syncedState = {
        exercise: JSON.parse(JSON.stringify(r.payload)),
        exerciseId: id
      }
      instance.pid2index = makePropositionIdToIndexMap(instance.syncedState.exercise);
      setExerciseId(id);
      onStateChange();
    } else {
      setSelectionError('Exercise fetching failed');
    }
  }

  const handleChange = (value, propositionId) => {
    const { pid2index } = instance;
    exercise.propositions[pid2index[propositionId]].solution = value;
    onStateChange();
  }

  return (
    <>
      {(isLoggedIn === false && exerciseId === undefined) && <>Loading...</>}
      {(isLoggedIn === true && exerciseId === undefined) &&
        <>
          {selectionError && <Alert variant="danger">{selectionError}</Alert>}
          <ExerciseList onSelect={handleSelect} />
        </>
      }
      {(exerciseId !== undefined && exercise !== undefined) &&
        <SolveExerciseEmbedded
          exerciseId={exerciseId}
          onChange={handleChange}
          fetchExercise={() => 0}
        />
      }
    </>
  );
}