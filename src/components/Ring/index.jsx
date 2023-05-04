import React from 'react'
import css from './style.pcss'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class Ring extends React.Component {
  constructor(props) {
    super(props)

    this.ref = React.createRef()
    this.normalizedRadius = this.props.radius - (this.props.stroke / 2)
    this.circumference = this.normalizedRadius * 2 * Math.PI
  }

  static SKIN_DEFAULT_025 = 'default-025'

  static propTypes = {
    radius: PropTypes.number,
    stroke: PropTypes.number,
    progress: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    bordered: PropTypes.bool,
    shadow: PropTypes.bool,
    skin: PropTypes.string
  }

  static defaultProps = {
    radius: 8,
    stroke: 2,
    progress: 0,
    shadow: false,
    bordered: false,
    skin: Ring.SKIN_DEFAULT_025
  }

  render() {
    return (
      <div
        ref={this.ref}
        style={this.props.style}
        className={classNames(css['ring'], {
          [css['ring_skin--default-025']]: this.props.skin === Ring.SKIN_DEFAULT_025,
          [css['ring--bordered']]: this.props.bordered === true,
          [this.props.className]: !!this.props.className
        })}
      >
        <svg
          className={css['ring_svg']}
          height={this.props.radius * 2}
          width={this.props.radius * 2}
        >
          <circle
            className={css['ring_circle']}
            strokeWidth={this.props.stroke}
            strokeDasharray={ this.circumference + ' ' + this.circumference }
            style={{ strokeDashoffset: this.circumference - this.props.progress / 100 * this.circumference }}
            r={this.normalizedRadius}
            cx={this.props.radius}
            cy={this.props.radius}
          />
        </svg>

        {this.props.children &&
          <div
            className={classNames(css['ring_content'], {
              [css['ring_content--shadow']]: this.props.shadow === true
            })}
          >
            {this.props.children}
          </div>
        }
      </div>
    )
  }
}
