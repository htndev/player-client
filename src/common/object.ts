import { GraphQLTypename } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const excludeTypename = <T extends GraphQLTypename>({ __typename, ...rest }: T) => rest;

export const isUndefined = (obj: unknown): obj is undefined => typeof obj === 'undefined';

export const isNull = (obj: unknown): obj is null => obj === null;

export const isNil = (obj: unknown): obj is null | undefined => isUndefined(obj) || isNil(obj);

export const isEmptyObject = (obj: object): boolean => !isNil(obj) && !Object.keys(obj).length;
