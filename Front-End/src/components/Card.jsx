import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const Card = ({ list }) => {
  return (
    <div className="shadow-md hover:shadow-2xl bg-white m-1 transition-shadow duration-200 overflow-hidden rounded-md w-full sm:w-[270px]">
      <Link to={`/listing/${list?._id}`}>
        <img
          src={list?.imageUrl[0]}
          alt=""
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transaition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {list?.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate">{list?.address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {list?.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold">
            &#8377;{" "}
            {list?.offer
              ? list?.discountedPrice?.toLocaleString("en-IN")
              : list?.regularPrice?.toLocaleString("en-IN")}
            {list?.type === "rent" && " / month"}
          </p>
          <div className="flex items-center gap-4 text-slate-700">
            <div className="font-bold text-xs">
              {list?.bedrooms > 1
                ? `${list?.bedrooms} beds`
                : `${list?.bedrooms} bed`}
            </div>
            <div className="font-bold text-xs">
              {list?.bathrooms > 1
                ? `${list?.bathrooms} baths`
                : `${list?.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
