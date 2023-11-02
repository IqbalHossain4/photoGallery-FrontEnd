import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useTotalImg from "../Hook/useTotalImg";
import { BiSolidCheckboxChecked, BiTrash } from "react-icons/bi";
const FrontPage = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const [isImagePosted, setIsImagePosted] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  let [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [totalImg, refetch] = useTotalImg();
  console.log(uploadProgress);
  // Post Images
  if (!isImagePosted && imgUrl != null) {
    setIsImagePosted(true);

    const image = imgUrl;
    const formData = new FormData();
    formData.append("image", image);
    const URL = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_imgApi
    }`;

    fetch(URL, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imageData) => {
        const img_url = imageData.data.display_url;
        if (img_url) {
          const image = {
            photo: img_url,
          };

          axios
            .post(
              "https://photo-gallery-three-gamma.vercel.app/postPhoto",
              image,
              {
                onUploadProgress: (progressEvent) => {
                  const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                  setUploadProgress(percentCompleted);
                },
              }
            )
            .then((res) => {
              if (res.data.insertedId) {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Successfully Post Your Font",
                  showConfirmButton: false,
                  timer: 1500,
                });
                refetch();
                setImgUrl(null);
                setIsImagePosted(false);
              }
            });
        }
      });
  }

  // Checked Photos
  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(itemId)) {
        return prevSelected.filter((id) => id !== itemId);
      }
      return [...prevSelected, itemId];
    });
  };

  // Delete Photo
  const handleDeleteSelected = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        selectedItems.forEach((itemId) => {
          axios
            .delete(
              `https://photo-gallery-three-gamma.vercel.app/deletePhotos/${itemId}`
            )
            .then((res) => {
              if (res.data.deletedCount > 0) {
                refetch();
              }
            });
        });
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  // Photo Drag and Drop
  useEffect(() => {
    setImages(
      totalImg.map((img, index) => ({
        ...img,
        position: index,
      }))
    );
  }, [totalImg]);
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("dragging");
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (!isNaN(draggedIndex) && draggedIndex !== index) {
      e.currentTarget.classList.add("drag-over");
    }
  };

  const handleDragEnd = () => {
    const draggedItem = document.querySelector(".dragging");
    if (draggedItem) {
      draggedItem.classList.remove("dragging");
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (!isNaN(draggedIndex) && draggedIndex !== index) {
      e.currentTarget.classList.remove("drag-over");

      const newImages = images.slice();
      const [draggedImage] = newImages.splice(draggedIndex, 1);
      newImages.splice(index, 0, draggedImage);
      const updatedImages = newImages.map((img, imgIndex) => ({
        ...img,
        position: imgIndex,
      }));
      setImages(updatedImages);
    }
  };

  return (
    <div>
      <div className="min-h-[100vh] flex items-center justify-cent rounded-md">
        <div className=" min-h-[80vh] w-full bg-[black]  p-[5px] flex items-center justify-cent">
          <div className="z-[100] min-h-[79vh] w-full bg-[#faf9f9]   p-[25px] shadow-md rounded-md ">
            <div className=" flex items-center justify-between">
              <div>
                {selectedItems.length > 0 ? (
                  <div
                    className={`${
                      selectedItems.length == 0
                        ? "hidden"
                        : "flex items-center gap-[15px] "
                    }`}
                  >
                    <span className="text-[40px] text-blue-600">
                      <BiSolidCheckboxChecked />
                    </span>
                    <h4 className="font-[600] text-[18px] text-black">
                      {selectedItems.length} Files Selected
                    </h4>
                  </div>
                ) : (
                  <h4 className="font-[600] text-[18px] text-black">Gallery</h4>
                )}
              </div>
              {selectedItems.length > 0 && (
                <div className="cursor-pointer">
                  <button
                    onClick={handleDeleteSelected}
                    className="text-red-500 text-[30px] h-[60px] w-[60px] rounded-full  shadow-md flex items-center justify-center"
                  >
                    <BiTrash />
                  </button>
                </div>
              )}
            </div>
            <hr className="mt-[15px]" />
            {/* ProgressBar */}
            {isImagePosted && (
              <div className="md:w-[500px] w-[90%] mx-auto mt-[40px] ">
                <div className="progress-bar">
                  <div
                    className="progress-bar-inner"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress > 0 && (
                      <span className="progress-label">{uploadProgress}%</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="mt-[40px] flex items-center justify-center  ">
              <div className="grid-1">
                {images.map((img, index) => (
                  <div
                    key={img._id}
                    className="photosBox bg-white rounded-md  h-[200px] p-[30px]  overflow-hidden flex items-center justify-center shadow-xl"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                    data-index={index}
                  >
                    <div
                      className={` ${
                        selectedItems.includes(img._id) ? "checked" : "checkBox"
                      } z-[100]`}
                    >
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(img._id)}
                        checked={selectedItems.includes(img._id)}
                        className="w-[20px] h-[20px]"
                      />
                    </div>

                    <div className="w-[120px] h-[120px] flex items-center justify-center">
                      <img
                        src={img.photo}
                        className="w-[100%] h-[100%] object-scale-down"
                        alt="photo"
                      />
                    </div>
                  </div>
                ))}
                {/* Image Upload */}
                <div
                  onClick={() => document.querySelector(".input-field").click()}
                  className="border-dotted border-2 border-black bg-white   rounded-md cursor-pointer h-[200px] p-[30px]  overflow-hidden flex items-center justify-center"
                >
                  <div>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1160/1160358.png"
                      className="mx-auto w-[20px] h-[20px] object-scale-down"
                      alt=""
                    />
                    <h4 className="text-center font-[600] text-black mt-[10px]">
                      Add Images
                    </h4>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImgUrl(e.target.files[0])}
                    className="input-field hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
