import css from './Canvas.pcss'
import React from 'react'
import classNames from 'classnames'
import Factory from '@pages/base/Factory'
import Playground from '@pages/game/Playground'
import { sector, pointLight } from '@pages/game/sector-1'
import { timeFormat } from '@lib/time'

import Ring from '@components/Ring'
import Text from '@components/Text'
import Scroll from '@components/Scroll'
import Grid from '@components/Grid'
import Range from '@components/Range'
import Label from '@components/Label'
import Control from '@components/Control'
import Divider from '@components/Divider'
import RingInfo from '@components/RingInfo'
import ModalWindow from '@pages/game/ModalWindow'

export default class Canvas extends React.Component {
  constructor(props) {
    super(props)

    this.ref = React.createRef()
    this.playground = new Playground()

    this.state = {
      uuid: null,
      factory: null,
      loaded: false
    }
  }

  componentDidMount() {
    this.playground.appendWebGLElementTo(this.ref.current, css['canvas'])
    this.playground.appendLabelElementTo(this.ref.current, css['canvas_app'])

    const light1 = pointLight()
    light1.color.setHSL(0.08, 0.5, 0.5)
    light1.position.set(-185, 10, -900)
    this.playground.scene.add(light1)

    sector.render().then(() => {
      this.playground.scene.add(sector.object3D)
      for (let obj of sector.objects3D) {
        this.playground.scene.add(obj)
      }
      this.setState({ loaded: true })
    })

    this.playground.animate((time) => {
      sector.update(time)
      if (sector.object3D) {
        sector.object3D.position.copy(this.playground.controls.target)
      }
    })

    window.addEventListener('resize', () => {
      this.playground.resize()
    })

    document.addEventListener('mousemove', (event) => {
      this.playground.mouseMove(event)
    })

    document.addEventListener('click', (event) => {
      if (event.target !== this.ref.current.querySelector(`.${css['canvas']}`)) {
        return
      }
      this.playground.mouseMove(event)
      const intersects = this.playground.intersections(sector.objects3D)
      if (intersects.length > 0) {
        const obj = intersects[0]['object']
        if (this.state.uuid !== obj['uuid']) {
          this.setState({
            uuid: obj['uuid'],
            factory: sector.findEntityByObject3D(obj)
          })
        }
      } else if (this.state.uuid) {
        this.setState({ uuid: null, factory: null })
      }
    })

    for (let entity of sector.children) {
      if (entity['isFactory']) {
        entity
          .addEventListener(Factory.EVENT_BUILD_START, (entity) => {
            if (entity.object3D && entity.object3D.uuid === this.state.uuid) {
              this.setState({ factory: entity })
            }
          })
          .addEventListener(Factory.EVENT_BUILD_PROCESS, (entity) => {
            if (entity.object3D && entity.object3D.uuid === this.state.uuid) {
              this.setState({ factory: entity })
            }
          })
          .addEventListener(Factory.EVENT_BUILD_FINISH, (entity) => {
            if (entity.object3D && entity.object3D.uuid === this.state.uuid) {
              this.setState({ factory: entity })
            }
          })
      }
    }
  }

  render() {
    return (
      <div
        className={classNames(css['canvas'], {
          [css['canvas_container']]: true
        })}
      >
        <div
          ref={this.ref}
          className={css['canvas_container']}
        />

        <div
          className={classNames(css['canvas_app'], {
            [css['canvas_container']]: true
          })}
        >
          {!this.state.loaded &&
            <div>Loading</div>
          }

          {this.state.uuid && this.state.factory &&
            <ModalWindow
              height={628}
              onContextMenu={(e) => e.preventDefault()}
              title="Factory info"
              style={{ pointerEvents: 'all', zIndex: 10000 }}
              controls={
                <React.Fragment>
                  <Control iconName="close" />
                </React.Fragment>
              }
            >
              <Label
                gap={16}
                style={{ padding: '16px' }}
                label={this.state.factory.name}
                direction={Label.DIRECTION_COL}
                labelAlignX={Label.ALIGN_CENTER}
              >
                <Grid
                  gapX={24}
                  columns={2}
                >
                  <RingInfo
                    gap={24}
                    progress={this.state.factory.timer.percent}
                    nodeL={(
                      <React.Fragment>
                        <Label labelSize={12} labelHeight={18} stretchRow={true} style={{ borderBottom: 'solid 1px var(--color-default-005)' }} label="Total volume">{this.state.factory.product.volume}</Label>
                        <Label labelSize={12} labelHeight={18} stretchRow={true} style={{ borderBottom: 'solid 1px var(--color-default-005)' }} label="Unit volume">{this.state.factory.product.unitBox.unit.volume}</Label>
                        <Label labelSize={12} labelHeight={18} stretchRow={true} style={{ borderBottom: 'solid 1px var(--color-default-005)' }} label="Limit min">{this.state.factory.product.volumeLimitMin} - {this.state.factory.product.limitMin}%</Label>
                        <Label labelSize={12} labelHeight={18} stretchRow={true} style={{ borderBottom: 'solid 1px var(--color-default-005)' }} label="Limit max">{this.state.factory.product.volumeLimitMax} - {this.state.factory.product.limitMax}%</Label>
                      </React.Fragment>
                    )}
                  />

                  <RingInfo
                    gap={24}
                    progress={this.state.factory.timer.percent}
                    nodeR={(
                      <React.Fragment>
                        <Label labelSize={12} labelHeight={18} stretchRow={true} style={{ borderBottom: 'solid 1px var(--color-default-005)' }} label="Status">{this.state.factory.status}</Label>
                        <Label labelSize={12} labelHeight={18} stretchRow={true} style={{ borderBottom: 'solid 1px var(--color-default-005)' }} label="Building time">{timeFormat(this.state.factory.timer.time)}</Label>
                        <Label labelSize={12} labelHeight={18} stretchRow={true} style={{ borderBottom: 'solid 1px var(--color-default-005)' }} label="Building count">{this.state.factory.product.quantity}</Label>
                        <Label labelSize={12} labelHeight={18} stretchRow={true} style={{ borderBottom: 'solid 1px var(--color-default-005)' }} label="Info">-</Label>
                      </React.Fragment>
                    )}
                  />
                </Grid>
              </Label>

              <Divider />

              <Scroll style={{ maxHeight: '180px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
                  <Label
                    label="Product"
                    direction={Label.DIRECTION_COL}
                  >
                    {this.renderStock(this.state.factory.product)}
                  </Label>

                  <Divider style={{ margin: '16px 0' }} />

                  <Label
                    label="Resources"
                    direction={Label.DIRECTION_COL}
                  >
                    <Grid gapY={16}>
                      {this.state.factory.resources.map((stock, index) => {
                        return (
                          <React.Fragment key={index}>
                            {this.renderStock(stock)}
                          </React.Fragment>
                        )
                      })}
                    </Grid>
                  </Label>
                </div>
              </Scroll>
            </ModalWindow>
          }
        </div>
      </div>
    )
  }

  renderStock(stock) {
    return (
      <Label
        labelSize={12}
        labelHeight={12}
        labelWeight={400}
        stretchRow={true}
        label={stock.name}
        labelAlignY={Label.ALIGN_CENTER}
        direction={Label.DIRECTION_ROW}
      >
        <Grid columns={2}>
          <Range
            min={stock.priceMin}
            max={stock.priceMax}
            value={stock.price}
            percent={stock.pricePercent}
            style={{ width: '240px' }}
          />

          <Range
            min={stock.count}
            max={stock.countMax}
            percent={stock.countPercent}
            style={{ width: '240px' }}
          />
        </Grid>
      </Label>
    )
  }
}
