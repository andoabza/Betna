import { useEffect, useRef } from "react";

const CloudinaryWidget = ({ onUpload }) => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();
    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget(
            {
                cloudName: 'dkmbqimlp',
                uploadPreset: 'ml_default',
                sources: ['local', 'url', 'camera'],
                multiple: true,
                showAdvancedOptions: true,
                cropping: true,
                croppingCoordinatesMode: 'custom',
                defaultSource: 'local',
                styles: {
                    palette: {
                        window: '#FFFFFF',
                        windowBorder: '#90A4AE',
                        tabIcon: '#F02C2D',
                        menuIcons: '#5A616A',
                        textDark: '#000000',
                        textLight: '#FFFFFF',
                        link: '#8B10E0',
                        action: '#FF6200E0',
                        inProgress: '#FF6200E0',
                        complete: '#20BDAF',
                        error: '#F02C2D',
                        inactiveTabIcon: '#F02C2D'
                    }
                }
            },
            (error, result) => {
                if (!error && result && result.event === 'success') {
                    onUpload(result.info);
                }
            }
        );
    
        document.getElementById('upload-button').addEventListener('click', () => {
        widgetRef.current.open();
        });
    }, [onUpload]);  

    
  return (
    <button
      id="upload-button"
      type="button"
      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 transition-colors"
    >
      Click to Upload Images
    </button>
  );
};
export { CloudinaryWidget };