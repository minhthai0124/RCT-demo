import React, { useState, useEffect, useRef } from "react"
import RTCMultiConnection from "rtcmulticonnection"
import { useRouteMatch } from "react-router"
import { Form, Button, Row, Col, Modal } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import ReactDOM from 'react-dom'

import Stream from './StreamComponent'

import Toast from "../utils/notifications"

function LiveRoom() {
  const history = useHistory()
  const match = useRouteMatch()
  const userState = history?.location?.state?.user || {
    name: "",
    camera: true,
    micro: true,
    role: match?.params.role,
    whatever: true
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

  const refLocal = useRef(null)
  const refRemote = useRef(null)

  connection.onstream = (event) => {
    delete event.mediaElement.id
    const video = event.mediaElement
    console.log('video', video)
    video.controls = false

    console.log('event',event)

    if (event.extra.role === "teacher") {
      // const Div = React.createElement(Stream, {
      //   id: event.mediaElement.id,
      //   video: video,
      //   name: event.extra.name
      // })

      // console.log('Div', Div);

      refLocal.current.id = event.streamId

      // refRemote.current.appendChild(div)
      ReactDOM.render(<Stream id={event.mediaElement.id} video={video} name={event.extra.name}/>, refRemote.current)
      refRemote.current.appendChild(video)
      refRemote.current.appendChild(<Stream id={event.mediaElement.id} video={video} name={event.extra.name}/>)
      console.log('refRemote.current', refRemote.current);
    }
    if (event.extra.role === "student") {
      refLocal.current.id = event.streamId
      refRemote.current.appendChild(video)
    }
  }

  connection.onstreamended = (event) => {
    const div = document.getElementById(event.streamId)
    console.log('div', div);
  }

  connection.extra = {
    ...user,
  }

  console.log("connection.userid", connection.userid)

  const checkUser = () => {
    console.log("connection.useridconnection.useridconnection.userid")
    connection.openOrJoin(roomId)

    connection.beforeAddingStream = function (stream, peer) {
      console.log("peer", peer)

      console.log("beforeAddingStream ", connection.getAllParticipants())

      // connection.getAllParticipants().forEach( participantId => {
      //   const user = connection.peers[participantId]
      //   const extra = user.extra
      //   console.log('extra', extra)

      //   if(extra.role === 'teacher') {
      //     Toast.error('This room has only one teacher!!!', '')
      //     history.push('/')
      //   }
      // })

      // var remoteUserId = peer.userid
      // var remoteUserExtra = connection.peers[remoteUserId].extra

      return stream // otherwise allow RTCMultiConnection to share this stream with remote users
    }

      connection.onNewParticipant = function (participantId, userPreferences) {
        console.log("participantId", participantId)
        console.log("userPreferences", userPreferences)
        // if OfferToReceiveAudio/OfferToReceiveVideo should be enabled for specific users
        userPreferences.localPeerSdpConstraints.OfferToReceiveAudio = true
        userPreferences.localPeerSdpConstraints.OfferToReceiveVideo = true

        connection.getAllParticipants().forEach((participantId) => {
          const userConnection = connection.peers[participantId]
          console.log("userConnection", userConnection)

          const extra = userConnection.extra
          console.log("extra", extra)

          if (extra.role === "teacher") {
            console.log("extra.role", extra.role)
          }
        })

        // userPreferences.dontAttachStream = false // according to situation
        // userPreferences.dontGetRemoteStream = false  // according to situation

        // below line must be included. Above all lines are optional.
        // if below line is NOT included "join-request" will be considered rejected.
        connection.acceptParticipationRequest(participantId, userPreferences)
        Toast.success("You are joining the class!!!", "")
    }

    connection.onopen = function (event) {
      console.log('connection.getAllParticipants()',connection.getAllParticipants())
      // console.log("event", event)
      // var remoteUserId = event.userid

      // console.log("remoteUserId", remoteUserId)
      // console.log("users ", connection.getAllParticipants())

      let numberTeacher = 0

      connection.getAllParticipants().forEach((participantId) => {
        const userConnection = connection.peers[participantId]
        const extra = userConnection.extra
        // console.log("extra", extra)

        if (extra.role === "teacher") {
          numberTeacher = numberTeacher + 1
          // console.log("extra.role", extra.role)
        }
      })

      // console.log('numberTeacher', numberTeacher)

      console.log(" passss numberTeacher", numberTeacher)
      Toast.success("You are joining the class!!!", "")
      // if(numberTeacher > 1) {
      //   Toast.error("This room has only one teacher!!!", "")
      //   history.push("/")
      // } else {
      //   console.log(' passss numberTeacher',numberTeacher)
      //   Toast.success("You are joining the class!!!", "")
      // }
    }
  }

  let roomId = match?.params?.uuid || 1

  useEffect(() => {
    if (!history?.location?.state?.user) {
      setShow(true)
    } else {
      connection.user = user
      checkUser()
      Toast.success("You are joining the class!!!", "")
    }
  }, [roomId, history])

  const handleSubmit = (event) => {
    event.preventDefault()
    connection.user = user
    checkUser()
    history.push(history.location.pathname, { user })
    handleClose()
    return false
  }
  // console.log('connection', connection)
  // console.log('connection.getAllParticipants', connection.getAllParticipants())
  // console.log('connection.peers', connection.peers)

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

      <hr />
      <Row className="justify-content-md-center">
        <Col xs lg="8" className="side-left">
          <h4>Student</h4>
          <div ref={refRemote}></div>
        </Col>
        <Col xs lg="4" className="side-right">
          <h4>Teacher</h4>
          <div ref={refLocal}></div>
          {/* <p>{user.name}</p> */}
        </Col>
      </Row>
    </div>
  )
}

export default LiveRoom
