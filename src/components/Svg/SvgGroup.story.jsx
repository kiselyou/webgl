import React from 'react'
import SvgGroup from './SvgGroup'
import ThemeGuide from '@components/Theme/ThemeGuide'

import nodes from '@components/Svg/nodes'
import nodesPainted from '@components/Svg/nodes-painted'
import nodesWeatherDay from '@components/Svg/nodes-weather-day'
import nodesWeatherNight from '@components/Svg/nodes-weather-night'

export default {
  title: 'General/SvgGroup',
  component: SvgGroup,
  parameters: {
    layout: 'centered',
  },
}

const Template = (args) => {
  return (
    <ThemeGuide theme="dark">
      <SvgGroup {...args} />
    </ThemeGuide>
  )
}

export const SvgLogo = Template.bind({})
SvgLogo.args = {
  icons: ['specific/logo-full-white'],
}

const style = {
  fill: 'rgba(255, 255, 255, 1)',
  width: '24px',
  height: '24px',
  margin: '8px'
}

export const SvgSpecific = Template.bind({})
SvgSpecific.args = {
  style,
  icons: [
    'specific/info-small', 'specific/king-square', 'specific/logo-square', 'specific/arrow-down',
    'specific/arrow-left', 'specific/arrow-right', 'specific/arrow-up', 'specific/arrow-down-small',
    'specific/arrow-up-small', 'specific/king', 'specific/pinned', 'specific/outbound-link',
    'specific/freedom'
  ],
}

export const SvgPainted = Template.bind({})
SvgPainted.args = {
  style,
  icons: formatIconNames('painted/', nodesPainted),
}

export const SvgComponent = Template.bind({})
SvgComponent.args = {
  style,
  icons: formatIconNames('', nodes),
}

export const SvgWeatherDay = Template.bind({})
SvgWeatherDay.args = {
  style,
  icons: formatIconNames('weather/day/', nodesWeatherDay),
}

export const SvgWeatherNight = Template.bind({})
SvgWeatherNight.args = {
  style,
  icons: formatIconNames('weather/night/', nodesWeatherNight),
}

function formatIconNames(prefix, icons) {
  return Object.keys(icons).map((name) => {
    return prefix + name.split(/(?=[A-Z])/).join('-').toLowerCase()
  })
}
