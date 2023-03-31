import { ErrorsModule } from '~/store/modules/errors';

export const checkIsStringIsObj = (value: string): boolean => {
  try {
    if (value.charAt(0) === '{') {
      return typeof JSON.parse(value) === 'object';
    } else {
      return false;
    }
  } catch (e: any) {
    ErrorsModule.showErrorMessage(e.message);
    return false;
  }
};
