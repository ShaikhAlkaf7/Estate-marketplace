import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { PropagateLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/userSlice";
import { MdLineStyle, MdOutlineDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const Profile = () => {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localData = JSON.parse(localStorage.getItem("user"));
  // updating the profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put(
        "/api/user/update/profile",
        { userName, email, password },
        {
          headers: {
            Authorization: localData?.token,
          },
        }
      );
      console.log(data?.user?.userName);
      if (data?.success == true) {
        setLoading(false);
        toast.success("Update successfully", {
          position: "top-center",
        });
        const userData = JSON.parse(localStorage.getItem("user"));
        userData.user.userName = data?.user?.userName;
        userData.user.email = data?.user?.email;
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/");
        return;
      }

      if (data?.success == false) {
        setLoading(false);
        toast.error(data?.message, {
          position: "top-center",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message, { position: "top-center" });
      setLoading(false);
    }
  };

  // handle delete profile
  const handleDelete = async () => {
    try {
      const confirmation = prompt(`Please confirm to type "DELETE" `);
      if (confirmation === "DELETE") {
        const { data } = await axios.delete("/api/user/delete-profile", {
          headers: {
            Authorization: currentUser?.token,
          },
        });
        localStorage.removeItem("user");
        dispatch(signInSuccess(null));
        toast.success(data.message, {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("something went wrong while delete the accout");
    }
  };

  // handlse signout user
  const handleSignOut = async () => {
    try {
      localStorage.removeItem("user");
      dispatch(signInSuccess(null));
      toast.success("Sign-Out Successfully", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Somthing went wrong while sign-out");
    }
  };

  // fetching listings
  const handleShowListings = async () => {
    try {
      const { data } = await axios.get("/api/user/listings", {
        headers: {
          Authorization: localData?.token,
        },
      });
      if (data?.success === true) {
        setListings(data?.listings);
        toast.success("Listings fetch successfully", {
          position: "top-center",
        });
      }

      if (data?.success === false) {
        toast.error("Listings fetch failed", { position: "top-center" });
      }
    } catch (error) {
      toast.error("Somthing went wrong while fetching Listings");
      console.log(error);
    }
  };

  // handle listing delete l
  const handleListingDelete = async (listingId) => {
    try {
      const { data } = await axios.delete(`/api/listing/delete/${listingId}`, {
        headers: {
          Authorization: localData?.token,
        },
      });
      if (data?.success == true) {
        setListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
        toast.success(data.message, { position: "top-center" });
      }
      if (data?.success == false) {
        toast.error(data.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error("Somethig went wrong while deleting listing", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    setUsername(currentUser?.user?.userName);
    setEmail(currentUser?.user?.email);
  }, []);
  return (
    <div className="m-auto  w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%]  p-3">
      <h1 className="font-semibold text-3xl my-5 text-center">Profile</h1>
      <form className="flex flex-col gap-4 sm:px-5 " onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full p-2 rounded-md"
          placeholder="username"
          required
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          className="w-full p-2 rounded-md"
          placeholder="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-slate-900 text-white uppercase p-3 rounded-md  hover:scale-95 "
        >
          {loading == true ? (
            <PropagateLoader color="white" className="pb-3" />
          ) : (
            "update"
          )}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-900 text-white uppercase p-3 rounded-md  hover:bg-green-700 text-center "
        >
          {" "}
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mx-5 mt-2 text-red-600 font-semibold">
        <button onClick={handleDelete}>Delete Account </button>{" "}
        <button onClick={handleSignOut}>Sign out</button>
      </div>
      <button
        className="text-center w-full text-indigo-700 font-semibold border "
        onClick={handleShowListings}
      >
        Show Listings
      </button>
      <div className="w-[90%] m-auto">
        {listings?.map((list) => (
          <div
            className="flex items-center justify-between hover:shadow-lg my-1"
            key={list?._id}
          >
            <img src={list?.imageUrl[0]} className="w-20 h-20 object-contain" />
            <Link
              className="font-semibold hover:underline"
              to={`/listing/${list._id}`}
            >
              {list?.name}
            </Link>
            <div className="flex items-center gap-2 ">
              <button
                onClick={() => navigate(`/update-listing/${list._id}`)}
                className="uppercase text-xl text-green-800 hover:text-green-600"
              >
                <FaRegEdit />
              </button>
              <button
                onClick={() => handleListingDelete(list._id)}
                className="uppercase text-xl text-red-800 hover:text-red-600"
              >
                <MdOutlineDeleteOutline />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
