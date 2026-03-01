import { List } from 'entry-jsx'
import { AddValueToList, AddVariable, AddVariableNumber, GetListValueFrom, GetVariable, SetVariable, SetVariableNumber, type VariableName } from './variable'
import { CalcDivide, CalcMinus, CalcPlus, CalcTimes } from './calculate'
import { ComputeExp, CorrectionExp } from './exp'
import { IfElse, IsPositiveNumber } from './if'
import { NumberParam } from './param-block'
import { GaussianRandom } from './random'
import { RepeatVariable } from './repeat'

const matrixSizes = {
  z: [1, 'latent_dim'],
  h: [1, 'hidden_dim'],
  gen: [1, 'output_dim'],
  w1: ['latent_dim', 'hidden_dim'],
  w2: ['hidden_dim', 'output_dim'],
  b1: [1, 'hidden_dim'],
  b2: [1, 'output_dim'],
} satisfies Record<string, [VariableName | 1, VariableName]>

export type MatrixName = keyof typeof matrixSizes
export const getMatrixSize = (name: MatrixName) => matrixSizes[name]
export const getMatrixRows = (name: MatrixName) => getMatrixSize(name)[0]
export const getMatrixCols = (name: MatrixName) => getMatrixSize(name)[1]

const matrices: Record<MatrixName, number[]> = {
  z: [],
  h: [],
  gen: [],
  w1: [],
  w2: [],
  b1: [],
  b2: [],
}

export const getMatrix = (name: MatrixName) => matrices[name]
export async function setMatrixWeightFromFile(name: string) {
  const { weight } = (await import(`../weights/${name}.json`)).default
  Object.assign(matrices, weight)
}


export const Matrices = () => Object.entries(matrices).map(([name, value], i) =>
  <List key={i}
    name={name}
    array={value.map(data => ({ data }))}
    x={-240}
    y={-135}
    width={480}
    height={270}
  />
)

export const InitData = ({ keepZ }: { keepZ?: boolean }) => <>
  <SetVariable name='pixels'>
    <CalcTimes
      param1={<GetVariable name='width' />}
      param2={<GetVariable name='height' />}
    />
  </SetVariable>
  <SetVariable name='pixels_two'>
    <CalcTimes
      param1={<GetVariable name='pixels' />}
      param2={<NumberParam value={2} />}
    />
  </SetVariable>
  <SetVariable name='output_dim'>
    <CalcTimes
      param1={<GetVariable name='pixels' />}
      param2={<GetVariable name='channels' />}
    />
  </SetVariable>
  {keepZ ||
    <RepeatVariable name={getMatrixCols('z')}>
      <AddValueToList name='z'>
        <GaussianRandom />
      </AddValueToList>
    </RepeatVariable>
  }
</>


export const ComputeMatrix = ({ dst, mul1, mul2, add, operation }: {
  dst: MatrixName
  mul1: MatrixName
  mul2: MatrixName
  add: MatrixName
  operation: 'relu' | 'sigmoid'
}) => <>
  <SetVariableNumber name='k' value={1} />

  <RepeatVariable name={getMatrixCols(dst)}>
    <SetVariableNumber name='j' value={1} />
    <SetVariable name='i'>
      <GetVariable name='k' />
    </SetVariable>
    <SetVariable name='sum'>
      <GetListValueFrom name={add} index='k' />
    </SetVariable>

    <RepeatVariable name={getMatrixCols(mul1)}>
      <AddVariable name='sum'>
        <CalcTimes
          param1={<GetListValueFrom name={mul1} index='j' />}
          param2={<GetListValueFrom name={mul2} index='i' />}
        />
      </AddVariable>

      <AddVariableNumber name='j' value={1} />
      <AddVariable name='i' notFloat>
        <GetVariable name={getMatrixCols(dst)} />
      </AddVariable>
    </RepeatVariable>

    {operation == 'relu' ?
      <IfElse
        condition={
          <IsPositiveNumber>
            <GetVariable name='sum' />
          </IsPositiveNumber>
        }
        whenTrue={
          <AddValueToList name={dst}>
            <GetVariable name='sum' />
          </AddValueToList>
        }
        whenFalse={
          <AddValueToList name={dst}>
            <NumberParam value={0} />
          </AddValueToList>
        }
      />
    : <>
      <SetVariable name='sum'>
        <CalcMinus
          param1={<NumberParam value={0} />}
          param2={<GetVariable name='sum' />}
        />
      </SetVariable>
      <ComputeExp input='sum' />
      <AddValueToList name={dst}>
        <CalcDivide
          param1={<NumberParam value={1} />}
          param2={
            <CalcPlus
              param1={<NumberParam value={1} />}
              param2={
                <CorrectionExp input='sum' />
              }
            />
          }
        />
      </AddValueToList>
    </>}

    <AddVariableNumber name='k' value={1} />
  </RepeatVariable>
</>
