import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/authContext';
import { ImageUploader } from './Uploader';

const HouseForm = () => {const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { list, error } = useAuth();
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [price, setPrice] = useState('');
  const [room, setRoom] = useState('');

  const handlePrice = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPrice(value);
  };

  const handleRoom = (e) => {
    const roomValue = e.target.value.replace(/\D/g, "");
    setRoom(roomValue);
  };
  useEffect(() => {
    setValue("price", price);
  }, [price, setValue]);

  useEffect(() => {
    setValue("numberOfRooms", room);
  }, [room, setValue]);

  const onSubmit = async (data) => {
    // if (images && images.length !== 5) {
    //   setFormError('Exactly 5 images are required');
    //   return;
    // }

      setIsSubmitting(true);
      const formData = {
        ...data,
        houseType: data.houseType,
        price: Number(data.price),
        numberOfRooms: Number(data.numberOfRooms),
        image: images.map(img => ({ url: img }))
      };
      images.map(img => console.log(img));
      await list(formData);
      setImages([]);
      setUploaderKey(prev => prev + 1);
      setIsSubmitting(false);
    };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Your Property</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
          placeholder='Titl of The House'
            {...register("title", { required: "Title is required" })}
            className={`w-full p-3 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
          placeholder='Address of the House'
            {...register("address", { required: "Address is required" })}
            className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
            maxLength={7}
              type="string"
              placeholder='Price of the House/month'
              {...register("price", { 
                required: "Price is required",
                min: { value: 1, message: "Price must be positive" }
              })}
              value={price}
              onChange={handlePrice}
              className={`w-full p-3 border rounded-lg ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
            <input
              type="string"
              {...register("numberOfRooms", { 
                required: "Number of rooms is required",
                min: { value: 1, message: "Must have at least 1 room" }
              })}
              value={room}
              onChange={handleRoom}
              maxLength={1}
              placeholder='Rooms'
              
              className={`w-full p-3 border rounded-lg ${errors.numberOfRooms ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.numberOfRooms && <p className="text-red-500 text-sm mt-1">{errors.numberOfRooms.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">House Type</label>
          <select
            {...register("houseType", {
              required: "House Type is required"
            })}
            className={`w-full p-2 border rounded-md ${errors.houseType ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="" defaultValue={""} disabled>Select House Type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
          </select>
          {errors.houseType && <p className="text-red-500 text-sm mt-1">{errors.houseType.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            {...register("description", { 
              required: "Description is required",
              minLength: { value: 50, message: "Description must be at least 50 characters" }
            })}
            placeholder='Description of the House'
            rows="4"
            className={`w-full p-3 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Property Photos</label>
          <ImageUploader 
            key={uploaderKey}
            onUploadSuccess={setImages}
          />
          <p className="text-sm text-gray-500 mt-2">
            
            {images ? (
            images.length
            ) : (
            0
            ) 
            }/5 photos uploaded
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={isSubmitting || images.length == 0}
          
        >
          {isSubmitting ? 'Submitting...' : 'Add Property'}
        </button>
        {error && <div className="form-error">{error}</div>}
        {/* {success && <div className="text-green-600 text-center mt-4">{success}</div>} */}
      </form>
    </div>
  );
};

export { HouseForm };
