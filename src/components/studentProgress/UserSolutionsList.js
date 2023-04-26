import React, {useEffect} from 'react';
import {Alert, Spinner, Table} from 'react-bootstrap';
import {connect} from 'react-redux';
import {
    fetchUsersSolutions,
    selectError,
    selectExerciseTitle,
    selectStatus,
    selectUserName,
    selectUsersSolution
} from "../../redux/progressPropositionsSlice";
import {FeedbacksList} from "./FeedbacksList";


function UsersSolutionList({ solutions, status, error, title, match: { params: { exercise_id, user_name } }, fetchUsersSolutions })  {
    useEffect( () => {
        fetchUsersSolutions({exercise_id, user_name});
    }, [exercise_id, user_name]);

    let content = null;
    if (status === 'loading') {
        content = <Spinner animation="border" variant="primary" />;

    } else if (status === 'succeeded') {
        let s = [];
        let table = [];
        let proposition = null;
        let first= false;

        for(let i = 0; i < solutions.length; i++){
            const solution = solutions[i]
            let date = new Date(solution.date).toLocaleString('sk-SK')
            const feedback_list = solution.feedbacks.map ( (f, index) => {
                return (index > 0) ?
                    <p className='d-inline'>, <FeedbacksList
                            exercise_id={solution.exercise_id}
                            proposition_id={solution.proposition_id}
                            feedback_id={f.feedback_id}
                            feedback={f.feedback}/></p> :
                    <FeedbacksList
                        exercise_id={solution.exercise_id}
                        proposition_id={solution.proposition_id}
                        feedback_id={f.feedback_id}
                        feedback={f.feedback}/>
            })
            if(proposition === null){
                proposition = solution.proposition;
                first = true;
            }
            else if(proposition !== solution.proposition && first){
                s.push(<h5   key={proposition} > {proposition}</h5>)
                s.push(<Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Solution</th>
                            <th>Correct</th>
                            <th>Feedbacks</th>
                        </tr>
                        </thead>
                        <tbody>
                        {table}
                        </tbody>
                    </Table>
                );
                table = [];
                proposition = solution.proposition;
            }
            if(solution.is_correct){
                table.push(
                    <tr key={solution.solution_id}>
                        <td>{date}</td>
                        <td>{solution.solution}</td>
                        <td>  &#x2713;</td>
                        <td></td>
                    </tr>)
            }
            else{
                table.push(
                    <tr key={solution.solution_id}>
                        <td>{date}</td>
                        <td>{solution.solution}</td>
                        <td>  &#x2715;</td>
                        <td>{feedback_list}</td>
                    </tr>)
            }
        }

        //last element of array
        s.push(<h5 key={proposition}> {proposition}</h5>)
        s.push(<Table striped bordered hover>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Solution</th>
                    <th>Correct</th>
                    <th>Feedbacks</th>
                </tr>
                </thead>
                <tbody>
                {table}
                </tbody>
            </Table>
        );

        content = (
            <div key={s}>{ s }</div>
        );
    } else if (status === 'failed') {
        content = (
            <Alert variant="danger">
                { error }
            </Alert>
        );
    }

    return (
        <div>
            <h2 className="mb-4" style={{display: "inline-block"}}>{title}</h2>
            <h4 className="mb-4" style={{display: "inline-block", padding: "0ex 1ex"}}>by</h4>
            <h2 className="mb-4" style={{display: "inline-block"}}>{user_name}</h2>
            { content }
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        solutions: selectUsersSolution(state),
        status: selectStatus(state),
        error: selectError(state),
        name: selectUserName(state),
        title: selectExerciseTitle(state),
    };
};

const mapDispatchToProps = { fetchUsersSolutions };

export default connect(mapStateToProps, mapDispatchToProps)(UsersSolutionList);
