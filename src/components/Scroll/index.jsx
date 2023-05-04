import React from 'react'
import css from './Scroll.pcss'
import SimpleBar from 'simplebar'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { SCROLL_Y } from './helper'

export default class Scroll extends React.Component {
  constructor(props) {
    super(props)

    this.func = []
    this.scroll = null
    this.ref = React.createRef()
  }

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    classNameContent: PropTypes.string,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    onWheel: PropTypes.func,
    onScrollY: PropTypes.func,
    onScrollX: PropTypes.func,
    onResize: PropTypes.func,
    disableX: PropTypes.bool,
    disableY: PropTypes.bool,
    hideTrackX: PropTypes.bool,
    hideTrackY: PropTypes.bool,
  }

  static defaultProps = {
    disabled: false,
    disableX: false,
    disableY: false,
    hideTrackX: false,
    hideTrackY: false,
  }

  componentDidMount() {
    this.scroll = new SimpleBar(this.ref.current, {
      forceVisible: false,
      autoHide: true,
      timeout: 800,
      classNames: {
        contentEl: css['scroll_content'],
        contentWrapper: css['scroll_content-wrapper'],
        offset: css['scroll_offset'],
        mask: css['scroll_mask'],
        wrapper: css['scroll_wrapper'],
        placeholder: css['scroll_placeholder'],
        scrollbar: css['scroll_scrollbar'],
        track: css['scroll_track'],
        heightAutoObserverWrapperEl: css['scroll_observer-wrapper'],
        heightAutoObserverEl: css['scroll_auto-observer'],
        visible: css['scroll_visible'],
        horizontal: this.props.hideTrackX ? css['scroll_track--hidden'] : css['scroll_horizontal'],
        vertical:  this.props.hideTrackY ? css['scroll_track--hidden'] : css['scroll_vertical'],
        hover: css['scroll_hover'],
        dragging: css['scroll_dragging']
      },
    })

    this.func.push(() => {
      this.scroll.unMount()
      this.scroll = null
    })

    const wrapper = this.scroll.getScrollElement()
    const content = this.scroll.getContentElement()

    if (this.props.onResize) {
      this.resizeObserver = new ResizeObserver((entries) => {
        this.props.onResize({
          wrapper,
          content,
          wrapperRect: entries[0].contentRect,
          contentRect: content.getBoundingClientRect(),
        })
      })

      this.resizeObserver.observe(wrapper)
      this.func.push(() => this.resizeObserver.unobserve(wrapper))
    }

    if (this.props.onScrollY || this.props.onScrollX) {
      const func = (event) => {
        if (this.props.onScrollY) {
          this.props.onScrollY(event, {
            wrapper,
            content,
            wrapperRect: wrapper.getBoundingClientRect(),
            contentRect: content.getBoundingClientRect(),
          })
        }
      }
      wrapper.addEventListener('scroll', func)
      this.func.push(() => wrapper.removeEventListener('scroll', func))
    }

    wrapper.classList.add(SCROLL_Y)

    if (this.props.classNameContent) {
      const content = this.scroll.getContentElement()
      this.props.classNameContent.split(/\s/).forEach((className) => {
        content.classList.add(className)
      })
    }

    const timeoutId = setTimeout(() => this.scroll.recalculate(), 500)
    this.func.push(() => clearTimeout(timeoutId))
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.disabled !== prevProps.disabled ||
      this.props.disableY !== prevProps.disableY ||
      this.props.disableX !== prevProps.disableX
    ) {
      this.scroll.recalculate()
    }
  }

  componentWillUnmount() {
    for (let func of this.func) {
      func()
    }
  }

  render() {
    const style = {}
    if (this.props.disabled || this.props.disableY) {
      style.overflowY = 'hidden'
    }

    if (this.props.disabled || this.props.disableX) {
      style.overflowX = 'hidden'
    }

    return (
      <div
        ref={this.ref}
        onWheel={this.props.onWheel}
        style={{ ...this.props.style, ...style }}
        className={classNames(css['scroll'], {
          [this.props.className]: Boolean(this.props.className)
        })}
      >
        {this.props.children}
      </div>
    )
  }
}
