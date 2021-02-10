export const isUndefined = (obj: unknown): obj is undefined => typeof obj === 'undefined';

export const isNull = (obj: unknown): obj is null => obj === null;

export const isNil = (obj: unknown): obj is null | undefined => isUndefined(obj) || isNil(obj);

export const isEmptyObject = (obj: object): boolean => !isNil(obj) && !Object.keys(obj).length;

export const isObjectIncludesObject = <T extends object, K extends keyof T>(target: T) =>
  !isNil(target) && Object.keys(target).some(key => typeof target[key as K] === 'object' && !isNull(target[key as K]));
