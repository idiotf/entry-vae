import type { BlockProps, jsxToProject } from 'entry-jsx'

type ProjectData = ReturnType<typeof jsxToProject>
type BlockData = Required<Omit<BlockProps, 'children'>>

let project: ProjectData

export function interpret(p: ProjectData) {
  project = p

  for (const object of p.objects)
    for (const thread of JSON.parse(object.script) as BlockData[][])
      interpretThread(thread)
}

const isObject = (v: unknown): v is object => !!(typeof v == 'object' && v)
/** temp */
const isBlock = (v: unknown): v is BlockData => isObject(v)

const statementSymbol = Symbol('statement')
const statement = (i: number) => ({ [statementSymbol]: i })
const statementCondition = (i: number) => ({ [statementSymbol]: i, condition: true })

function interpretThread(thread: BlockData[]) {
  for (const block of thread) for (const scope = Object.create(null) as never;;) {
    const value = runBlock(block, scope)

    if (isObject(value) && statementSymbol in value && typeof value[statementSymbol] == 'number') {
      interpretThread(block.statements[value[statementSymbol]]!)
      if ('condition' in value) break
    } else if (value != scope) {
      break
    }
  }
}

function runBlock(block: BlockData, scope: never): unknown {
  // 엔트리에서 params를 여러 번 계산하는 것을 고증함
  const params = block.params.map(v => {
    if (isBlock(v)) return runBlock(v, scope)
    return v
  })
  return blocks[block.type]?.apply(scope, params)
}

const blocks: Record<string, (this: never, ...args: unknown[]) => unknown> = {
  when_run_button_click() {},

  _if(condition) {
    if (condition) return statementCondition(0)
  },

  if_else(condition) {
    if (condition) return statementCondition(0)
    else return statementCondition(1)
  },

  repeat_basic(this: { count: number }, count) {
    this.count ??= Number(count)
    if (this.count--) return statement(0)
  },

  hidden_boolean() {
    return true
  },

  number(value) {
    return value
  },

  string(value) {
    return value
  },

  boolean_basic_operator(left, operator, right) {
    if (typeof left != 'string' && typeof left != 'number' || typeof right != 'string' && typeof right != 'number')
      throw TypeError(`Cannot compare ${typeof left} and ${typeof right}`)

    switch (operator) {
      case 'LESS': return left < right
      case 'GREATER': return left > right
    }
  },

  calc_basic(left, operator, right) {
    const leftNum = Number(left)
    const rightNum = Number(right)

    switch (operator) {
      case 'PLUS':   return leftNum + rightNum
      case 'MINUS':  return leftNum - rightNum
      case 'MULTI':  return leftNum * rightNum
      case 'DIVIDE': return leftNum / rightNum
      default: throw TypeError(`[calc_basic] Unknown operator: ${leftNum} [${operator}] ${rightNum}`)
    }
  },

  quotient_and_mod(_0, left, _1, right, _2, operator) {
    const leftNum = Number(left)
    const rightNum = Number(right)

    if (operator == 'QUOTIENT') return Math.floor(leftNum / rightNum)
    else return leftNum % rightNum
  },

  calc_operation(_0, value, _1, operation) {
    const x = Number(value)

    switch (operation) {
      case 'square': return x * x
      case 'root': return Math.sqrt(x)
      case 'exp': return Math.exp(x)
      default: throw TypeError(`[calc_operation] Unknown operation: [${operation}] ${x}`)
    }
  },

  combine_something(_0, left, _1, right) {
    return `${left}${right}`
  },

  get_variable(id) {
    return project.variables.find(v => v.id == id)!.value
  },

  set_variable(id, value) {
    project.variables.find(v => v.id == id)!.value = value
  },

  change_variable(id, value) {
    const variable = project.variables.find(v => v.id == id)!
    variable.value = Number(variable.value) + Number(value)
  },

  value_of_index_from_list(_0, id, _1, index) {
    const list = project.variables.find(v => v.id == id)!
    if (!('array' in list))
      throw TypeError(`[value_of_index_from_list] Cannot get ${index}th of list ${list.name}: not array`)

    const array = list.array as { data: unknown }[]
    if (typeof index != 'number' || 1 > index || index > array.length)
      throw RangeError(`[value_of_index_from_list] Cannot get ${index}th of list ${list.name}: range overflow (length = ${array.length})`)

    return array[index - 1]?.data
  },

  add_value_to_list(data, id) {
    const list = project.variables.find(v => v.id == id)!
    if (!('array' in list && Array.isArray(list.array)))
      throw TypeError(`[add_value_to_list] Cannot add ${data} to list ${list.name}: not array`)

    list.array.push({ data })
  },

  change_value_list_index(id, index, data) {
    const list = project.variables.find(v => v.id == id)!
    if (!('array' in list && Array.isArray(list.array)))
      throw TypeError(`[change_value_list_index] Cannot change ${index}th of list ${list.name} to ${data}: not array`)

    if (typeof index != 'number' || !(1 <= index && index <= list.array.length))
      throw RangeError(`[change_value_list_index] Cannot get ${index}th of list ${list.name}: range overflow (length = ${list.array.length})`)

    list.array.splice(index - 1, 1, { data })
  },

  remove_value_from_list(index, id) {
    const list = project.variables.find(v => v.id == id)!
    if (!('array' in list && Array.isArray(list.array)))
      throw TypeError(`[remove_value_from_list] Cannot remove ${index}th of list ${list.name}: not array`)

    if (typeof index != 'number' || !(1 <= index && index <= list.array.length))
      throw RangeError(`[remove_value_from_list] Cannot remove ${index}th of list ${list.name}: range overflow (length = ${list.array.length})`)

    list.array.splice(index - 1, 1)
  },
}
