import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import ScrollToTop from "react-scroll-to-top";
import apiGetImages from "./services/PixabayApi";
import Searchbar from "./components/searchbar/Searchbar";
import ImageGallery from "./components/imageGallery/ImageGallery";
import Modal from "./components/modal/Modal";
import Loader from "./components/loader/Loader";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [chooseImage, setChooseImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    const fetchSearchQuery = async () => {
      setLoading(true);
      try {
        const { hits } = await apiGetImages(searchQuery, page);

        if (hits.length === 0) {
          toast.error("Nothing was found for your query");
          return;
        }
        setImages((prevImages) => [...prevImages, ...hits]);
      } catch {
        toast.error("An error has occurred, please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchQuery();
  }, [page, searchQuery]);

  useEffect(() => {
    if (chooseImage !== null) {
      toggleShowModal();
    }
  }, [chooseImage]);

  const getSearchQuery = (query) => {
    if (query === searchQuery) {
      toast.error(
        `The search was performed on request ${query}. You may prefer to use the load more button`
      );
      return;
    }
    setSearchQuery(query);
    setPage(1);
    setImages([]);
  };

  const getChooseImage = (image) => {
    setChooseImage(image);
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const toggleShowModal = () => {
    setShowModal((prev) => !prev);
  };
  return (
    <div>
      <Searchbar onSubmit={getSearchQuery} />
      <ScrollToTop smooth />
      <ImageGallery
        images={images}
        onClick={getChooseImage}
        loadMore={loadMore}
      />
      {loading && <Loader />}
      {showModal && (
        <Modal chooseImage={chooseImage} onClose={toggleShowModal} />
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "",
          style: {
            border: "1px solid #713200",
            padding: "16px",
            fontSize: "20px",
            color: "#713200",
          },
        }}
      />
    </div>
  );
}
