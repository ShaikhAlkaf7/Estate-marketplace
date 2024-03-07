import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { SwiperSlide, Swiper } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import Card from "../components/Card";
const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const { data } = await axios.get("/api/listing/get?offer=true&limit=4");
        setOfferListings(data?.listings);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const { data } = await axios.get("/api/listing/get?type=rent&limit=4");
        setRentListings(data?.listings);
        fetchSaleListing();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListing = async () => {
      try {
        const { data } = await axios.get("/api/listing/get?type=sale&limit=4");
        setSaleListings(data?.listings);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
    console.log(saleListings);
  }, []);
  return (
    <div>
      {/* top */}

      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl m-auto ">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">Perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Estate -Mate will help you find your home fast, easy and comfertable.{" "}
          <br /> Our expert support support are always avalable
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's Start now...
        </Link>
      </div>

      {/* middle */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <img
                src={listing?.imageUrl[0]}
                alt=""
                className="h-[500px] object-cover w-full"
              />
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing  */}
      <div className="flex flex-col gap-8 mx-auto w-[90%] my-10">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="flex justify-center flex-col">
              <h2 className="text-2xl  font-semibold text-slate-600">
                Rcent Offers
              </h2>
              <Link
                to={"/search?offer=true"}
                className="text-sm text-blue-800 hover:underline"
              >
                Show more offer
              </Link>

              <div className="flex flex-wrap gap-4 ">
                {offerListings.map((list) => (
                  <Card list={list} key={list._id} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8 mx-auto w-[90%] my-10">
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="flex justify-center flex-col">
              <h2 className="text-2xl  font-semibold text-slate-600">
                Rcent Places for rent
              </h2>
              <Link
                to={"/search?type=rent"}
                className="text-sm text-blue-800 hover:underline"
              >
                Show more places for rent
              </Link>

              <div className="flex flex-wrap gap-4 ">
                {rentListings.map((list) => (
                  <Card list={list} key={list._id} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8 mx-auto w-[90%] my-10">
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="flex justify-center flex-col">
              <h2 className="text-2xl  font-semibold text-slate-600">
                Rcent Places for sale
              </h2>
              <Link
                to={"/search?type=sale"}
                className="text-sm text-blue-800 hover:underline"
              >
                Show more places for sale
              </Link>

              <div className="flex flex-wrap gap-4 ">
                {saleListings.map((list) => (
                  <Card list={list} key={list._id} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
