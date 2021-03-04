import isEmailValidator from 'validator/lib/isEmail';

// eslint-disable-next-line @typescript-eslint/camelcase
export const isEmail = (email: string): boolean => isEmailValidator(email, { allow_ip_domain: false });
