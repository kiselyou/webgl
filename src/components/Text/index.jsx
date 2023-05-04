import css from './Text.pcss'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class Text extends React.Component {
  static SKIN_HEX_01 = 'hex-01'
  static SKIN_HEX_02 = 'hex-02'
  static SKIN_HEX_03 = 'hex-03'
  static SKIN_HEX_04 = 'hex-04'
  static SKIN_HEX_05 = 'hex-05'
  static SKIN_HEX_06 = 'hex-06'

  static SKIN_BASE_100 = 'base-100'
  static SKIN_BASE_075 = 'base-075'
  static SKIN_BASE_050 = 'base-050'
  static SKIN_BASE_025 = 'base-025'

  static SKIN_BLUE_100 = 'blue-100'
  static SKIN_BLUE_075 = 'blue-075'
  static SKIN_BLUE_050 = 'blue-050'
  static SKIN_BLUE_025 = 'blue-025'

  static SKIN_WHITE_100 = 'white-100'
  static SKIN_WHITE_075 = 'white-075'
  static SKIN_WHITE_050 = 'white-050'
  static SKIN_WHITE_025 = 'white-025'

  static SKIN_DEFAULT_100 = 'default-100'
  static SKIN_DEFAULT_075 = 'default-075'
  static SKIN_DEFAULT_050 = 'default-050'
  static SKIN_DEFAULT_025 = 'default-025'

  static ALIGN_START = 'start'
  static ALIGN_CENTER = 'center'
  static ALIGN_END = 'end'

  static FONT_DEFAULT = 'default'
  static FONT_TITLE = 'title'

  static DISPLAY_INLINE = 'inline'
  static DISPLAY_FLEX = 'flex'

  static propTypes = {
    tag: PropTypes.string,
    className: PropTypes.string,
    skin: PropTypes.oneOf([
      'hex-01', 'hex-02', 'hex-03', 'hex-04', 'hex-05', 'hex-06',
      'default-100', 'default-075', 'default-050', 'default-025',
      'white-100', 'white-075', 'white-050', 'white-025',
      'base-100', 'base-075', 'base-050', 'base-025',
      'blue-100', 'blue-075', 'blue-050', 'blue-025',
    ]),
    alignX: PropTypes.oneOf(['start', 'center', 'end']),
    alignY: PropTypes.oneOf(['start', 'center', 'end']),
    display: PropTypes.oneOf(['inline', 'flex']),
    font: PropTypes.oneOf(['default', 'title']),
    style: PropTypes.object,
    children: PropTypes.node,
    onClick: PropTypes.func,
    /** 8 min value, 48 max value, step 2 */
    size: PropTypes.number,
    /** 8 min value, 48 max value, step 1 */
    height: PropTypes.number,
    /** 100 min value, 900 max value, step 100 */
    weight: PropTypes.number,
    uppercase: PropTypes.bool,
    lowercase: PropTypes.bool,
    through: PropTypes.bool,
    line: PropTypes.bool,
    attr: PropTypes.object
  }

  static defaultProps = {
    font: Text.FONT_DEFAULT,
    tag: 'div'
  }

  render() {
    const htmlClass = {}
    if (this.props.size && (this.props.size % 2) === 0) {
      htmlClass[css[`text_size--${this.props.size}`]] = true
    }
    if (this.props.height) {
      htmlClass[css[`text_height--${this.props.height}`]] = true
    }
    if (this.props.weight) {
      htmlClass[css[`text_weight--${this.props.weight}`]] = true
    }

    const TextTag = this.props.tag

    return (
      <TextTag
        {...this.props.attr}
        style={this.props.style}
        onClick={this.props.onClick}
        className={classNames(css['text'], {
          [this.props.className]: Boolean(this.props.className),
          [css['text_skin--hex-01']]: this.props.skin === Text.SKIN_HEX_01,
          [css['text_skin--hex-02']]: this.props.skin === Text.SKIN_HEX_02,
          [css['text_skin--hex-03']]: this.props.skin === Text.SKIN_HEX_03,
          [css['text_skin--hex-04']]: this.props.skin === Text.SKIN_HEX_04,
          [css['text_skin--hex-05']]: this.props.skin === Text.SKIN_HEX_05,
          [css['text_skin--hex-06']]: this.props.skin === Text.SKIN_HEX_06,
          [css['text_skin--base-025']]: this.props.skin === Text.SKIN_BASE_025,
          [css['text_skin--base-050']]: this.props.skin === Text.SKIN_BASE_050,
          [css['text_skin--base-075']]: this.props.skin === Text.SKIN_BASE_075,
          [css['text_skin--base-100']]: this.props.skin === Text.SKIN_BASE_100,
          [css['text_skin--blue-025']]: this.props.skin === Text.SKIN_BLUE_025,
          [css['text_skin--blue-050']]: this.props.skin === Text.SKIN_BLUE_050,
          [css['text_skin--blue-075']]: this.props.skin === Text.SKIN_BLUE_075,
          [css['text_skin--blue-100']]: this.props.skin === Text.SKIN_BLUE_100,
          [css['text_skin--white-025']]: this.props.skin === Text.SKIN_WHITE_025,
          [css['text_skin--white-050']]: this.props.skin === Text.SKIN_WHITE_050,
          [css['text_skin--white-075']]: this.props.skin === Text.SKIN_WHITE_075,
          [css['text_skin--white-100']]: this.props.skin === Text.SKIN_WHITE_100,
          [css['text_skin--default-025']]: this.props.skin === Text.SKIN_DEFAULT_025,
          [css['text_skin--default-050']]: this.props.skin === Text.SKIN_DEFAULT_050,
          [css['text_skin--default-075']]: this.props.skin === Text.SKIN_DEFAULT_075,
          [css['text_skin--default-100']]: this.props.skin === Text.SKIN_DEFAULT_100,
          [css['text_align--x-start']]: this.props.alignX === Text.ALIGN_START,
          [css['text_align--x-center']]: this.props.alignX === Text.ALIGN_CENTER,
          [css['text_align--x-end']]: this.props.alignX === Text.ALIGN_END,
          [css['text_align--y-start']]: this.props.alignY === Text.ALIGN_START,
          [css['text_align--y-center']]: this.props.alignY === Text.ALIGN_CENTER,
          [css['text_align--y-end']]: this.props.alignY === Text.ALIGN_END,
          [css['text_font--title']]: this.props.font === Text.FONT_TITLE,
          [css['text_font--text']]: this.props.font === Text.FONT_DEFAULT,
          [css['text_display--flex']]: this.props.display === Text.DISPLAY_FLEX,
          [css['text_display--inline']]: this.props.display === Text.DISPLAY_INLINE,
          [css['text_transform--uppercase']]: this.props.uppercase === true,
          [css['text_transform--lowercase']]: this.props.lowercase === true,
          [css['text_through']]: this.props.through === true,
          [css['text_line']]: this.props.line === true,
          ...htmlClass
        })}
      >
        {this.props.children}
      </TextTag>
    )
  }
}

