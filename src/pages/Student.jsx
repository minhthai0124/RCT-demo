import React, { useState, useRef, useEffect } from "react"
import RTCMultiConnection from "rtcmulticonnection"
import { useRouteMatch } from "react-router"
import { Form, Button, Row, Col, Modal } from "react-bootstrap"
import { useHistory } from "react-router-dom"

import Toast from "../utils/notifications"

function StudentPage() {
  const history = useHistory()
  const match = useRouteMatch()
  const userState = history?.location?.state?.user || {
    name: "",
    camera: true,
    micro: true,
    role: "guest",
  }

  const [user, setUser] = useState(userState)
  const [show, setShow] = useState(false)

  const handleChangeUser = (name, value) => {
    setUser((prevTags) => {
      return {
        ...prevTags,
        [name]: value,
      }
    })
  }
  const handleChangeSwitch = (name, value) => {
    setUser((prevTags) => {
      return {
        ...prevTags,
        [name]: !value,
      }
    })
  }

  const handleClose = () => setShow(false)
  // const handleShow = () => setShow(true)

  const connection = new RTCMultiConnection()
  connection.socketURL = "https://rtcmulticonnection.herokuapp.com:443/"

  connection.session = {
    audio: userState.micro,
    video: userState.camera,
    data: true,
  }

  connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
  }

  connection.mediaConstraints = {
    video: true,
    audio: true,
  }
  console.log("connection.channel", connection.channel)

  const refLocal = useRef(null)
  const refRemote = useRef(null)

  connection.onstream = (event) => {
    delete event.mediaElement.id
    const video = event.mediaElement

    console.log("connection.socket", connection.socket)

    if (event.type === "local") {
      refLocal.current.id = event.streamId
      refLocal.current.appendChild(video)
    }
    if (event.type === "remote") {
      refLocal.current.id = event.streamId
      refRemote.current.appendChild(video)
    }
  }

  connection.extra = {
    ...user,
  }

  connection.addStream({
    data: true,
  })

  const userPreferences = {
    extra: connection.extra,
    localPeerSdpConstraints: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    },
    remotePeerSdpConstraints: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    },
    isOneWay: false,
    isDataOnly: false,
    dontGetRemoteStream: false,
    dontAttachLocalStream: false,
    connectionDescription: {
      remoteUserId: connection.userid,
      message: {
        newParticipationRequest: true,
        isOneWay: false,
        isDataOnly: false,
        localPeerSdpConstraints: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true,
        },
        remotePeerSdpConstraints: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true,
        },
      },
      sender: connection.userid,
    },
    successCallback: function () {
      //
    },
  }
  let roomId = match?.params?.uuid || 1

  useEffect(() => {
    if (!history?.location?.state?.user) {
      setShow(true)
    } else {
      // history.push('/')
      connection.acceptParticipationRequest(connection.userid, userPreferences)
      connection.peers.send(user)
      connection.openOrJoin(roomId)
      // connection.peers.send(user)
      Toast.success("You are joining the class!!!", "")
      // connection.onNewParticipant(connection.userid, userPreferences)
    }
  }, [roomId])

  const handleSubmit = (event) => {
    event.preventDefault()
    connection.user = user
    history.push(history.location.pathname, { user })

    // connection.onNewParticipant = function(participantId, userPreferences) {
    //   console.log('participantId', participantId)
    //   console.log('userPreferences', userPreferences)
    //   // if OfferToReceiveAudio/OfferToReceiveVideo should be enabled for specific users
    //   userPreferences.localPeerSdpConstraints.OfferToReceiveAudio = true
    //   userPreferences.localPeerSdpConstraints.OfferToReceiveVideo = true

    //   // userPreferences.dontAttachStream = false // according to situation
    //   // userPreferences.dontGetRemoteStream = false  // according to situation

    //   // below line must be included. Above all lines are optional.
    //   // if below line is NOT included "join-request" will be considered rejected.
    //   connection.acceptParticipationRequest(participantId, userPreferences)

    //   console.log('saaaa')
    //   connection.openOrJoin(roomId)
    //   Toast.success('You are joining the class!!!', '')
    // }

    connection.openOrJoin(roomId)
    handleClose()
    history.push(history.location.pathname, {user})
    Toast.success("You are joining the class!!!", "")
    console.log("connection.userid", connection.userid)
    // connection.peers.send(user)
    // connection.send(user)
    connection.acceptParticipationRequest(connection.userid, userPreferences)
    return false
  }
  console.log("connection", connection)
  console.log("getAllParticipants", connection.getAllParticipants().length)
  console.log("connection.peers", connection.peers)
  console.log("connection.peers.getLength", connection.peers.getLength())

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>JOIN CLASS ROOM</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(event) => handleSubmit(event)}>
            <Form.Group as={Row} controlId="formHorizontalEmail">
              <Form.Label column sm={2}>
                Name
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={user.name}
                  onChange={(event) =>
                    handleChangeUser("name", event.target.value)
                  }
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalEmail">
              <Form.Label column sm={2}>
                Camera
              </Form.Label>
              <Col sm={10}>
                <Form.Check
                  type="switch"
                  id="camera"
                  label="ON/OFF"
                  checked={user.camera}
                  onChange={() => handleChangeSwitch("camera", user.camera)}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalEmail">
              <Form.Label column sm={2}>
                micro
              </Form.Label>
              <Col sm={10}>
                <Form.Check
                  type="switch"
                  id="micro"
                  label="ON/OFF"
                  checked={user.micro}
                  onChange={() => handleChangeSwitch("micro", user.micro)}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Col sm={{ span: 10, offset: 2 }}>
                <Button type="submit">Join room</Button>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>

      <Row className="justify-content-md-center">
        <Col xs lg="12">
          <h4>Student</h4>
          <div ref={refRemote}></div>
        </Col>
        <Col xs lg="12">
          <h4>Teacher</h4>
          {/* <div ref={refRemote}></div> */}
        </Col>
      </Row>

      <Row className="justify-content-md-center">
        <Col xs lg="6">
          <hr />
          <div ref={refLocal}></div>
          <p>Student: {user.name}</p>
          <hr />
        </Col>
      </Row>
    </div>
  )
}

export default StudentPage
