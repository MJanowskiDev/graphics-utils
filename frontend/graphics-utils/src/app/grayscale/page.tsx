'use client';

import { useState } from 'react';
import axios from 'axios';
import { withAuth } from '@/features/auth/hoc';
import { useAuth } from '@/features/auth/contexts/auth.context';

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
  const { token } = useAuth();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFiles) return;

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    try {
      const response = await axios.post('/image/grayscale', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      let filename = 'output_grayscale.png';

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <section className="flex flex-col gap-6 w-full items-center justify-center">
      <div>
        <form onSubmit={handleSubmit} className="flex-col flex gap-4">
          <input type="file" multiple onChange={handleFileChange} />
          <button className=" rounded-lg bg-purple-600 text-white text-md p-2.5" type="submit">
            Upload
          </button>
        </form>
      </div>
    </section>
  );
};
