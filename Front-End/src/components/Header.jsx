import React, { useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const url = new URLSearchParams(window.location.search);
      url.set("searchTerm", searchTerm);
      const searchQuery = url.toString();
      navigate(`/search?${searchQuery}`);
    } catch (error) {}
  };
  useEffect(() => {
    const url = new URLSearchParams(location.search);
    const searchTermFormUrl = url.get("searchTerm");
    if (searchTermFormUrl) {
      setSearchTerm(searchTermFormUrl);
    }
  }, [location.search]);
  return (
    <header className="flex bg-slate-300 px-1 py-3 justify-between items-center  sm:px-10">
      {/* the logo or home link */}
      <Link to={"/"}>
        <h1 className="font-semibold text-sm sm:text-2xl flex flex-wrap">
          <span className="text-slate-500">Estate</span>
          <span className="text-slate-700">-Mate</span>
        </h1>
      </Link>

      {/* form for input search function  */}
      <form
        className="bg-white rounded-md flex items-center px-1 w-32  sm:w-60"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Search..."
          className="p-1 rounded-md outline-none w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>
          <RiSearchLine />
        </button>
      </form>

      {/* now we start navigatio */}
      <div className="flex items-center gap-5">
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            `${
              isActive
                ? "underline hidden sm:inline text-black font-semibold"
                : "font-medium hover:underline text-gray-600  hidden sm:inline hover:text-black transition duration-200 ease-in-out"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to={"/about"}
          className={({ isActive }) =>
            `${
              isActive
                ? "underline text-black font-semibold hidden sm:inline"
                : "font-medium hover:underline text-gray-600  hover:text-black transition duration-200 ease-in-out hidden sm:inline"
            }`
          }
        >
          About
        </NavLink>
        {currentUser?.token ? (
          <NavLink
            to={"/profile"}
            className="uppercase h-10 w-10 flex items-center justify-center font-semibold text-xl rounded-full bg-black text-white"
          >
            {currentUser?.user?.userName[0]}
          </NavLink>
        ) : (
          <NavLink
            to={"/sign-in"}
            className={({ isActive }) =>
              `${
                isActive
                  ? "underline text-black font-semibold"
                  : "font-medium hover:underline text-gray-600  hover:text-black transition duration-200 ease-in-out"
              }`
            }
          >
            Sign In
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
