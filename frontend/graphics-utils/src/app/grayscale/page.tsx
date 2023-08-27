'use client';

import { useState } from 'react';
import ReactCompareImage from 'react-compare-image';
import { AiOutlineDownload } from 'react-icons/ai';

import { withAuth } from '@/shared/hoc';
import { SSEListener } from '@/features/sse/components/SSEListener';
import { OperationType } from '@/features/sse/types';
import { useToGrayscale } from '@/features/image-processing/hooks';
import { FeedbackToUser } from '@/features/auth/components';
import { Button } from '@/shared/ui';

function GraysaclePage() {
  return (
    <section className="flex flex-col w-full gap-6 items-center justify-center">
      <div className="flex flex-col gap-10">
        <h1 className="text-2xl">Convert image to grayscale</h1>
        <FileUpload />
      </div>
    </section>
  );
}

export default withAuth(GraysaclePage);

const FileUpload: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [showSSEResults, setShowSSEResults] = useState(false);

  const { mutate, isLoading, isError } = useToGrayscale();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileURL = URL.createObjectURL(files[0]);
      setOriginalImageUrl(fileURL);
    }
    setConvertedImageUrl(null);
    setSelectedFiles(files);
    setShowSSEResults(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFiles) return;
    setShowSSEResults(true);
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    mutate(formData, {
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(data.blob);
        setConvertedImageUrl(url);
      },
      onError: (err) => {
        console.error('Error uploading files:', err);
      },
    });
  };

  const handleDownload = () => {
    if (convertedImageUrl) {
      const link = document.createElement('a');
      link.href = convertedImageUrl;
      link.setAttribute('download', 'output_grayscale.png');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return (
    <section className="flex flex-col gap-6 w-full items-center justify-center">
      <div>
        <form onSubmit={handleSubmit} className="flex-col flex gap-4">
          <input
            onChange={handleFileChange}
            className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer 
            bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="multiple_files"
            type="file"
            multiple
          />
          <Button label="Convert" size="medium" variant="primary" disabled={!selectedFiles} loading={isLoading} outlined />
        </form>
      </div>
      <FeedbackToUser isError={isError} />
      {originalImageUrl && convertedImageUrl && (
        <div style={{ width: '300px', marginTop: '20px' }}>
          <ReactCompareImage leftImage={originalImageUrl} rightImage={convertedImageUrl} />
        </div>
      )}
      {convertedImageUrl && (
        <Button
          startIcon={<AiOutlineDownload />}
          classes="w-[350px] mt-2"
          label="Download"
          size="medium"
          variant="primary"
          onClick={handleDownload}
          outlined
        />
      )}
      {showSSEResults && <SSEListener selectedOperation={OperationType.toGrayscale} />}
    </section>
  );
};
