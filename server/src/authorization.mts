import type { Request } from "express";
import type PocketBase from "pocketbase";
import type { RecordAuthResponse, RecordModel } from "pocketbase";

export async function auth(req: Request, pb: PocketBase): Promise<{ success: true, authData: RecordAuthResponse<RecordModel> } | { success: false, code: number, error: string }> {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return { success: false, code: 401, error: 'Unauthorized' };
  }
  const authorization_split = authorization.split(' ');
  if (authorization_split[0] !== 'Bearer' || authorization_split.length !== 2) {
    return { success: false, code: 401, error: 'Invalid authorization header' };
  }
  const token = authorization_split[1];
  pb.authStore.save(token);
  let authData: RecordAuthResponse<RecordModel>;
  try {
    authData = await pb.collection('users').authRefresh();
  } catch (error) {
    return { success: false, code: 401, error: 'Invalid token' };
  }
  if (!pb.authStore.isValid) {
    return { success: false, code: 401, error: 'Invalid token' };
  }
  return { success: true, authData };
}