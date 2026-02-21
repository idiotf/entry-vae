import { useContext } from 'react'
import { CalcOperation, CalcTimes, CalcPlus, CalcMinus, CalcDivide } from './calculate'
import { GetVariable, SetVariable, type VariableName } from './variable'
import { NumberParam, StringParam } from './param-block'
import { DutscriptFlagContext } from './branch'
import { JoinString } from './string'

const NestPow = ({ depth, children }: React.PropsWithChildren<{ depth: number }>) => depth > 0 ?
  <CalcOperation operation='square'>
    <NestPow depth={depth - 1}>
      {children}
    </NestPow>
  </CalcOperation>
: children

const nestPowDepth = 7
const correctionCount = 3

export const CorrectionExp = ({ input }: { input: VariableName }) => useContext(DutscriptFlagContext) ?
  <CalcOperation operation='exp'>
    <GetVariable name={input} />
  </CalcOperation>
: <CalcTimes
    param1={<GetVariable name='exp' />}
    param2={
      <CalcPlus
        param1={<NumberParam value={1} />}
        param2={
          <CalcMinus
            param1={<GetVariable name={input} />}
            param2={
              <CalcOperation operation='ln'>
                <GetVariable name='exp' />
              </CalcOperation>
            }
          />
        }
      />
    }
  />

export const ComputeExp = ({ input }: { input: VariableName }) => useContext(DutscriptFlagContext) || <>
  <SetVariable name='exp'>
    <CalcOperation operation='round'>
      <CalcTimes
        param1={<GetVariable name={input} />}
        param2={<NumberParam value={1 / Math.log(10)} />}
      />
    </CalcOperation>
  </SetVariable>

  <SetVariable name='exp'>
    <CalcTimes
      param1={<JoinString string1={<StringParam value='1e' />} string2={<GetVariable name='exp' />} />}
      param2={
        <NestPow depth={nestPowDepth}>
          <CalcPlus
            param1={<NumberParam value={1} />}
            param2={
              <CalcDivide
                param1={
                  <CalcMinus
                    param1={<GetVariable name={input} />}
                    param2={
                      <CalcTimes
                        param1={<GetVariable name='exp' />}
                        param2={<NumberParam value={Math.log(10)} />}
                      />
                    }
                  />
                }
                param2={<NumberParam value={2 ** nestPowDepth} />}
              />
            }
          />
        </NestPow>
      }
    />
  </SetVariable>

  {Array(correctionCount - 1).fill(0).map((_, i) =>
    <SetVariable key={i} name='exp'>
      <CorrectionExp input={input} />
    </SetVariable>
  )}
</>
