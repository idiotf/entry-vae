import { Block } from 'entry-jsx'
import { useContext } from 'react'
import { CalcDivide, CalcMinus, CalcMod, CalcOperation, CalcPlus, CalcShare, CalcTimes } from './calculate'
import { AddVariableNumber, GetValueOfList, GetVariable, SetVariable, SetVariableNumber } from './variable'
import { NumberParam, StringParam } from './param-block'
import { DutscriptFlagContext } from './branch'
import { CharAt, JoinString } from './string'
import { RepeatVariable } from './repeat'
import type { MatrixName } from './matrix'

const LocateTo = ({ x, y }: { x: React.ReactNode, y: React.ReactNode }) =>
  <Block type='locate_xy'>
    {x}
    {y}
  </Block>

const LocateXTo = ({ children }: React.PropsWithChildren) =>
  <Block type='locate_x'>
    {children}
  </Block>


const MoveXBy = ({ children }: React.PropsWithChildren) =>
  <Block type='move_x'>
    {children}
  </Block>

const MoveYBy = ({ children }: React.PropsWithChildren) =>
  <Block type='move_y'>
    {children}
  </Block>


const StartDrawing = () => <Block type='start_drawing' />
const StopDrawing = () => <Block type='stop_drawing' />

const SetBrushWidth = ({ children }: React.PropsWithChildren) =>
  <Block type='set_thickness'>
    {children}
  </Block>

const SetBrushColor = ({ children }: React.PropsWithChildren) =>
  <Block type='set_color'>
    {children}
  </Block>


const hex = '0123456789abcdef'

export const SetColorToLuminance = ({ children }: React.PropsWithChildren) => <>
  <SetVariable name='sum'>
    <CalcOperation operation='round'>
      <CalcTimes
        param1={children}
        param2={<NumberParam value={255} />}
      />
    </CalcOperation>
  </SetVariable>

  {useContext(DutscriptFlagContext) ? <>
    <SetVariable name='sum'>
      <JoinString
        string1={
          <CharAt
            string={<StringParam value={hex} />}
            index={
              <CalcPlus
                param1={
                  <CalcShare
                    param1={<GetVariable name='sum' />}
                    param2={<NumberParam value={hex.length} />}
                  />
                }
                param2={<NumberParam value={1} />}
              />
            }
          />
        }
        string2={
          <CharAt
            string={<StringParam value={hex} />}
            index={
              <CalcPlus
                param1={
                  <CalcMod
                    param1={<GetVariable name='sum' />}
                    param2={<NumberParam value={hex.length} />}
                  />
                }
                param2={<NumberParam value={1} />}
              />
            }
          />
        }
      />
    </SetVariable>
    <SetBrushColor>
      <JoinString
        string1={<JoinString string1={<GetVariable name='sum' />} string2={<GetVariable name='sum' />} />}
        string2={<GetVariable name='sum' />}
      />
    </SetBrushColor>
  </> :
    <SetBrushColor>
      <Block type='change_rgb_to_hex'>
        <GetVariable name='sum' />
        <GetVariable name='sum' />
        <GetVariable name='sum' />
      </Block>
    </SetBrushColor>
  }
</>


export const Render = ({ name }: { name: MatrixName }) => <>
  <SetVariableNumber name='i' value={1} />
  <SetVariable name='j'>
    <CalcDivide
      param1={<NumberParam value={200} />}
      param2={<GetVariable name='width' />}
    />
  </SetVariable>
  <SetVariable name='k'>
    <CalcDivide
      param1={<NumberParam value={-200} />}
      param2={<GetVariable name='height' />}
    />
  </SetVariable>

  <LocateTo
    x={<NumberParam value={-100} />}
    y={
      <CalcPlus
        param1={<NumberParam value={100} />}
        param2={
          <CalcTimes
            param1={<GetVariable name='k' />}
            param2={<NumberParam value={0.5} />}
          />
        }
      />
    }
  />
  <SetBrushWidth>
    <CalcMinus
      param1={<NumberParam value={0} />}
      param2={<GetVariable name='k' />}
    />
  </SetBrushWidth>

  <RepeatVariable name='height'>
    <StartDrawing />
    <RepeatVariable name='width'>
      <SetColorToLuminance>
        <GetValueOfList name={name}>
          <GetVariable name='i' />
        </GetValueOfList>
      </SetColorToLuminance>
      <MoveXBy>
        <GetVariable name='j' />
      </MoveXBy>

      <AddVariableNumber name='i' value={1} />
    </RepeatVariable>

    <StopDrawing />
    <LocateXTo>
      <NumberParam value={-100} />
    </LocateXTo>
    <MoveYBy>
      <GetVariable name='k' />
    </MoveYBy>
  </RepeatVariable>
</>
