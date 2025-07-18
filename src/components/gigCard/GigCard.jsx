import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import newRequest from "../../utils/newRequest"; // adjust path if needed

const GigCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => res.data),
  });

//  console.log("GigCard userId:", item.userId);
//  console.log("React Query error:", error);
//  console.log("React Query data:", data);


//  console.log("GigCard userId:", item.userId);

  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="gigCard">
        <img src={item.cover} alt="" />
        <div className="info">
          {isLoading && <span>Loading...</span>}
          {error && <span>Something went wrong!</span>}
          {!isLoading && !error && data && (
            <div className="user">
              <img src={data.img || "/img/noavatar.jpg"} alt="" />
              <span>{data.username || "Unknown"}</span>
            </div>
          )}

          <p>{item.desc}</p>
          <div className="star">
            <img src="./img/star.png" alt="" />
            <span>
              {!isNaN(item.totalStars / item.starNumber) &&
                Math.round(item.totalStars / item.starNumber)}
            </span>
          </div>
        </div>

        <hr />
        <div className="detail">
          <img src="./img/heart.png" alt="" />
          <div className="price">
            <span>STARTING AT</span>
            <h2>$ {item.price}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;