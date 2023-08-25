'use client';

import { useState } from 'react';
import { withAuth } from '@/features/auth/hoc';
import { httpProvider } from '@/utils/provider';
import ReactCompareImage from 'react-compare-image';

function GraysaclePage() {
  return (
    <section className="flex flex-col gap-6 w-full items-center justify-center">
      <div className="flex flex-col gap-6">
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileURL = URL.createObjectURL(files[0]);
      setOriginalImageUrl(fileURL);
    }
    setSelectedFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFiles) return;

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    try {
      const response = await httpProvider.post('/image/grayscale', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      const url = window.URL.createObjectURL(blob);
      setConvertedImageUrl(url);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
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
          <input type="file" multiple onChange={handleFileChange} />
          <button className="rounded-lg bg-purple-600 text-white text-md p-2.5" type="submit">
            Upload
          </button>
        </form>
      </div>
      {originalImageUrl && convertedImageUrl && (
        <div style={{ width: '300px', marginTop: '20px' }}>
          <ReactCompareImage leftImage={originalImageUrl} rightImage={convertedImageUrl} />
        </div>
      )}
      {convertedImageUrl && (
        <button className="mt-4 rounded-lg bg-purple-600 text-white text-md p-2.5" onClick={handleDownload}>
          Download Grayscale Image
        </button>
      )}
    </section>
  );
};
