import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", sort], // include sort to auto-refetch on change
    queryFn: () => {
      const min = minRef.current?.value || "";
      const max = maxRef.current?.value || "";
      const queryString = `/gigs${search ? search + '&' : '?'}min=${min}&max=${max}&sort=${sort}`;

      console.log("Fetching:", queryString); // Optional debug
      return newRequest.get(queryString).then(res => {
        return Array.isArray(res.data) ? res.data : [];
      });
    },
    enabled: false, // disable auto-fetch
  });



  console.log(data);

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  const apply = () => {
    refetch();
  };

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">
          SkillHatch &gt; Graphics &amp; Design &gt;
        </span>

        <h1>AI Artists</h1>
        <p>
          Explore the boundaries of art and technology with Liverr's AI artists
        </p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
                <span onClick={() => reSort("sales")}>Popular</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
  {isLoading
    ? "loading"
    : error
    ? "Something went wrong!"
    : Array.isArray(data)
    ? data.map((gig) => <GigCard key={gig._id} item={gig} />)
    : "No gigs found"}
</div>
      </div>
    </div>
  );
}

export default Gigs;