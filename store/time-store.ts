import { atomWithStorage } from 'jotai/utils';
import { formatTime } from '../utils/clock';
import { atom } from 'jotai';

export const Time = atomWithStorage<number>('ies-time', 0)

export const FormattedTime = atom((get) => {
  return formatTime(get(Time))
})