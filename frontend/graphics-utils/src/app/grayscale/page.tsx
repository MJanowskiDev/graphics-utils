'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { withAuth } from '@/features/auth/hoc';
import { useAuth } from '@/features/auth/contexts/auth.context';

function GraysaclePage() {
  return (
    <section>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl">To grayscale</h1>
        <h1>Upload Files</h1>
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
    <form onSubmit={handleSubmit}>
      <input type="file" multiple onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
};
