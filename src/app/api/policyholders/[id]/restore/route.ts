import { PUT_RESTORE } from '../../../policyholders/route';

export async function PUT(request: Request) {
  return PUT_RESTORE(request);
}
