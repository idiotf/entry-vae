import { describe, expect, it } from 'bun:test'
import { jsxToProject } from 'entry-jsx'
import { Main } from '../src/main'
import { computeVAE } from './vae'
import { interpret } from './block-interpreter'
import { setWeightFromFile } from '../src/weight'
import type { MatrixName } from '../src/matrix'

function runProject(children: React.ReactNode) {
  const project = jsxToProject(children)
  interpret(project)
  return project
}

function getList(project: Awaited<ReturnType<typeof runProject>>, name: MatrixName) {
  const list = project.variables.find(v => v.name == name)!
  if (!('array' in list && Array.isArray(list.array)))
    throw TypeError(`${name} is not array`)

  return list.array.map<number>(v => v.data)
}

async function testVAE(name: string) {
  await setWeightFromFile(name)

  const project = runProject(<Main test dutscript />)
  const gen = toFixed(getList(project, 'gen'))

  expect(gen).toEqual(toFixed([await computeVAE()].flat(6)))
}

const digits = 4
const toFixed = (x: number[]) => x.map(v => v.toFixed(digits))

describe('Entry VAE', () => {
  it('1', () => testVAE('test_1'))
  it('2', () => testVAE('test_2'))
})
