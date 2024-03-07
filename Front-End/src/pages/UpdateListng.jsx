import React, { useEffect, useState } from "react";
import { app } from "../fireBase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const UpdateListng = () => {
  const [file, setFile] = useState([]);
  const [imageUrl, setimageUrl] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState();
  const [parking, setParking] = useState(false);
  const [furnished, setfurnished] = useState(false);
  const [offer, setOffer] = useState(false);
  const [bedrooms, setBeds] = useState();
  const [bathrooms, setBath] = useState();
  const [regularPrice, setRegularPrice] = useState();
  const [discountedPrice, setDiscountedPrice] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const params = useParams();

  const navigate = useNavigate();
  const id = params.id;
  const localData = JSON.parse(localStorage.getItem("user"));

  // fetching the listing here
  const fetchListing = async () => {
    try {
      const { data } = await axios.get(`/api/listing/get/${id}`);
      if (data.success == false)
        return toast.error(data?.message, { position: "top-center" });

      if (data.success == true) {
        setAddress(data?.listing?.address);
        setDescription(data?.listing?.description);
        setName(data?.listing?.name);
        setDiscountedPrice(data?.listing?.discountedPrice);
        setRegularPrice(data?.listing?.regularPrice);
        setimageUrl(data?.listing?.imageUrl);
        setType(data?.listing?.type);
        setParking(data?.listing?.parking);
        setfurnished(data?.listing?.furnished);
        setOffer(data?.listing?.offer);
        setBath(data?.listing?.bathrooms);
        setBeds(data?.listing?.bedrooms);
      }
    } catch (error) {
      toast.error("something went wrong while fetching listing", {
        position: "top-center",
      });
    }
  };

  const handleImageSubmit = (e) => {
    if (file.length > 0 && file.length < 7) {
      setUploading(true);
      const promises = [];

      for (let i = 0; i < file.length; i++) {
        promises.push(storeImage(file[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setimageUrl(urls);
          setUploading(false);
        })
        .catch((error) => {
          setUploading(false);
          toast.error("Image upload failed", { position: "top-center" });
        });
    } else {
      setUploading(false);
      toast.error("You cannot upload images upto 6 ", {
        position: "top-center",
      });
    }
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storege = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storege, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`file upload is ${progress}done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((dwonloadURL) => {
            resolve(dwonloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const { data } = await axios.put(
        `/api/listing/update/${id}`,
        {
          address,
          description,
          name,
          discountedPrice,
          regularPrice,
          imageUrl,
          type,
          parking,
          furnished,
          offer,
          bathrooms,
          bedrooms,
        },
        {
          headers: {
            Authorization: localData?.token,
          },
        }
      );
      if (data?.success === false) {
        toast.error(data?.message, { position: "top-center" });
        setLoading(false);
        return;
      }

      if (data?.success === true) {
        toast.success(data?.message, { position: "top-center" });
        setLoading(false);
        navigate(`/listing/${data?.updateListing?._id}`);
        return;
      }
    } catch (error) {
      toast.error("something went wrong while updating listing", {
        position: "top-center",
      });
      setLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchListing();
  }, []);
  return (
    <div className="mx-auto p-3 max-w-4xl">
      <h1 className="font-bold text-center text-3xl my-5">Create A Listing</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row w-full gap-4"
      >
        <div className="flex flex-col gap-4 w-full flex-1">
          <input
            type="text"
            placeholder="Name"
            className="p-3 rounded-md"
            maxLength="66"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            rows="3"
            className="p-1 rounded-md"
            placeholder="Description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            className="p-3 rounded-md"
            maxLength="66"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {/* checkbox input  */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="radio"
                name="type"
                className="cursor-pointer w-5"
                id="sell"
                value="sell"
                onChange={(e) => setType(e.target.value)}
                checked={type == "sell"}
              />
              <label htmlFor="sell" className="cursor-pointer">
                Sell
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="type"
                className="cursor-pointer w-5"
                id="rent"
                value="rent"
                onChange={(e) => setType(e.target.value)}
                checked={type == "rent"}
              />
              <label htmlFor="rent" className="cursor-pointer">
                Rent
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name=""
                className="cursor-pointer w-5"
                id="parking"
                onChange={() => setParking(!parking)}
                checked={parking}
              />
              <label htmlFor="parking" className="cursor-pointer">
                Parking Sopt
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name=""
                className="cursor-pointer w-5"
                id="furnished"
                onChange={() => setfurnished(!furnished)}
                checked={furnished}
              />
              <label htmlFor="furnished" className="cursor-pointer">
                Furnished
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name=""
                className="cursor-pointer w-5"
                id="offer"
                onChange={() => setOffer(!offer)}
                checked={offer}
              />
              <label htmlFor="offer" className="cursor-pointer">
                Offer
              </label>
            </div>
          </div>
          {/* number inputs  */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-1 items-center ">
              <input
                type="number"
                name=""
                id="beds"
                required
                className="w-16 p-3 rounded-md "
                min="1"
                max="10"
                placeholder="0"
                value={bedrooms}
                onChange={(e) => setBeds(e.target.value)}
              />
              <label htmlFor="beds" className="cursor-pointer">
                Beds
              </label>
            </div>
            <div className="flex gap-1 items-center ">
              <input
                type="number"
                name=""
                id="bath"
                required
                className="w-16 p-3 rounded-md "
                min={1}
                max={10}
                placeholder="0"
                value={bathrooms}
                onChange={(e) => setBath(e.target.value)}
              />
              <label htmlFor="bath" className="cursor-pointer">
                Baths
              </label>
            </div>
            <div className="flex gap-1 items-center ">
              <input
                type="number"
                name=""
                id="regularPrice"
                required
                className="w-16 p-3 rounded-md "
                min={1}
                placeholder="0"
                value={regularPrice}
                onChange={(e) => setRegularPrice(e.target.value)}
              />
              <label
                htmlFor="regularPrice"
                className="cursor-pointer flex flex-col items-center"
              >
                Regular Price
                <span className="text-xs">($ / month)</span>
              </label>
            </div>
            {offer ? (
              <div className="flex gap-1 items-center ">
                <input
                  type="number"
                  name=""
                  id="discountedPrice"
                  required
                  className="w-16 p-3 rounded-md "
                  min={1}
                  placeholder="0"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                />
                <label
                  htmlFor="discountedPrice"
                  className="cursor-pointer flex flex-col items-center"
                >
                  Discounted Price
                  <span className="text-xs">($ / month)</span>
                </label>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        {/* image upload  */}
        <div className="flex flex-col flex-1 gap-3">
          <div className="font-semibold">
            Images:
            <span className="font-normal text-red-600">
              First image will be cover (max 6)
            </span>
          </div>
          <div className="flex items-center gap-2 ">
            <input
              type="file"
              accept="image/*"
              multiple
              className="border p-3 border-gray-300 rounded-md w-full"
              onChange={(e) => setFile(e.target.files)}
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded-md  hover:shadow-lg uppercase disabled:opacity-50"
            >
              {uploading ? "Uploading... " : "upload"}
            </button>
          </div>
          <button
            disabled={loading || uploading}
            className="bg-slate-700 text-white uppercase p-3 rounded-md  hover:bg-slate-900 "
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {imageUrl?.map((url, index) => (
            <img
              key={url}
              src={url}
              alt=""
              className="w-40 h-40 object-contain rounded-md"
            />
          ))}
        </div>
      </form>
    </div>
  );
};

export default UpdateListng;
