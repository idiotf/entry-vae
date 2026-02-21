import * as tf from '@tensorflow/tfjs'
import { getVar } from '../src/variable'
import { getMatrixRows, getMatrixCols, getMatrix, type MatrixName } from '../src/matrix'

const matrix = (name: MatrixName) => tf.tensor2d(getMatrix(name), [
  getVar(getMatrixRows(name)),
  getVar(getMatrixCols(name)),
])

export function computeVAE() {
  const z = matrix('z')
  const w1 = matrix('w1')
  const w2 = matrix('w2')
  const b1 = matrix('b1')
  const b2 = matrix('b2')

  const h = tf.relu(tf.add(tf.matMul(z, w1), b1))
  const gen = tf.sigmoid(tf.add(tf.matMul(h, w2), b2))

  return gen.array()
}
