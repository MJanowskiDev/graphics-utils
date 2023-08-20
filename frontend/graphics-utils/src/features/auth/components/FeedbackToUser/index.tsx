import { AxiosError } from 'axios';
import { AuthError } from '../../types';

interface FeedbackToUserProps {
  isLoading?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  error?: AxiosError<AuthError> | null;
}

export const FeedbackToUser = ({ isLoading, isError, isSuccess, error }: FeedbackToUserProps) => {
  const errorMessage = isError && error ? (error as AxiosError<AuthError>).response?.data.exception.message : '';

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error {errorMessage?.toString()}</div>;
  }

  if (isSuccess) {
    return <div>Success</div>;
  }
};
