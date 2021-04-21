import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Form, Row, Col } from 'react-bootstrap'

function TopPage() {
  const [roomId, setRoomId] = useState('')
  const handleChangeTextRoomId = (text) => {
    setRoomId(text)
  }
  return (
    <Row className="top-page">
      <Col xs lg="6">
        <h4>Top page</h4>
        <hr />

        <Form.Control
          id="text-roomId"
          type="text"
          placeholder="Unique Room ID"
          onChange={(event) => handleChangeTextRoomId(event.target.value)}
          value={roomId}
        />
        <div>
          <Link to={`/live/${roomId}/teacher`} target="_blank">Teacher Page</Link>
        </div>
        <div>
          <Link to={`/live/${roomId}/student`} target="_blank">Student Page</Link>
        </div>
      </Col>
    </Row>
  )
}

export default TopPage
