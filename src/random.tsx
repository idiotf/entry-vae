import { Block, Param } from 'entry-jsx'
import { CalcOperation, CalcTimes } from './calculate'
import { NumberParam } from './param-block'

export const CalcRandom = ({ min, max }: {
  min: React.ReactNode
  max: React.ReactNode
}) =>
  <Block type='calc_rand'>
    <Param />
    {min}
    <Param />
    {max}
  </Block>

const PRECISION = 1000

export const GaussianRandom = () =>
  <CalcTimes
    param1={
      <CalcOperation operation='root'>
        <CalcTimes
          param1={<NumberParam value={-2} />}
          param2={
            <CalcOperation operation='ln'>
              <CalcTimes
                param1={
                  <CalcRandom
                    min={<NumberParam value={1} />}
                    max={<NumberParam value={PRECISION} />}
                  />
                }
                param2={<NumberParam value={1 / PRECISION} />}
              />
            </CalcOperation>
          }
        />
      </CalcOperation>
    }
    param2={
      <CalcOperation operation='cos'>
        <CalcTimes
          param1={<NumberParam value={360 / PRECISION} />}
          param2={
            <CalcRandom
              min={<NumberParam value={0} />}
              max={<NumberParam value={PRECISION} />}
            />
          }
        />
      </CalcOperation>
    }
  />
