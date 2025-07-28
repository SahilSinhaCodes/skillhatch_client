import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
 import { useNavigate } from "react-router-dom";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
      mutationFn: (gig) => {
        return newRequest.post("/gigs", gig);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["myGigs"]);
      },
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Submitting gig:", state);

      if (!state.cat) {
        alert("Please select a category.");
        return;
      }

      mutation.mutate(state);
       navigate("/mygigs")
    };

    return (
      <div className="add">
        <div className="container">
          <h1>Add New Gig</h1>
          <div className="sections">
            {/* Wrap this in a form */}
            <form className="info" onSubmit={handleSubmit}>
              <label htmlFor="">Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. I will do something I'm really good at"
                onChange={handleChange}
              />

              <label htmlFor="">Category</label>
              <select name="cat" id="cat" onChange={handleChange} defaultValue="">
                <option value="" disabled>
                  Select a category
                </option>
                <option value="design">Design</option>
                <option value="web">Web Development</option>
                <option value="animation">Animation</option>
                <option value="music">Music</option>
              </select>

              <div className="images">
                <div className="imagesInputs">
                  <label htmlFor="">Cover Image</label>
                  <input
                    type="file"
                    onChange={(e) => setSingleFile(e.target.files[0])}
                  />
                  <label htmlFor="">Upload Images</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                  />
                </div>
                <button type="button" onClick={handleUpload}>
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>

              <label htmlFor="">Description</label>
              <textarea
                name="desc"
                placeholder="Brief description to introduce your service"
                rows="6"
                onChange={handleChange}
              ></textarea>

              <button type="submit">
                {uploading ? "Please wait..." : "Create"}
              </button>
            </form>

            <div className="details">
              <label htmlFor="">Service Title</label>
              <input
                type="text"
                name="shortTitle"
                placeholder="e.g. One-page web design"
                onChange={handleChange}
              />

              <label htmlFor="">Short Description</label>
              <textarea
                name="shortDesc"
                onChange={handleChange}
                placeholder="Short description of your service"
                rows="4"
              ></textarea>

              <label htmlFor="">Delivery Time (e.g. 3 days)</label>
              <input type="number" name="deliveryTime" onChange={handleChange} />

              <label htmlFor="">Revision Number</label>
              <input
                type="number"
                name="revisionNumber"
                onChange={handleChange}
              />

              <label htmlFor="">Add Features</label>
              <form className="add" onSubmit={handleFeature}>
                <input type="text" placeholder="e.g. page design" />
                <button type="submit">Add</button>
              </form>

              <div className="addedFeatures">
                {state?.features?.map((f) => (
                  <div className="item" key={f}>
                    <button
                      onClick={() =>
                        dispatch({ type: "REMOVE_FEATURE", payload: f })
                      }
                    >
                      {f}
                      <span>X</span>
                    </button>
                  </div>
                ))}
              </div>

              <label htmlFor="">Price</label>
              <input type="number" onChange={handleChange} name="price" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Add;
