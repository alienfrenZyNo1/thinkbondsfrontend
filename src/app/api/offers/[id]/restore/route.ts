import { PUT_RESTORE } from '../../../offers/route';

export async function PUT(request: Request) {
  return PUT_RESTORE(request);
}
