import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Page from '@pages/Page'

export default class PageRoot extends React.Component {
  constructor(props) {
    super(props)

  }

  static propTypes = {

  }

  render() {
    return (
      <Page
        onMounted={() => {
          console.log('main page')
        }}
      >
        <div>
          Main page
        </div>
      </Page>
    )
  }


}
