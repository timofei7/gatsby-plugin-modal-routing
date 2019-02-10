import _ from 'lodash'
import React from 'react'
import Modal from 'react-modal'

class ReplaceComponentRenderer extends React.Component {
  state = {
    prevPageResources: null,
    pathname: null,
  }

  // TODO: track location prop change
  constructor(...args) {
    super(...args)
  }

  static getDerivedStateFromProps(props, state) {
    // TODO: handle history changes
    if (props.location.pathname !== state.pathname) {
      return {
        pathname: props.location.pathname,
        props: props,
        prevProps: state.props,
      }
    }
  }

  render() {
    // render modal if props location has modal
    const { pageResources, location, loader } = this.props
    const { prevProps } = this.state
    const isModal = _.get(location, 'state.modal')

    const resources = prevProps && isModal ?
      prevProps.pageResources : pageResources

    const pageElement = prevProps && isModal ? (
      React.createElement(prevProps.pageResources.component, {
        ...prevProps,
        key: prevProps.pageResources.page.path,
      })
    ) : (
      React.createElement(pageResources.component, {
        ...this.props,
        key: pageResources.page.path,
      })
    )

    const modalElement = isModal ? React.createElement(pageResources.component, {
      ...this.props,
      modal: true,
      modalCloseTo: prevProps.location.pathname,
      key: pageResources.page.path,
    }) : null

    return (
      <>
        {pageElement}

        <Modal
          isOpen={!!modalElement}
        >
          {modalElement ? (
            <React.Fragment
              key={this.props.location.key}
            >
              {modalElement}
            </React.Fragment>
          ) : null}
        </Modal>
      </>
    )
  }
}

// You can delete this file if you're not using it
//
const replaceComponentRenderer = ({ props, loader }) => {
  return React.createElement(ReplaceComponentRenderer, { ...props, loader })
}

export default replaceComponentRenderer
