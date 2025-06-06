import { useState, useRef, useCallback, useEffect } from 'react';
import api from '../api/api';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

const ImageUploader = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const openCropModal = (index) => {
    setEditingIndex(index);
    setCropModalOpen(true);
  };

  const getCroppedFile = async () => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob], `cropped-${files[editingIndex].file.name}`, { 
          type: 'image/jpeg' 
        }));
      }, 'image/jpeg');
    });
  };

  const handleDeleteImage = (index) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter(file => 
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) &&
      file.size <= 5 * 1024 * 1024
    ).slice(0, 5 - files.length);

    const filesWithPreviews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      cropped: false
    }));

    setFiles(prev => [...prev, ...filesWithPreviews]);
  }, [files.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': ['.jpeg', '.png', '.webp']},
    multiple: true,
    maxFiles: 5
  });

  const uploadFiles = async () => {
    // if (files.length !== 5) {
    //   setError('Exactly 5 images are required for upload');
    //   return;
    // }

    setLoading(true);
    setError('');
    setProgress(0);

    try {
      const formData = new FormData();
      files.forEach(({ file }) => formData.append('images', file));

      const response = await api.post('houses/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        }
      });
      setUploadedUrls(response.data.results);
      onUploadSuccess(response.data.results);
      setFiles([]);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCrop = async () => {
    try {
      const croppedFile = await getCroppedFile();
      const croppedPreview = URL.createObjectURL(croppedFile);

      setFiles(prev => prev.map((file, index) => 
        index === editingIndex ? { 
          ...file, 
          file: croppedFile, 
          preview: croppedPreview,
          cropped: true
        } : file
      ));

      setCropModalOpen(false);
    } catch (error) {
      console.error(error);
      setError('Failed to crop image');
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Dropzone Area */}
      <div 
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {isDragActive ? 'Drop files here' : 'Drag & drop images, or click to select'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          (JPEG, PNG, WEBP, max 5MB each, more than 3 images required)
        </p>
      </div>

      {/* Progress Bar */}
      {loading && (
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Uploading... {progress}%
          </p>
        </div>
      )}

      {/* Preview Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {files.map((file, index) => (
          <div key={file.preview} className="relative group">
            <img
              src={file.preview}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => openCropModal(index)}
                className="text-white bg-blue-600 px-3 py-1 rounded-md text-sm mr-1"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteImage(index)}
                className="text-white bg-red-600 px-3 py-1 rounded-md text-sm"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
            {file.cropped && (
              <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                Cropped
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Upload Button 
        disabled={loading || files.length !== 5}*/}
      <button
        onClick={uploadFiles}
        disabled={loading || files.length == 0}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {loading ? 'Uploading...' : 'Upload Images'}
      </button>
      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Crop Modal */}
      <Dialog
        open={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold">
                Crop Image
              </Dialog.Title>
              <button
                onClick={() => setCropModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {editingIndex !== null && (
              <div className="relative">
                <Cropper
                  src={files[editingIndex]?.preview}
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  ruleOfThirds
                  className="max-h-[60vh]"
                  aspect={1}
                >
                  <img
                    ref={imageRef}
                    src={files[editingIndex]?.preview}
                    alt="Crop preview"
                    style={{ maxWidth: '100%' }}
                  />
                </Cropper>
              </div>
            )}
            
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setCropModalOpen(false)}
                className="px-4 py-2 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCrop}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save Crop
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Upload Results */}

      {uploadedUrls !== undefined && uploadedUrls.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Uploaded Images:</h3>
          <div className="grid grid-cols-2 gap-4">
            {uploadedUrls.map((url) => (
              <img
                key={url.public_id}
                src={url.secure_url}
                alt="Uploaded"
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { ImageUploader };