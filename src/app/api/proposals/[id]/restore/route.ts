import { PUT_RESTORE } from '../../../proposals/route';

export async function PUT(request: Request) {
  return PUT_RESTORE(request);
}
