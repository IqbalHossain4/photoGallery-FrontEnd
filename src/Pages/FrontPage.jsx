import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useTotalImg from "../Hook/useTotalImg";
import { BiSolidCheckboxChecked, BiTrash } from "react-icons/bi";
const FrontPage = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const [isImagePosted, setIsImagePosted] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [images, setImages] = useState([]);
  const [totalImg, refetch] = useTotalImg();

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

          axios.post("http://localhost:5000/postPhoto", image).then((res) => {
            if (res.data.insertedId) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500,
              });
              setImgUrl(null);
              setIsImagePosted(false);
              refetch();
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
            .delete(`http://localhost:5000/deletePhotos/${itemId}`)
            .then((res) => {
              console.log(res.data);
            });
        });
        refetch();
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
        <div className="min-h-[80vh] w-full bg-white p-[25px] shadow-md">
          <div className=" flex items-center justify-between">
            <div>
              {selectedItems.length > 0 ? (
                <div className="flex items-center gap-[15px]">
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

          <div className="mt-[40px] flex items-center justify-center  ">
            <div className="grid-1">
              {images.map((img, index) => (
                <div
                  key={img._id}
                  className="photosBox w-[200px] h-[200px] p-[30px]  overflow-hidden flex items-center justify-center shadow-xl"
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
                    } `}
                  >
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange(img._id)}
                      checked={selectedItems.includes(img._id)}
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
                className="border-dotted border-2 border-black p-[10px]  rounded-md cursor-pointer md:w-[200px] md:h-[200px] flex items-center justify-center"
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
                  onChange={(e) => setImgUrl(e.target.files[0])}
                  className="input-field hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
