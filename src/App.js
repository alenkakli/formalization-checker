import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
  Container, Alert, Button, Navbar, Nav
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import ProtectedRoute from './components/login/ProtectedRoute';
import LoginForm from './components/login/LoginForm';
import ExerciseList from './components/solveExercise/ExerciseList';
import SolveExercise from './components/solveExercise/SolveExercise';
import AddExercise from './components/addExercise/AddExercise';
import {logOut} from './redux/userSlice';
import AdminRoute from "./components/login/AdminRoute";
import Exercises from "./components/studentProgress/Exercises";
import UserSolutionsList from "./components/studentProgress/UserSolutionsList";
import UsersToExercise from "./components/studentProgress/UsersToExercise";
import ExercisesToUser from "./components/userProgress/ExercisesToUser";
import UserList from "./components/addAdmins/UserList";
import {BASE_NAME} from "./config";
import {changeStatus} from "./redux/addExerciseSlice";
import {changeExerciseStatus} from "./redux/exercisesSlice";
import EditExercise from "./components/editExercise/EditExercise";
import EditExerciseList from "./components/editExercise/EditExerciseList";
import BadExercises from "./components/badFormalizations/BadExercises";
import BadPropositionsToExercise from "./components/badFormalizations/BadPropositionsToExercise";
import BadFormalizationsToProposition from "./components/badFormalizations/BadFormalizationsToProposition";


function App({ isLoggedIn, user, logOut, changeStatus, changeExerciseStatus, isAdmin }) {
  let loginInfo = null;
  if (isLoggedIn) {
    loginInfo = (
      <React.Fragment>
        <span className="px-4 my-auto text-info">
          You are logged in as <b>{ user.username }</b>
        </span>
        <Button as={Link} to="/" onClick={() => logOut()}>
          Log out
        </Button>
      </React.Fragment>
    );
  } else {
    loginInfo = (
      <Button as={Link} to="/login">
        Log in
      </Button>
    );
  }
  if(!isAdmin){
    return (
        <BrowserRouter basename={BASE_NAME}>
          <div className="App">
            <Navbar bg="dark" variant="dark" sticky="top">
              <Nav className="mr-auto">
                <Nav.Link className="px-4" as={Link} to="/" onClick={() => changeExerciseStatus()}>
                  Home
                </Nav.Link>
                <Nav.Link className="px-4" as={Link} to="/progress">
                  Your progress
                </Nav.Link>
              </Nav>

              <Nav>
                { loginInfo }
              </Nav>

            </Navbar>
            <Container className="my-3">
              <Switch>
                <ProtectedRoute exact path="/" component={ExerciseList} />
                <Route exact path="/login" component={LoginForm} />
                <ProtectedRoute path="/solve/:id" component={SolveExercise} />
                <ProtectedRoute exact path="/progress" component={ExercisesToUser} />
                <ProtectedRoute exact path="/progress/:exercise_id/:user_name" component={UserSolutionsList} />

                <Route path="*" component={() => {
                  return <Alert variant="danger">404 Not Found</Alert>
                }} />
              </Switch>
            </Container>
          </div>
        </BrowserRouter>
    );
  }
  return (
    <BrowserRouter basename={BASE_NAME}>
      <div className="App">
        <Navbar bg="dark" variant="dark" sticky="top">
          <Nav className="mr-auto">
            <Nav.Link className="px-4" as={Link} to="/" onClick={() => changeExerciseStatus()}>
              Home
            </Nav.Link>
            <Nav.Link className="px-4" as={Link} to="/add">
              Add
            </Nav.Link>
            <Nav.Link className="px-4" as={Link} to="/edit">
              Edit
            </Nav.Link>
            <Nav.Link className="px-4" as={Link} to="/progress">
              Student progress
            </Nav.Link>
            <Nav.Link className="px-4" as={Link} to="/bad_formalizations">
              Bad formalizations
            </Nav.Link>
            <Nav.Link className="px-4" as={Link} to="/admins">
              Admin
            </Nav.Link>
          </Nav>

          <Nav>
            { loginInfo }
          </Nav>

          </Navbar>
        <Container className="my-3">
          <Switch>
            <ProtectedRoute exact path="/" component={ExerciseList} />
            <AdminRoute exact path="/admins" component={UserList} />
            <AdminRoute exact path="/progress" component={Exercises} />
            <AdminRoute exact path="/progress/:exercise_id" component={UsersToExercise} />
            <AdminRoute exact path="/progress/:exercise_id/:user_name" component={UserSolutionsList} />
            <Route exact path="/login" component={LoginForm} />
            <ProtectedRoute path="/solve/:id" component={SolveExercise} />
            <AdminRoute exact path="/add" component={AddExercise} />
            <AdminRoute exact path="/edit" component={EditExerciseList} />
            <AdminRoute exact path="/edit/:id" component={EditExercise} />
            <AdminRoute exact path="/bad_formalizations" component={BadExercises} />
            <AdminRoute exact path="/bad_formalizations/:exercise_id" component={BadPropositionsToExercise} />
            <AdminRoute exact path="/bad_formalizations/:exercise_id/:proposition_id" component={BadFormalizationsToProposition} />

            <Route path="*" component={() => {
              return <Alert variant="danger">404 Not Found</Alert>
            }} />
          </Switch>
        </Container>
      </div>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    isAdmin: state.user.isAdmin,
    user: state.user.user
  };
};

const mapDispatchToProps = { logOut, changeStatus, changeExerciseStatus };

export default connect(mapStateToProps, mapDispatchToProps)(App);
