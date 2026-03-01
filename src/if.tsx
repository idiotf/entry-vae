import { useContext } from 'react'
import { Block, Param, Statement } from 'entry-jsx'
import { DutscriptFlagContext } from './branch'
import { NumberParam } from './param-block'

export const IfElse = ({ condition, whenTrue, whenFalse }: {
  condition: React.ReactNode
  whenTrue: React.ReactNode
  whenFalse: React.ReactNode
}) =>
  <Block type='if_else'>
    {condition}
    <Statement>
      {whenTrue}
    </Statement>
    <Statement>
      {whenFalse}
    </Statement>
  </Block>

export const IsEqual = ({ param1, param2 }: {
  param1: React.ReactNode
  param2: React.ReactNode
}) => useContext(DutscriptFlagContext) ?
  <Block type='boolean_basic_operator'>
    {param1}
    <Param value='EQUAL' />
    {param2}
  </Block>
: <Block type='boolean_equal'>
    {param1}
    <Param />
    {param2}
  </Block>

export const IsGreaterThan = ({ param1, param2 }: {
  param1: React.ReactNode
  param2: React.ReactNode
}) => useContext(DutscriptFlagContext) ?
  <Block type='boolean_basic_operator'>
    {param1}
    <Param value='GREATER' />
    {param2}
  </Block>
: <Block type='boolean_bigger'>
    {param1}
    <Param />
    {param2}
  </Block>

export const IsPositiveNumber = ({ children }: React.PropsWithChildren) =>
  <IsGreaterThan param1={children} param2={<NumberParam value={0} />} />
