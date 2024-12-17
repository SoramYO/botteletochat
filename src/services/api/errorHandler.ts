import { AxiosError } from 'axios';
import { ApiError } from './types';
import { toast } from 'react-hot-toast';

export class ApiErrorHandler {
  static handle(error: unknown): never {
    if (this.isApiError(error)) {
      const apiError = error as AxiosError<ApiError>;
      const errorMessage = this.getErrorMessage(apiError);
      
      console.error('API Error:', errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    const genericError = 'An unexpected error occurred';
    console.error(genericError, error);
    toast.error(genericError);
    throw new Error(genericError);
  }

  private static isApiError(error: unknown): error is AxiosError<ApiError> {
    return axios.isAxiosError(error);
  }

  private static getErrorMessage(error: AxiosError<ApiError>): string {
    return error.response?.data?.description || 
           error.response?.data?.message ||
           error.message ||
           'Unknown API error';
  }
}