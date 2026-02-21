import { Block, Param } from 'entry-jsx'

export const NumberParam = ({ value }: { value: number }) =>
  <Block type='number'>
    <Param value={value} />
  </Block>

export const StringParam = ({ value }: { value: string }) =>
  <Block type='text'>
    <Param value={value} />
  </Block>
