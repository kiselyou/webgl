import React from 'react'
import css from './style.pcss'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Text from '@components/Text'

export default class Label extends React.Component {

  static DIRECTION_COL = 'col'
  static DIRECTION_COL_REVERSE = 'col-reverse'
  static DIRECTION_ROW = 'row'
  static DIRECTION_ROW_REVERSE = 'row-reverse'

  static ALIGN_END = 'end'
  static ALIGN_START = 'start'
  static ALIGN_CENTER = 'center'

  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.node,
    className: PropTypes.string,
    direction: PropTypes.oneOf(['col', 'col-reverse', 'row', 'row-reverse']),
    label: PropTypes.node.isRequired,
    labelSize: PropTypes.number,
    labelHeight: PropTypes.number,
    labelWeight: PropTypes.number,
    labelAlignY: PropTypes.oneOf(['end', 'start', 'center']),
    labelAlignX: PropTypes.oneOf(['end', 'start', 'center']),
    gap: PropTypes.number,
    stretchRow: PropTypes.bool
  }

  static defaultProps = {
    gap: 8,
    labelSize: 14,
    labelHeight: 14,
    labelWeight: 500,
    stretchRow: false,
    direction: Label.DIRECTION_ROW
  }

  render() {
    return (
      <Text
        display={Text.DISPLAY_FLEX}
        style={{ ...this.props.style, gridGap: `${this.props.gap}px` }}
        className={classNames(css['label'], {
          [this.props.className]: !!this.props.className,
          [css['label_align-y--end']]: this.props.labelAlignY === Label.ALIGN_END,
          [css['label_align-y--start']]: this.props.labelAlignY === Label.ALIGN_START,
          [css['label_align-y--center']]: this.props.labelAlignY === Label.ALIGN_CENTER,
          [css['label_align-x--between']]: [Label.DIRECTION_ROW, Label.DIRECTION_ROW_REVERSE].includes(this.props.direction) && this.props.stretchRow,
          [css['label_direction--row']]: this.props.direction === Label.DIRECTION_ROW,
          [css['label_direction--row-reverse']]: this.props.direction === Label.DIRECTION_ROW_REVERSE,
          [css['label_direction--col']]: this.props.direction === Label.DIRECTION_COL,
          [css['label_direction--col-reverse']]: this.props.direction === Label.DIRECTION_COL_REVERSE,
        })}
      >
        <Text
          size={this.props.labelSize}
          height={this.props.labelHeight}
          weight={this.props.labelWeight}
          skin={Text.SKIN_DEFAULT_075}
          className={classNames('', {
            [css['label_align-x--end']]: this.props.labelAlignX === Label.ALIGN_END,
            [css['label_align-x--start']]: this.props.labelAlignX === Label.ALIGN_START,
            [css['label_align-x--center']]: this.props.labelAlignX === Label.ALIGN_CENTER,
          })}
        >
          {this.props.label}
        </Text>

        {this.props.children &&
          <Text
            style={{ flex: 'initial' }}
            alignY={Text.ALIGN_CENTER}
          >
            {this.props.children}
          </Text>
        }
      </Text>
    )
  }
}
