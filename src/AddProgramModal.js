import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class AddProgramModal extends React.Component {
  constructor(props) {
    super(props);
    ['title', 'date', 'time', 'duration'].forEach((field) => this[field] = React.createRef());
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    let date = '', time = '', duration = '01:00';
    if (this.props.options.hasOwnProperty('begin')) {
      const begin = new Date(this.props.options.begin);
      date = begin.getUTCDate() + '.' + (begin.getUTCMonth() + 1) + '.' + begin.getUTCFullYear();
      time = begin.getUTCHours() + ':' + ((begin.getUTCMinutes() < 10) ? '0' : '') + begin.getUTCMinutes();
    }

    const setDuration = ((duration) => {
      this.duration.current.value = duration;
    });

    return (
      <Modal show={true} onHide={this.props.handleClose}>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Nový program</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group as={Row}>
              <Form.Label column sm="2">Název</Form.Label>
              <Col>
                <Form.Control type="text" ref={this.title} />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">Začátek</Form.Label>
              <Col>
                <Form.Control type="text" defaultValue={time} ref={this.time} placeholder="MM:HH" />
              </Col>
              <Col>
                <Form.Control type="text" defaultValue={date} ref={this.date} placeholder="YYYY-MM-DD" />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="2">Délka</Form.Label>
              <Col>
                <Form.Control type="text" defaultValue={duration} ref={this.duration} placeholder="MM:HH" />
              </Col>
            </Form.Group>
            {[["00:15", "15 min"], ["00:30", "30 min"], ["00:45", "45 min"], ["01:00", "1 hod"],
              ["01:30", "1,5 hod"], ["02:00", "2 hod"]].map((button) =>
              <Button
                variant={'outline-secondary'}
                key={button[0]}
                onClick={() => setDuration(button[0])}
              >
                {button[1]}
              </Button>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" onClick={this.props.handleClose}>
              Zrušit
            </Button>
            <Button variant="primary" type="submit">
              Přidat
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }

  handleSubmit(event) {
    event.preventDefault();

    const dateVals = this.date.current.value.split('.');
    const date = Date.UTC(parseInt(dateVals[2], 0), parseInt(dateVals[1], 0) - 1, parseInt(dateVals[0], 0));
    const timeVals = this.time.current.value.split(':');
    const time = Date.UTC(1970, 0, 1, parseInt(timeVals[0], 0), parseInt(timeVals[1], 0));

    this.props.addProgram({
      begin: date + time,
      duration: Date.parse('1970-01-01T' + this.duration.current.value + ':00.000+00:00'),
      title: this.title.current.value,
    });

    this.props.handleClose();
  }
}

export default AddProgramModal;