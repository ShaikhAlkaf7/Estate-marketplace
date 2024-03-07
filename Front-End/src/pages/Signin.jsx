import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { PropagateLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/userSlice";

const Signin = () => {
  // creating state for holding input data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // submiting user data into db
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/signin", {
        email,
        password,
      });
      if (data?.success == true) {
        setLoading(false);
        toast.success("Sign In successfully", {
          position: "top-center",
        });
        localStorage.setItem("user", JSON.stringify(data));
        const userData = localStorage.getItem("user");
        dispatch(signInSuccess(JSON.parse(userData)));
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
  return (
    <div className="m-auto  w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%]  p-3">
      <h1 className="font-semibold text-3xl my-5 text-center">Sign Up</h1>
      <form className="flex flex-col gap-4 px-5 " onSubmit={handleSubmit}>
        <input
          type="email"
          className="w-full p-2 rounded-md"
          placeholder="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 rounded-md"
          placeholder="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-slate-900 text-white uppercase p-3 rounded-md  hover:scale-95 "
        >
          {loading == true ? (
            <PropagateLoader color="white" className="pb-3" />
          ) : (
            "  sign In"
          )}
        </button>
        <div className="text-sm sm:text-sm">
          Don't have an account ?
          <span>
            <Link to={"/sign-up"} className="p-1 text-blue-600 font-semibold">
              Sign Up
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Signin;
