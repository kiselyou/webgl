import React from 'react'
import css from './style.pcss'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Svg from '@components/Svg/Svg'

export default class Control extends React.Component {
  constructor(props) {
    super(props);
  }

  static SKIN_DEFAULT = 'default'

  static propTypes = {
    skin: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    iconName: PropTypes.string.isRequired,
    iconClassName: PropTypes.string,
    onClick: PropTypes.func,
    border: PropTypes.bool,
    circle: PropTypes.bool,
    hover: PropTypes.bool,
    size: PropTypes.number
  }

  static defaultProps = {
    size: 32,
    border: false,
    circle: false,
    skin: Control.SKIN_DEFAULT,
  }

  render() {
    return (
      <div
        style={this.props.style}
        onClick={this.props.onClick}
        className={classNames(css['control'], {
          [this.props.className]: Boolean(this.props.className),
          [css['control_hover']]: this.props.hover,
          [css['control_border']]: this.props.border,
          [css['control_circle']]: this.props.circle,
          [css['control_size--32']]: this.props.size === 32,
          [css['control_skin--default']]: this.props.skin === Control.SKIN_DEFAULT,
        })}
      >
        <Svg
          name={this.props.iconName}
          className={classNames(css['control_icon'], {
            [this.props.iconClassName]: Boolean(this.props.iconClassName)
          })}
        />
      </div>
    )
  }
}
