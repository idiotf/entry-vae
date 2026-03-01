import { Block } from 'entry-jsx'
import { useContext } from 'react'
import { CalcDivide, CalcMinus, CalcMod, CalcOperation, CalcPlus, CalcShare, CalcTimes } from './calculate'
import { AddVariableNumber, GetValueOfList, GetVariable, SetVariable, SetVariableNumber, type VariableName } from './variable'
import { NumberParam, StringParam } from './param-block'
import { DutscriptFlagContext } from './branch'
import { CharAt, JoinString } from './string'
import { RepeatVariable } from './repeat'
import { IfElse, IsEqual } from './if'
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

const DutscriptConvertToHex = ({ name }: { name: VariableName }) =>
  <JoinString
    string1={
      <CharAt
        string={<StringParam value={hex} />}
        index={
          <CalcPlus
            param1={
              <CalcShare
                param1={<GetVariable name={name} />}
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
                param1={<GetVariable name={name} />}
                param2={<NumberParam value={hex.length} />}
              />
            }
            param2={<NumberParam value={1} />}
          />
        }
      />
    }
  />

const RoundToByte = ({ children }: React.PropsWithChildren) =>
  <CalcOperation operation='round'>
    <CalcTimes
      param1={children}
      param2={<NumberParam value={255} />}
    />
  </CalcOperation>

export const SetColorToLuminance = ({ children }: React.PropsWithChildren) => <>
  <SetVariable name='sum'>
    <RoundToByte>
      {children}
    </RoundToByte>
  </SetVariable>

  {useContext(DutscriptFlagContext) ? <>
    <SetVariable name='sum'>
      <DutscriptConvertToHex name='sum' />
    </SetVariable>
    <SetBrushColor>
      <JoinString
        string1={
          <JoinString
            string1={<GetVariable name='sum' />}
            string2={<GetVariable name='sum' />}
          />
        }
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

export const SetColorToRGB = ({ r, g, b }: {
  r: React.ReactNode
  g: React.ReactNode
  b: React.ReactNode
}) => <>
  <SetVariable name='r'>
    <RoundToByte>
      {r}
    </RoundToByte>
  </SetVariable>

  <SetVariable name='g'>
    <RoundToByte>
      {g}
    </RoundToByte>
  </SetVariable>

  <SetVariable name='b'>
    <RoundToByte>
      {b}
    </RoundToByte>
  </SetVariable>

  {useContext(DutscriptFlagContext) ? <>
    <SetVariable name='r'>
      <DutscriptConvertToHex name='r' />
    </SetVariable>

    <SetVariable name='g'>
      <DutscriptConvertToHex name='g' />
    </SetVariable>

    <SetVariable name='b'>
      <DutscriptConvertToHex name='b' />
    </SetVariable>

    <SetBrushColor>
      <JoinString
        string1={
          <JoinString
            string1={<GetVariable name='r' />}
            string2={<GetVariable name='g' />}
          />
        }
        string2={<GetVariable name='b' />}
      />
    </SetBrushColor>
  </> :
    <SetBrushColor>
      <Block type='change_rgb_to_hex'>
        <GetVariable name='r' />
        <GetVariable name='g' />
        <GetVariable name='b' />
      </Block>
    </SetBrushColor>
  }
</>


const RenderLoop = ({ name, isRGB }: { name: MatrixName, isRGB?: boolean }) =>
  <RepeatVariable name='height'>
    <StartDrawing />
    <RepeatVariable name='width'>
      {isRGB ?
        <SetColorToRGB
          r={
            <GetValueOfList name={name}>
              <GetVariable name='i' />
            </GetValueOfList>
          }
          g={
            <GetValueOfList name={name}>
              <CalcPlus
                param1={<GetVariable name='i' />}
                param2={<GetVariable name='pixels' />}
              />
            </GetValueOfList>
          }
          b={
            <GetValueOfList name={name}>
              <CalcPlus
                param1={<GetVariable name='i' />}
                param2={<GetVariable name='pixels_two' />}
              />
            </GetValueOfList>
          }
        />
      : <SetColorToLuminance>
          <GetValueOfList name={name}>
            <GetVariable name='i' />
          </GetValueOfList>
        </SetColorToLuminance>
      }
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

  <IfElse
    condition={
      <IsEqual
        param1={<GetVariable name='channels' />}
        param2={<NumberParam value={3} />}
      />
    }
    whenTrue={<RenderLoop name={name} isRGB />}
    whenFalse={<RenderLoop name={name} />}
  />
</>
