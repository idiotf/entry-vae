import { createContext } from 'react'
import { Block, Param, Statement } from 'entry-jsx'
import { NumberParam } from './param-block'

export const DutscriptFlagContext = createContext(false)

export const DutscriptBranch = ({ children }: React.PropsWithChildren) =>
  <Block type='if_else'>
    <Block type='hidden_boolean'>
      <Param value='둣스크립트에서 실행하는가?' />
    </Block>

    <Statement>
      <DutscriptFlagContext.Provider value>
        {children}
      </DutscriptFlagContext.Provider>
    </Statement>

    <Statement>
      {children}
    </Statement>
  </Block>

export const DevTimerBranch = ({ children }: React.PropsWithChildren) => process.env.NODE_ENV == 'production' ? children : <>
  <Block type='choose_project_timer_action'>
    <Param />
    <Param value='START' />
  </Block>
  {children}
  <Block type='wait_second'>
    <NumberParam value={0} />
  </Block>
  <Block type='dialog'>
    <Block type='get_project_timer_value' />
    <Param value='speak' />
  </Block>
</>
