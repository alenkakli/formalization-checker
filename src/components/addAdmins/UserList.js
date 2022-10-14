import React, { useEffect } from 'react';
import {Spinner, Alert, Table, Form, Button} from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  selectStatus, selectError, addChanged, fetchAllUsers, saveAdmins,
  selectAllUsers, selectChangedAdmins
} from "../../redux/adminsSlice";


function UserList({ users, status, error, fetchAllUsers, addChanged, changedAdmins, saveAdmins }) {
  useEffect(() => {
    if (status === 'idle') {
      fetchAllUsers();
    }
  }, [status, fetchAllUsers]);

  let content = null;
  if (status === 'loading') {
    content = <Spinner animation="border" variant="primary" />;
  } else if (status === 'succeeded') {
    let user = users.map((x) => (
        <tr key={x.user_name}>
          <td>
              { x.user_name }
          </td>
        <td> <input type="checkbox" defaultChecked={x.is_admin} id={x.user_name} onChange={(e) => {addChanged(e.target.id)}}/> </td>

        </tr>
    ));
    content =
        <Form>
        <Table striped bordered hover>
          <thead>
          <tr>
            <th>Username</th>
            <th>Is admin</th>
          </tr>
          </thead>
          <tbody>
          { user }
          </tbody>
        </Table>
        </Form>

  } else if (status === 'failed') {
    content = (
      <Alert variant="danger">
        { error }
      </Alert>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Users</h2>
      { content }
        <Button  onClick={(e) => {saveAdmins(changedAdmins)}}>Save admins</Button>

    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    users: selectAllUsers(state),
    status: selectStatus(state),
    error: selectError(state),
    changedAdmins: selectChangedAdmins(state),
  };
};

const mapDispatchToProps = { fetchAllUsers, addChanged, saveAdmins };

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
