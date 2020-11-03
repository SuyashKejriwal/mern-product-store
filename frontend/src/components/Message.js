import React from 'react'
import PropTypes from 'prop-types'
import {Alert } from 'react-bootstrap'

const Message = ({variant, children }) => {
    return (
        <Alert variant={variant}>
            {children}
        </Alert>
    )
}

Message.defaultProps = {
    variant: 'blue'
}

Message.propTypes = {
    variant: PropTypes.string,
    children:PropTypes.string.isRequired,
}

export default Message
