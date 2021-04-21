import React from 'react'
import PropTypes from 'prop-types'

const Stream = (props) => {
  return (
    <div id={props.id} className="teacher-video">

      <div
        className="video-track"
        dangerouslySetInnerHTML={{__html: props.video}}
      />
      {/* {props.video} */}
      {/* <props.video /> */}
      <div className="control">
        <span className="camera" />
        <span className="micro"/>
      </div>
      <p>{props.name}</p>
    </div>
  )
}

Stream.propTypes = {
  id: PropTypes.string,
  video: PropTypes.any,
  name: PropTypes.string
}

export default Stream
