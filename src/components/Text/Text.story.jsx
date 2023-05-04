import React from 'react'
import Text from './index'
import Theme from '@components/Theme/ThemeGuideWrap'

export default {
  title: 'General/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: { control: 'text' },
    tag: { control: 'select', options: ['div', 'button', 'form', 'ul', 'li', 'ol', 'a'] },
  }
}

const skins = [
  Text.SKIN_HEX_01,       Text.SKIN_HEX_02,       Text.SKIN_HEX_03,       Text.SKIN_HEX_04,
  Text.SKIN_HEX_05,       Text.SKIN_HEX_06,

  Text.SKIN_DEFAULT_100,  Text.SKIN_DEFAULT_075,  Text.SKIN_DEFAULT_050,  Text.SKIN_DEFAULT_025,
  Text.SKIN_BLUE_100,     Text.SKIN_BLUE_075,     Text.SKIN_BLUE_050,     Text.SKIN_BLUE_025,
  Text.SKIN_WHITE_100,    Text.SKIN_WHITE_075,    Text.SKIN_WHITE_050,    Text.SKIN_WHITE_025,
  Text.SKIN_BASE_100,     Text.SKIN_BASE_075,     Text.SKIN_BASE_050,     Text.SKIN_BASE_025,
]

const Template = (args) => {
  return (
    <Theme style={{ backgroundColor: 'var(--color-default-005)' }}>
      {skins.map((skin, index) => {
        return (<Text key={index} skin={skin} {...args} >{skin}</Text>)
      })}
    </Theme>
  )
}

export const Default = Template.bind({})
Default.args = {}
