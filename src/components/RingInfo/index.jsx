import React from 'react'
import css from './style.pcss'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Ring from '@components/Ring'
import Text from '@components/Text'

export default class RingInfo extends React.Component {

  constructor(props) {
    super(props)
  }

  static propTypes = {
    radius: PropTypes.number,
    stroke: PropTypes.number,
    progress: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string,
    bordered: PropTypes.bool,
    shadow: PropTypes.bool,
    nodeL: PropTypes.node,
    nodeR: PropTypes.node,
    gap: PropTypes.number
  }

  static defaultProps = {
    shadow: true,
    bordered: true,
    radius: 40,
    stroke: 4,
    gap: 16
  }

  render() {
    return (
      <div
        style={{
          ...this.props.style,
          gridGap: `${this.props.gap}px`
        }}
        className={classNames(css['info'], {
          [this.props.className]: !!this.props.className
        })}
      >
        {this.props.nodeL &&
          <Text
            size={12}
            alignX={Text.ALIGN_START}
            className={css['info_options']}
          >
            {this.props.nodeL}
          </Text>
        }

        <div className={css['info_content']}>
          <Ring
            radius={this.props.radius}
            stroke={this.props.stroke}
            shadow={this.props.shadow}
            bordered={this.props.bordered}
            progress={this.props.progress}
          >
            <Text
              size={24}
              height={24}
              alignX={Text.ALIGN_CENTER}
              display={Text.DISPLAY_FLEX}
            >
              {this.props.progress}
            </Text>
          </Ring>
        </div>

        {this.props.nodeR &&
          <Text
            size={12}
            alignX={Text.ALIGN_END}
            className={css['info_options']}
          >
            {this.props.nodeR}
          </Text>
        }
      </div>
    )
  }
}
