import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders`).then((res) => {
        console.log("Orders data:", res.data); // ✅ Debugging line
        return res.data;
      }),
  });

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.seller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  return (
    <div className="orders">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Orders</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No completed orders found.
                  </td>
                </tr>
              )}

              {Array.isArray(data) &&
                data.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <img className="image" src={order.img} alt="" />
                    </td>
                    <td>{order.title}</td>
                    <td>{order.price}</td>
                    <td>
                      <img
                        className="message"
                        src="./img/message.png"
                        alt=""
                        onClick={() => handleContact(order)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
