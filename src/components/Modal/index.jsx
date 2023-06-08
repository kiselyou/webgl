import css from './style.pcss'
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Text from '@components/Text'

export default class Modal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  static ALIGN_XL = 'xl'
  static ALIGN_XR = 'xr'
  static ALIGN_XC = 'xc'

  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    titleAlign: PropTypes.string,
    controls: PropTypes.node,
    width: PropTypes.number,
    height: PropTypes.number,
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    onContextMenu: PropTypes.func
  }

  static defaultProps = {
    width: 680,
    height: 428,
    position: { x: null, y: null },
    titleAlign: Modal.ALIGN_XL
  }

  render() {
    const x = this.props.position.x === null ? (window.innerWidth - this.props.width) / 2 : this.props.position.x
    const y = this.props.position.y === null ? (window.innerHeight - this.props.height) / 2 : this.props.position.y
    return (
      <div
        onContextMenu={this.props.onContextMenu}
        className={classNames(css['modal'], {
          [this.props.className]: !!this.props.className
        })}
        style={{
          top: `${y}px`,
          left: `${x}px`,
          width: `${this.props.width}px`,
          maxHeight: `${this.props.height}px`,
          ...this.props.style
        }}
      >
        <div
          className={css['modal_head']}
        >
          <Text
            size={14}
            height={16}
            weight={600}
            uppercase={true}
            font={Text.FONT_TITLE}
            skin={Text.SKIN_DEFAULT_050}
            style={{ width: '100%' }}
          >
            <div
              className={classNames(css['modal_title'], {
                [css['modal_title--xl']]: this.props.titleAlign === Modal.ALIGN_XL,
                [css['modal_title--xr']]: this.props.titleAlign === Modal.ALIGN_XR,
                [css['modal_title--xc']]: this.props.titleAlign === Modal.ALIGN_XC,
              })}
            >
              {this.props.title}
            </div>
          </Text>
          <div
            className={css['modal_controls']}
          >
            {this.props.controls}
          </div>
        </div>
        <div className={css['modal_body']}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
