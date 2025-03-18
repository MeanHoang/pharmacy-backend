// // src/config/cloud.config.ts

// import { v2 as cloudinary } from 'cloudinary'; // Import Cloudinary v2
// import * as multerStorageCloudinary from 'multer-storage-cloudinary'; // Import multer-storage-cloudinary
// import { StorageEngine } from 'multer'; // Đảm bảo sử dụng đúng kiểu StorageEngine của multer

// // Cấu hình Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Dữ liệu này bạn cần lấy từ Cloudinary account của mình
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Sử dụng multer-storage-cloudinary để cấu hình Multer
// // const storage: StorageEngine = multerStorageCloudinary({
// //   cloudinary: cloudinary, // Truyền đối tượng cloudinary vào đây
// //   params: {
// //     folder: 'your-folder-name', // Thư mục lưu ảnh trên Cloudinary
// //     allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Các định dạng ảnh được phép tải lên
// //   },
// // });

// export const multerCloudConfig = {
//   storage: storage, // Gán cấu hình storage cho Multer
// };
