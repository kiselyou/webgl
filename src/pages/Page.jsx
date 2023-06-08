import css from './page.pcss'
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class Page extends React.Component {
  constructor(props) {
    super(props)

    this.ref = React.createRef()
  }

  static propTypes = {
    onMounted: PropTypes.func,
    children: PropTypes.node
  }

  componentDidMount() {
    if (this.props.onMounted) {
      this.props.onMounted(css, this.ref.current)
    }
  }

  render() {
    return (
      <div
        className={classNames(css['page'], {
          [css['page_container']]: true
        })}
      >
        <div
          ref={this.ref}
          className={css['page_container']}
        />

        {this.props.children &&
          <div className={css['page_app']}>
            {this.props.children}
          </div>
        }
      </div>
    )
  }


}
