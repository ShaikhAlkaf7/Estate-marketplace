import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";

const Search = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const { data } = await axios.get(`/api/listing/get?${searchQuery}`);
        setListing(data?.listings);
        if (data?.listings?.length > 8) {
          setShowMore(true);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[0] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const urlParams = new URLSearchParams();
      urlParams.set("searchTerm", sidebarData.searchTerm);
      urlParams.set("type", sidebarData.type);
      urlParams.set("parking", sidebarData.parking);
      urlParams.set("furnished", sidebarData.furnished);
      urlParams.set("offer", sidebarData.offer);
      urlParams.set("sort", sidebarData.sort);
      urlParams.set("order", sidebarData.order);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    } catch (error) {
      console.log(error);
    }
  };

  const onshowMoreClick = async () => {
    try {
      const numberOfListings = listing.length;
      const startIndex = numberOfListings;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", startIndex);
      const searchQuery = urlParams.toString();
      const { data } = await axios.get(`/api/listing/get?${searchQuery}`);
      console.log(data.listings);
      if (data?.listings?.length < 9) {
        setShowMore(false);
      }
      setListing([...listing, ...data?.listings]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col md:flex-row">
      <button
        className="text-left mx-2 font-semibold md:hidden"
        onClick={() => setFilter(!filter)}
      >
        {filter ? "X" : "Filters"}
      </button>
      <div
        className={`p-7 border-b-2 md:border-r-2 border-slate-300 md:h-screen md:block md:w-[40%] w-full ${
          filter ? "block" : "hidden"
        }`}
      >
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label htmlFor="searchTerm" className="whitespace-nowrap">
              Search Term :
            </label>
            <input
              type="text"
              id="searchTerm"
              className="w-full p-3 my-1 rounded-md border "
              placeholder="Search . . . "
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <label>Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5 cursor-pointer"
                id="all"
                checked={sidebarData.type === "all"}
                onChange={handleChange}
              />
              <label htmlFor="all" className="cursor-pointer">
                Rent & Sale
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5 cursor-pointer"
                id="rent"
                checked={sidebarData.type === "rent"}
                onChange={handleChange}
              />
              <label htmlFor="rent" className="cursor-pointer">
                Rent
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5 cursor-pointer"
                id="sale"
                checked={sidebarData.type === "sale"}
                onChange={handleChange}
              />
              <label htmlFor="sale" className="cursor-pointer">
                Sale
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5 cursor-pointer"
                id="offer"
                checked={sidebarData.offer}
                onChange={handleChange}
              />
              <label htmlFor="offer" className="cursor-pointer">
                Offer
              </label>
            </div>
          </div>
          {/* second   */}

          <div className="flex gap-2 items-center flex-wrap">
            <label>Facilities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5 cursor-pointer"
                id="parking"
                checked={sidebarData.parking}
                onChange={handleChange}
              />
              <label htmlFor="parking" className="cursor-pointer">
                Parking
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5 cursor-pointer"
                id="furnished"
                checked={sidebarData.furnished}
                onChange={handleChange}
              />
              <label htmlFor="furnished" className="cursor-pointer">
                Furnished
              </label>
            </div>
          </div>

          {/* sorting  */}
          <div className="flex items-center gap-2">
            <p>Sort :</p>
            <select
              id="sort_order"
              className="border rounded-md p-2"
              defaultValue={"created_at_desc"}
              onChange={handleChange}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white rounded-md uppercase hover:bg-slate-900 p-3 my-2">
            Search
          </button>
        </form>
      </div>
      <div className="flex items-center flex-col">
        <h1 className="font-semibold text-2xl text-center my-4">
          Searching Results
        </h1>
        <div className="flex justify-center gap-4 flex-wrap  ">
          {loading ? (
            <p className="text-xl text-black font-semibold text-center">
              Loading...
            </p>
          ) : listing.length === 0 ? (
            <p className="text-xl text-black font-semibold text-center">
              No listing Found !
            </p>
          ) : (
            ""
          )}
          {listing &&
            listing?.map((list) => <Card key={list._id} list={list} />)}
        </div>
        {listing.length > 0 && showMore ? (
          <button
            onClick={onshowMoreClick}
            className="text-green-700 hover:underline mb-4"
          >
            Show More
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Search;
