import { useContext } from 'react'
import { Block, Param, Variable, VariableParam } from 'entry-jsx'
import { DutscriptFlagContext } from './branch'
import { NumberParam } from './param-block'
import { CalcPlus } from './calculate'
import type { MatrixName } from './matrix'

const variables = {
  // 출력 해상도
  width: 0,
  height: 0,
  pixels: 0,
  pixels_two: 0,
  channels: 0,

  // 행렬 차원
  latent_dim: 0,
  hidden_dim: 0,
  output_dim: 0,

  // 행렬곱/렌더링
  i: 0,
  j: 0,
  k: 0,
  sum: 0,

  r: 0,
  g: 0,
  b: 0,

  // exp
  exp: 0,
}

export type VariableName = keyof typeof variables
export const getVar = (name: VariableName | 1) => name === 1 ? 1 : variables[name]

export async function setWeightSizeFromFile(name: string) {
  const { dim } = (await import(`../weights/${name}.json`)).default
  Object.assign(variables, dim)
  variables.output_dim = dim.width * dim.height * dim.channels
}


export const Variables = () => Object.entries(variables).map(([name, value], i) =>
  <Variable key={i} name={name} value={value} />
)


export const GetVariable = ({ name }: { name: VariableName }) =>
  <Block type='get_variable'>
    <VariableParam name={name} />
  </Block>

export const SetVariable = ({ name, children }: React.PropsWithChildren<{ name: VariableName }>) =>
  <Block type='set_variable'>
    <VariableParam name={name} />
    {children}
  </Block>

export const AddVariable = ({ name, children, notFloat }: React.PropsWithChildren<{
  name: VariableName
  notFloat?: boolean
}>) => useContext(DutscriptFlagContext) || notFloat ? // 부동소수점 연산을 의도하기 위해 구현을 달리 함
  <Block type='change_variable'>
    <VariableParam name={name} />
    {children}
  </Block>
: <SetVariable name={name}>
    <CalcPlus param1={<GetVariable name={name} />} param2={children} />
  </SetVariable>


export const SetVariableNumber = ({ name, value }: { name: VariableName, value: number }) =>
  <SetVariable name={name}>
    <NumberParam value={value} />
  </SetVariable>

export const AddVariableNumber = ({ name, value }: { name: VariableName, value: number }) =>
  <AddVariable name={name} notFloat>
    <NumberParam value={value} />
  </AddVariable>


export const GetValueOfList = ({ name, children }: React.PropsWithChildren<{ name: MatrixName }>) =>
  <Block type='value_of_index_from_list'>
    <Param />
    <VariableParam name={name} />
    <Param />
    {children}
  </Block>

export const GetListValueFrom = ({ name, index }: React.PropsWithChildren<{
  name: MatrixName
  index: VariableName
}>) =>
  <GetValueOfList name={name}>
    <GetVariable name={index} />
  </GetValueOfList>

export const AddValueToList = ({ name, children }: React.PropsWithChildren<{ name: MatrixName }>) =>
  <Block type='add_value_to_list'>
    {children}
    <VariableParam name={name} />
  </Block>

export const SetListValue = ({ name, index, children }: React.PropsWithChildren<{
  name: MatrixName
  index: React.ReactNode
}>) =>
  <Block type='change_value_list_index'>
    <VariableParam name={name} />
    {index}
    {children}
  </Block>

export const RemoveValueFromList = ({ name, children }: React.PropsWithChildren<{
  name: MatrixName
}>) =>
  <Block type='remove_value_from_list'>
    {children}
    <VariableParam name={name} />
  </Block>
