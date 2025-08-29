import { worker } from './browser'

export async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  return worker.start()
}