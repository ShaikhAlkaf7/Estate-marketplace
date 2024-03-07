import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landloard, setLandloard] = useState();
  const [message, setMessage] = useState("");
  const localData = JSON.parse(localStorage.getItem("user"));
  // console.log(landloard);
  const fetchLandloard = async () => {
    try {
      const { data } = await axios.get(`/api/user/65c359726d895c8c47a603a3`, {
        headers: {
          Authorization: localData?.token,
        },
      });
      setLandloard(data);
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
      console.log(error);
    }
  };
  useEffect(() => {
    fetchLandloard();
  }, [listing?.userRef]);
  return (
    <>
      {landloard && (
        <div className="flex flex-col gap-2 ">
          <p>
            Contact - <span>{landloard?.user?.userName}</span>{" "}
            <span className="font-semibold">for </span>
            <span>{listing?.name?.toLowerCase()}</span>
          </p>
          <textarea
            rows="2"
            className="w-full rounded-md p-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
          />
          <Link
            className="bg-slate-700 text-white text-center rounded-md uppercase hover:bg-slate-900 p-3 my-2"
            to={`mailto:${landloard?.user?.email}?subject = Regarding ${listing?.name}$body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
