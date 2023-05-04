import React from 'react'
import Svg from './Svg'
import Theme from '@components/Theme/Theme'

export default {
  title: 'General/Svg',
  component: Svg,
  parameters: {
    layout: 'centered',
  },
}

const Template = (args) => {
  return (
    <Theme>
      <Svg {...args} />
    </Theme>
  )
}

export const SvgDefault = Template.bind({})
SvgDefault.args = {
  name: 'close',
}
