import { setMatrixWeightFromFile } from './matrix'
import { setWeightSizeFromFile } from './variable'

export async function setWeightFromFile(name: string) {
  await setMatrixWeightFromFile(name)
  await setWeightSizeFromFile(name)
}
