import { Fragment } from 'react'
import { Block, Project, Scene, Statement, SpriteObject, Picture } from 'entry-jsx'
import { ComputeMatrix, InitData, Matrices } from './matrix'
import { DevTimerBranch, DutscriptBranch } from './branch'
import { Variables } from './variable'
import { Render } from './render'

const MainCode = ({ test }: { test?: boolean }) => <>
  <InitData keepZ={test} />
  <ComputeMatrix dst='h' mul1='z' mul2='w1' add='b1' operation='relu' />
  <ComputeMatrix dst='gen' mul1='h' mul2='w2' add='b2' operation='sigmoid' />
  {test || <Render name='gen' />}
</>

export const Main = ({ test }: { test?: boolean }) => {
  const TimerBranch = test ? Fragment : DevTimerBranch

  return (
    <Project name='VAE'>
      <Variables />
      <Matrices />

      <Scene name='장면 1'>
        <SpriteObject
          name='썸네일'
          visible
          lock
          width={20}
          height={20}
          scaleX={10}
          scaleY={10}
        >
          <Picture
            name='썸네일'
            fileurl='/uploads/2t/f6/image/2tf67whus3l3qdybnzadtlni7409zjyb.png'
            width={20}
            height={20}
          />

          <Statement>
            <Block type='when_run_button_click' />
            <Block type='hide' />
            <TimerBranch>
              <DutscriptBranch>
                <MainCode test={test} />
              </DutscriptBranch>
            </TimerBranch>
          </Statement>
        </SpriteObject>
      </Scene>
    </Project>
  )
}
