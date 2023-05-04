import css from './Theme.pcss'
import React from 'react'
import PropTypes from 'prop-types'
import { THEME_DARK, THEME_LIGHT } from '@lib/theme'

export default class Theme extends React.Component {


  static propTypes = {
    theme: PropTypes.string,
  }

  componentDidMount() {
    this.ensureSkinClassNames()
  }

  componentDidUpdate() {
    this.ensureSkinClassNames()
  }

  ensureSkinClassNames() {
    const container = document.body
    if (!container.classList.contains(css['theme'])) {
      container.classList.add(css['theme'])
      container.classList.add(css['theme_init'])
    }

    const themes = [THEME_DARK, THEME_LIGHT]
    for (let theme of themes) {
      if (theme === this.props.theme) {
        if (!container.classList.contains(css[`theme--${this.props.theme}`]) && this.props.theme === theme) {
          container.classList.add(css[`theme--${this.props.theme}`])
        }
        continue
      }

      container.classList.remove(css[`theme--${theme}`])
    }
  }

  render() {
    return this.props.children
  }
}
