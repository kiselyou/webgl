import css from './SvgGroup.pcss'
import React from 'react'
import PropTypes from 'prop-types'
import Svg from './Svg'

export default class SvgGroup extends React.Component {
  static propTypes = {
    icons: PropTypes.array,
    style: PropTypes.object,
  }

  render() {
    return (
      <div className={css['group']}>
        {this.props.icons.map((name, index) => {
          return (
            <Svg
              key={index}
              name={name}
              style={this.props.style}
            />
          )
        })}
      </div>
    )
  }
}
