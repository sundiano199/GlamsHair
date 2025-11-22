import React, { useEffect, useState, useRef } from "react";
import NavBar from "../components/NavBar";
import { MdArrowBack } from "react-icons/md";
import { AiOutlineInfoCircle } from "react-icons/ai";
import SmallButton from "../utils/SmallButton";
import { IoShareSocial } from "react-icons/io5";
import { FaWhatsapp, FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { BiCopy } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { IoCartOutline } from "react-icons/io5";
import WishListButton from "../components/WishListButton";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedLength, setSelectedLength] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        const prod = res.data.product || res.data; // adjust depending on backend
        setProduct(prod);

        if (Array.isArray(prod.lengths) && prod.lengths.length > 0) {
          const firstLength = prod.lengths[0];
          setSelectedLength(firstLength);
          setSelectedPrice(prod.price_by_length[firstLength]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  // close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShareOpen(false);
      }
    };
    if (shareOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shareOpen]);

  if (!product) return null;

  const handleLengthClick = (length) => {
    setSelectedLength(length);
    setSelectedPrice(product.price_by_length[length]);
  };

  const shareUrl = window.location.href;
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      alert("Unable to copy link.");
    }
  };

  const openInNewTab = (url) =>
    window.open(url, "_blank", "noopener,noreferrer");

  const handleShare = (platform) => {
    setShareOpen(false);
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(
      `${product.title} — ₦${selectedPrice} ${shareUrl}`
    );
    switch (platform) {
      case "whatsapp":
        openInNewTab(`https://wa.me/?text=${encodedText}`);
        break;
      case "telegram":
        openInNewTab(
          `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
        );
        break;
      case "x":
        openInNewTab(
          `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        );
        break;
      case "copy":
        handleCopyLink();
        break;
      case "native":
        if (navigator.share)
          navigator.share({
            title: product.title,
            text: encodedText,
            url: shareUrl,
          });
        break;
      default:
        break;
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 bg-[#FFFBF7] border-b border-gray-400">
        <NavBar />
      </div>

      {/* Header */}
      <div className="mx-10 flex items-center justify-between pt-45 bg-[#FFFBF7]">
        <MdArrowBack
          size={40}
          className="text-gray-600 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <h2 className="text-3xl font-bold text-gray-600">Product Detail</h2>
        <div aria-label="empty"></div>
      </div>

      {/* Product Image */}
      <div className="h-full bg-[#Fce0d3] mx-10 rounded-3xl my-5">
        <img
          src={product.images}
          alt={product.title}
          className="object-cover w-[65%] h-full rounded-3xl mx-auto py-5"
        />
      </div>

      {/* Title, Share & Heart */}
      <div className="mx-10">
        <div className="flex justify-between items-center pr-3">
          <h1 className="text-2xl mb-2">{product.title}</h1>

          <div className="flex gap-6 items-center relative" ref={shareRef}>
            <button
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Share product"
              onClick={() => setShareOpen((s) => !s)}
            >
              <IoShareSocial size={42} />
            </button>
            <WishListButton productId={product._id} />
            {shareOpen && (
              <div className="absolute right-0 top-14 bg-white border shadow-lg rounded-lg w-56 z-50">
                <div className="p-2">
                  <button
                    className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                    onClick={() => handleShare("whatsapp")}
                  >
                    <FaWhatsapp /> WhatsApp
                  </button>
                  <button
                    className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                    onClick={() => handleShare("telegram")}
                  >
                    <FaTelegramPlane /> Telegram
                  </button>
                  <button
                    className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                    onClick={() => handleShare("x")}
                  >
                    <FaTwitter /> X (Twitter)
                  </button>
                  <button
                    className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                    onClick={() => handleShare("copy")}
                  >
                    <BiCopy /> {copied ? "Copied!" : "Copy link"}
                  </button>
                  <button
                    className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                    onClick={() => handleShare("native")}
                  >
                    Share (device)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-2">₦{selectedPrice}</h2>
          <h3 className="text-md mb-2">In stock</h3>
        </div>
      </div>

      {/* Info Modal trigger */}
      <div className="flex mx-10 gap-3 mb-2 items-center">
        <AiOutlineInfoCircle
          size={30}
          className="cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
        <p className="text-lg">{product.short_description}</p>
      </div>

      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{product.title} Info</h3>
            <div
              className="py-4"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
            <div className="modal-action">
              <button className="btn" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Variations */}
      <div className="mx-10 text-2xl">
        <h1 className="font-semibold mb-2">VARIATIONS:</h1>
        <div>
          <h1 className="mb-2">Length (inches)</h1>
          <div className="flex gap-3.5">
            {Array.isArray(product.lengths) && product.lengths.length > 0
              ? product.lengths.map((len) => (
                  <SmallButton
                    key={len}
                    content={`${len}'`}
                    onClick={() => handleLengthClick(len)}
                    active={selectedLength === len}
                  />
                ))
              : Object.keys(product.price_by_length || {}).map((k) => {
                  const len = Number(k);
                  return (
                    <SmallButton
                      key={len}
                      content={`${len}'`}
                      onClick={() => handleLengthClick(len)}
                      active={selectedLength === len}
                    />
                  );
                })}
          </div>
        </div>
      </div>

      <hr className="my-4 border-2 border-gray-500" />
      <div className="mx-10 text-center text-2xl">
        <h1>Questions about this product?</h1>
        <h2 className="text-[#cc7c66] ">Contact Us</h2>
      </div>

      {/* Add to Cart button */}
      <div className="sticky bottom-0 left-0 right-0 mx-10 z-10">
        <div className="bg-[#FFFBF7] h-6 w-full"></div>
        <button
          onClick={() =>
            addToCart(
              {
                productId: product._id,
                title: product.title,
                images: product.images,
                length: selectedLength,
                price: selectedPrice,
              },
              1
            )
          }
          className="flex justify-between items-center bg-[#cc7c66]  w-full  rounded-xl py-3 px-6  shadow-lg z-10"
        >
          <IoCartOutline size={70} className="text-white" />
          <h1 className="text-3xl font-bold text-white">Add to Cart</h1>
          <div></div>
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
