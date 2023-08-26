import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiError } from '@/types';
import { httpProvider } from '@/utils/provider';

interface MutationResponse {
  blob: Blob;
  contentType: string;
}

export const useBgRemoval = () => {
  const mutationFn = async (formData: FormData): Promise<MutationResponse> => {
    const response = await httpProvider.post('/image/bgremoval', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: response.headers['content-type'] });

    return {
      blob,
      contentType: response.headers['content-type'],
    };
  };

  const { mutate, isLoading, isError, isSuccess, error } = useMutation<MutationResponse, AxiosError<ApiError>, FormData>(mutationFn);
  return { mutate, isLoading, isError, isSuccess, error };
};
