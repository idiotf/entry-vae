import { useContext } from 'react'
import { Block, Param, Statement } from 'entry-jsx'
import { DutscriptFlagContext } from './branch'
import { GetVariable, type VariableName } from './variable'

export const SkipDelay = () => useContext(DutscriptFlagContext) ||
  <Block type='Talebot_Move'>
    <Param />
    <Block type='continue_repeat' />
  </Block>

export const RepeatVariable = ({ name, children }: React.PropsWithChildren<{ name: VariableName }>) =>
  <Block type='repeat_basic'>
    <GetVariable name={name} />
    <Statement>
      {children}
      <SkipDelay />
    </Statement>
  </Block>
