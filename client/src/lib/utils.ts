import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Batch } from '../../../types/types';

export function batch_to_number(batch: Batch) {
  if (batch === 'core') {
    return 0;
  } else if (typeof batch === 'number') {
    return batch + 1;
  } else if (batch === 'adjust') {
    return 1000;
  } else if (batch === 'not-admitted') {
    return 1001;
  } else if (batch === 'not-full') {
    return 1002;
  } else {
    throw new Error(`Invalid batch ${batch}`);
  }
}

export function batch_to_string(batch: Batch) {
  if (batch === 'core') {
    return '核心成员';
  } else if (typeof batch === 'number') {
    return `第 ${batch + 1} 志愿`;
  } else if (batch === 'adjust') {
    return '调剂';
  } else if (batch === 'not-admitted') {
    return '未录取';
  } else if (batch === 'not-full') {
    return '未满';
  } else {
    throw new Error(`Invalid batch ${batch}`);
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clear_local_storage_cache() {
  localStorage.clear();
  location.reload();
}

export function convert_password_compatible(password: string): string {
  // The password was something like `260101@12345X` before, but it proves to be unnecessary.
  // So if the password is in the old format, we convert it to the new format (like 12345X).
  const match = password.match(/^(\d{6})@(\d{5}[X\d])$/);
  if (match) {
    return match[2];
  } else {
    return password;
  }
}
