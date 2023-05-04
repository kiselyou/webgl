import React from 'react'
import css from './style.pcss'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class Divider extends React.Component {

  static SKIN_DEFAULT_025 = 'default-025'

  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.node,
    className: PropTypes.string,
    vertical: PropTypes.bool,
    skin: PropTypes.string
  }

  static defaultProps = {
    vertical: false,
    skin: Divider.SKIN_DEFAULT_025
  }

  render() {
    return (
      <div
        style={{ ...this.props.style }}
        className={classNames(css['divider'], {
          [this.props.className]: !!this.props.className,
        })}
      >
        <div className={classNames('', {
          [css['divider--v']]: this.props.vertical === true,
          [css['divider--h']]: this.props.vertical === false,
          [css['divider_skin--default-010']]: this.props.skin === Divider.SKIN_DEFAULT_025,
        })} />
      </div>
    )
  }
}
