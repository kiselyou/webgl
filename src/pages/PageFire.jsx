import React from 'react'
import * as THREE from 'three'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Page from '@pages/Page'
import Label from '@components/Label'
import Fire from '@pages/shaders/Fire'
import Playground from '@pages/game/Playground'
import FieldRange from '@components/fields/FieldRange'

export default class PageFire extends React.Component {
  constructor(props) {
    super(props)

    this.playground = new Playground()

    this.fire = new Fire()
    this.playground.scene.add(this.fire)

    const { uniforms } = this.fire.material

    this.state = {
      uniformsFloat: {
        uPoints: { value: uniforms.uPoints.value, min: 1, max: 100, step: 1 },
        uRadius: { value: uniforms.uRadius.value, min: 0.01, max: 10, step: 0.01 },
        uGlow: { value: uniforms.uGlow.value, min: 0.01, max: 10, step: .01 },
        uSpeed: { value: uniforms.uSpeed.value, min: -10, max: 10, step: .1 },
        uDetails: { value: uniforms.uDetails.value, min: -3, max: 3, step: 0.01 },
        uForce: { value: uniforms.uForce.value, min: -3, max: 3, step: 0.01 },
        uShift: { value: uniforms.uShift.value, min: -3, max: 3, step: 0.01 },
        uScale: { value: uniforms.uScale.value, min: -20, max: 20, step: 0.1 },
        uTime: { value: uniforms.uTime.value, min: 0, max: 30, step: 0.1 },
      },
      uSize: { x: uniforms.uSize.value.x, y: uniforms.uSize.value.y },
    }
  }

  static propTypes = {

  }

  componentWillUnmount() {
    this.playground.destroy()
  }

  render() {
    return (
      <Page
        onMounted={(css, element) => {
          this.playground
            .resize()
            .enableGridHelper(true)
            .appendWebGLElementTo(element, css['page'])
            .animate((time) => {
              this.fire.update(this.playground.camera)
            })

          window.addEventListener('resize', () => {
            this.playground.resize()
          })
        }}
      >
        <div style={{ pointerEvents: 'all', width: '328px', border: 'solid 1px #ccc' }}>
          {Object.keys(this.state.uniformsFloat).map((prop, index) => {
            const data = this.state.uniformsFloat[prop]
            return (
              <Label
                key={index}
                label={<div style={{ marginBottom: '4px' }}>{prop}</div>}
                labelAlignY={Label.ALIGN_END}
                stretchRow={true}
              >
                <FieldRange
                  min={data.min}
                  max={data.max}
                  step={data.step}
                  value={data.value}
                  onChange={(e) => {
                    const uniformsFloat = {
                      ...this.state.uniformsFloat,
                      [prop]: { ...data, value: Number(e.target.value) }
                    }
                    this.setState({ uniformsFloat }, () => {
                      this.fire.material.uniforms[prop].value = data.value
                    })
                  }}
                />
              </Label>
            )
          })}

          <Label
            label={<div style={{ marginBottom: '4px' }}>Size X</div>}
            labelAlignY={Label.ALIGN_END}
            stretchRow={true}
          >
            <FieldRange
              min={0}
              max={600}
              step={1}
              value={this.state.uSize.x}
              onChange={(e) => {
                this.setState({ uSize: { ...this.state.uSize, x: Number(e.target.value) } }, () => {
                  this.fire.material.uniforms.uSize.value.x = this.state.uSize.x
                })
              }}
            />
          </Label>

          <Label
            label={<div style={{ marginBottom: '4px' }}>Size Y</div>}
            labelAlignY={Label.ALIGN_END}
            stretchRow={true}
          >
            <FieldRange
              min={10}
              max={400}
              step={1}
              value={this.state.uSize.y}
              onChange={(e) => {
                this.setState({ uSize: { ...this.state.uSize, y: Number(e.target.value) } }, () => {
                  this.fire.material.uniforms.uSize.value.y = this.state.uSize.y
                })
              }}
            />
          </Label>
        </div>
      </Page>
    )
  }


}
