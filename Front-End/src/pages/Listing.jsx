import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";
const Listing = () => {
  const [listing, setListing] = useState();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  SwiperCore.use([Navigation]);
  const localData = JSON.parse(localStorage.getItem("user"));
  const id = params.id;
  const fetchListing = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/listing/get/${id}`);
      console.log(data);
      if (data.success == false)
        return toast.error(data?.message, { position: "top-center" });
      setLoading(false);
      setListing(data?.listing);
    } catch (error) {
      toast.error("something went wrong while fetching listing", {
        position: "top-center",
      });
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchListing();
  }, []);
  return (
    <main>
      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          {" "}
          <PulseLoader />{" "}
        </div>
      ) : (
        ""
      )}
      <Swiper navigation>
        {listing?.imageUrl?.map((url) => (
          <SwiperSlide key={url}>
            <img src={url} alt="" className="h-[50vh] w-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer ">
        <FaShare
          className="text-slate-500"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
        />
      </div>
      {copied && (
        <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
          Link copied!
        </p>
      )}
      <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4 ">
        <p className="text-2xl font-semibold">
          {listing?.name} &#8377;{" "}
          {listing?.offer
            ? listing?.discountedPrice.toLocaleString("en-IN")
            : listing?.regularPrice.toLocaleString("en-IN")}
          {listing?.type === "rent" && " / month"}
        </p>
        <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm my-2">
          <FaMapMarkerAlt className="text-green-700" />
          {listing?.address}
        </p>
        <div className="flex gap-4">
          <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
            {listing?.type === "rent" ? "For Rent" : "For Sale"}
          </p>
          {listing?.offer && (
            <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
              &#8377;{+listing?.regularPrice - +listing?.discountedPrice}
            </p>
          )}
        </div>
        <p>
          <span className="text-slate-900 font-semibold ">Description - </span>
          {listing?.description}
        </p>
        <ul className="text-green-900 whitespace-nowrap text-sm flex  flex-wrap items-center gap-4 ">
          <li className="flex items-center gap-1 font-semibold ">
            <FaBed className="text-xl" />
            {listing?.bedrooms > 1
              ? `${listing?.bedrooms} beds`
              : `${listing?.bedrooms} bed`}
          </li>
          <li className="flex items-center gap-1 font-semibold ">
            <FaBath className="text-xl" />
            {listing?.bathrooms > 1
              ? `${listing?.bathrooms} bathrooms`
              : `${listing?.bathrooms} bathroom`}
          </li>
          <li className="flex items-center gap-1 font-semibold ">
            <FaParking className="text-xl" />
            {listing?.parking ? "Parking" : "No Parking"}
          </li>
          <li className="flex items-center gap-1 font-semibold ">
            <FaChair className="text-xl" />
            {listing?.furnished ? "Furnished" : "No Furnished"}
          </li>
        </ul>

        {localData?.user?._id !== listing?.userRef &&
        localData?.token &&
        !contact ? (
          <button
            onClick={() => setContact(true)}
            className="bg-slate-700 text-white rounded-md uppercase hover:bg-slate-900 p-3 my-2"
          >
            contact landloard
          </button>
        ) : (
          ""
        )}
        {contact ? <Contact listing={listing} /> : ""}
      </div>
    </main>
  );
};

export default Listing;
