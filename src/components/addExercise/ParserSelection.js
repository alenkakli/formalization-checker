import React from 'react';
import { Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { updateParser, selectParser } from '../../redux/addExerciseSlice';

const ParserSelection = ({ selectedParser, updateParser }) => {
    return (
        <Form.Group controlId="parser-selection">
            <Form.Label>Parser type:</Form.Label>
            <Form.Control
                as="select"
                value={selectedParser}
                onChange={(e) => updateParser(e.target.value)}
            >
                <option value="withPrecedence">With Precedence</option>
                <option value="strict">Strict</option>
            </Form.Control>
        </Form.Group>
    );
};

const mapStateToProps = (state) => ({
    selectedParser: selectParser(state).value,
});

const mapDispatchToProps = {
    updateParser,
};

export default connect(mapStateToProps, mapDispatchToProps)(ParserSelection);