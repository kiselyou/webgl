import css from './style.pcss'
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Text from '@components/Text'

export default class Range extends React.Component {

  static propTypes = {
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    style: PropTypes.object,
    children: PropTypes.node,
    className: PropTypes.string,
    percent: PropTypes.number.isRequired,
  }

  static defaultProps = {
    min: 0,
    max: 100,
  }

  render() {
    return (
      <Text
        size={12}
        style={this.props.style}
        skin={Text.SKIN_DEFAULT_100}
        className={classNames(css['range'], {
          [this.props.className]: !!this.props.className
        })}
      >
        <div
          className={css['range_value']}
          style={{ width: `${this.props.percent}%` }}
        />
        <span>{this.props.min}</span>
        <span>{this.props.value}</span>
        <span>{this.props.max}</span>

      </Text>
    )
  }
}
