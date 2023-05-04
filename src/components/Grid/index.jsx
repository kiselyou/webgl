import React from 'react'
import css from './style.pcss'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class Grid extends React.Component {

  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.node,
    className: PropTypes.string,
    columns: PropTypes.number,
    gapX: PropTypes.number,
    gapY: PropTypes.number,
  }

  static defaultProps = {
    gapX: 8,
    gapY: 8,
    columns: 1,
  }

  render() {
    return (
      <div
        style={{
          ...this.props.style,
          '--columns': `${this.props.columns}`,
          gridGap: `${this.props.gapY}px ${this.props.gapX}px`,
      }}
        className={classNames(css['grid'], {
          [this.props.className]: !!this.props.className,
        })}
      >
        {this.props.children}
      </div>
    )
  }
}
