import { useContext } from 'react'
import { Block, Param } from 'entry-jsx'
import { DutscriptFlagContext } from './branch'

const CalcBasic = ({ param1, param2, dutscript, entry, notFloat }: {
  param1: React.ReactNode
  param2: React.ReactNode
  dutscript: string
  entry: string
  notFloat?: boolean
}) => useContext(DutscriptFlagContext) || notFloat ?
  <Block type='calc_basic'>
    {param1}
    <Param value={dutscript} />
    {param2}
  </Block>
: <Block type={entry}>
    {param1}
    <Param />
    {param2}
  </Block>

interface CalcProps {
  param1: React.ReactNode
  param2: React.ReactNode
  notFloat?: boolean
}

export const CalcPlus = (props: CalcProps) =>
  <CalcBasic {...props} dutscript='PLUS' entry='calc_plus' />

export const CalcMinus = (props: CalcProps) =>
  <CalcBasic {...props} dutscript='MINUS' entry='calc_minus' />

export const CalcTimes = (props: CalcProps) =>
  <CalcBasic {...props} dutscript='MULTI' entry='calc_times' />

export const CalcDivide = (props: CalcProps) =>
  <CalcBasic {...props} dutscript='DIVIDE' entry='calc_divide' />

export const CalcShare = ({ param1, param2 }: Omit<CalcProps, 'notFloat'>) => useContext(DutscriptFlagContext) ?
  <Block type='quotient_and_mod'>
    <Param />
    {param1}
    <Param />
    {param2}
    <Param />
    <Param value='QUOTIENT' />
  </Block>
: <Block type='calc_share'>
    {param1}
    <Param />
    {param2}
  </Block>

export const CalcMod = ({ param1, param2 }: Omit<CalcProps, 'notFloat'>) => useContext(DutscriptFlagContext) ?
  <Block type='quotient_and_mod'>
    <Param />
    {param1}
    <Param />
    {param2}
    <Param />
    <Param value='MOD' />
  </Block>
: <Block type='calc_mod'>
    {param1}
    <Param />
    {param2}
  </Block>

type Operation =
  | 'square'
  | 'root'
  | 'sin'
  | 'cos'
  | 'tan'
  | 'asin_radian'
  | 'acos_radian'
  | 'atan_radian'
  | 'log'
  | 'ln'
  | 'unnatural'
  | 'floor'
  | 'ceil'
  | 'round'
  | 'factorial'
  | 'abs'
  | 'exp'

export const CalcOperation = ({ operation, children }: React.PropsWithChildren<{
  operation: Operation
}>) =>
  <Block type='calc_operation'>
    <Param />
    {children}
    <Param />
    <Param value={operation} />
  </Block>
