import React from 'react'
import PropTypes from 'prop-types'
import objectPath from 'object-path'
import nodes from '@components/Svg/nodes'

const items = { ...nodes }

export default class Svg extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  render() {
    let path = this.getComponentPath(this.props.name)
    let SvgComponent = objectPath.get(items, path)

    if (!SvgComponent) {
      return
    }

    return (
      <SvgComponent
        {...this.props}
        style={this.props.style}
        className={this.props.className}
      />)
  }

  getComponentPath(name) {
    const split = this.props.name.split('/')
    name = split[split.length - 1]
    let words = name.split('-').map((word) => {
      return String(word).charAt(0).toUpperCase() + String(word).slice(1)
    })
    const componentName = words.join('')

    let basePath = split.slice(0, split.length - 1)
    return [ ...basePath, componentName]
  }
}
