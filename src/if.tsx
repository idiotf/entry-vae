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

export const IsGreaterThan = ({ number1, number2 }: {
  number1: React.ReactNode
  number2: React.ReactNode
}) => useContext(DutscriptFlagContext) ?
  <Block type='boolean_basic_operator'>
    {number1}
    <Param value='GREATER' />
    {number2}
  </Block>
: <Block type='boolean_bigger'>
    {number1}
    <Param />
    {number2}
  </Block>

export const IsPositiveNumber = ({ children }: React.PropsWithChildren) =>
  <IsGreaterThan number1={children} number2={<NumberParam value={0} />} />
