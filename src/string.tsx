import { Block, Param } from 'entry-jsx'

export const JoinString = ({ string1, string2 }: {
  string1: React.ReactNode
  string2: React.ReactNode
}) =>
  <Block type='combine_something'>
    <Param />
    {string1}
    <Param />
    {string2}
  </Block>

export const CharAt = ({ string, index }: {
  string: React.ReactNode
  index: React.ReactNode
}) =>
  <Block type='char_at'>
    <Param />
    {string}
    <Param />
    {index}
  </Block>
