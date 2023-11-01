import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const FrontPage = () => {
  const [imgUrl, setImgUrl] = useState(null);

  if (imgUrl != null) {
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
            console.log(res.data);
            if (res.data.insertedId) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500,
              });
              setImgUrl("");
              return;
            }
          });
        }
      });
  }

  // fetch("http://localhost:5000/postPhoto", {
  //   method: "post",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(image),
  // })
  //   .then((res) => res.json())
  //   .then((data) => console.log(data));

  return (
    <div>
      <div className="h-[95vh] bg-white rounded-md mt-[15px] flex items-center justify-center ">
        <div>
          <form
            onClick={() => document.querySelector(".input-field").click()}
            className="border-dotted border-2 border-black p-[30px]  rounded-md cursor-pointer"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1160/1160358.png"
              className="mx-auto w-[20px] h-[20px] object-scale-down"
              alt=""
            />
            <h4 className="text-center">Add Images</h4>
            <input
              type="file"
              onChange={(e) => setImgUrl(e.target.files[0])}
              className="input-field hidden"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
