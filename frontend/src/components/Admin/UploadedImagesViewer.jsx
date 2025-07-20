import { useState } from "react";

export default function UploadedImagesViewer({ uploadedImages = [] }) {
  const [previewImg, setPreviewImg] = useState(null);
  console.log("Uploaded images:", uploadedImages);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">

      {uploadedImages.map((imgUrl, index) => (
        <img
          key={index}
          src={imgUrl} 
          onClick={() => setPreviewImg(imgUrl)}
          alt={`Ảnh ${index + 1}`}
          className="cursor-pointer rounded object-cover h-24 w-full border hover:scale-105 transition"
        />
      ))}

        {/* {uploadedImages.map((imgPath, index) => {
          const fixedPath = imgPath.replace(/\\/g, '/');
          const fullUrl = `${import.meta.env.VITE_API_BASE_URL}/${fixedPath}`;
          return (
            <img
              key={index}
              src={fullUrl}
              onClick={() => setPreviewImg(fullUrl)}
              alt={`Ảnh ${index + 1}`}
              className="cursor-pointer rounded object-cover h-24 w-full border hover:scale-105 transition"
            />
          );
        })} */}
      </div>

      {/* Modal xem ảnh */}
      {previewImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setPreviewImg(null)}
        >
          <img
            src={previewImg}
            alt="Xem ảnh"
            className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
