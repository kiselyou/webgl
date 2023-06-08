import React from 'react'
import css from './style.pcss'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Text from '@components/Text'

export default class FieldRange extends React.Component {
  constructor(props) {
    super(props)

  }

  static propTypes = {
    classNames: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.number,
    step: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func
  }

  static defaultProps = {
    value: 0,
    step: 0.1,
    min: -1,
    max: 1,
  }

  render() {
    return (
      <Text
        size={12}
        className={classNames(css['range'], {
          [this.props.classNames]: !!this.props.classNames
        })}
      >
        <div className={css['range_label']}>
          <div>{this.props.min}</div>
          <div>{this.props.value}</div>
          <div>{this.props.max}</div>
        </div>
        <input
          type="range"
          defaultValue={this.props.value}
          step={this.props.step}
          min={this.props.min}
          max={this.props.max}
          onChange={this.props.onChange}
        />
      </Text>
    )
  }
}
