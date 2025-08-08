import React from "react";
import img from "@/images";
import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (
        <div className="w-90 h-full pt-15 px-5 pb-10 m-auto">
            <h2 className="font-bold leading-[1.2] text-[146px] text-center text-[#21272a]">404</h2>
            <p className="font-bold leading-[1.4] text-[34px] text-center text-[#21272a]">Page Not Found</p>
            <span className="inline-block text-[16px] leading-[1.6] text-gray-500 my-4 text-center">
                The Page you are looking for doesn’t exist or an other error occurred.
            </span>
            <div className="flex justify-center font-medium">
                <Link
                    to="/"
                    className="inline-flex items-center justify-center h-12 px-5 rounded-[12px] gap-2 text-[#21272a] hover:bg-gray-100 border border-[#868e964d] cursor-pointer transition-all duration-200 ease-out"
                >
                    Home
                </Link>
            </div>
            <div>
                <img
                    alt="status error image"
                    loading="lazy"
                    width="360"
                    height="360"
                    src={img.pagenotfound}
                    className="max-w-full h-auto transparent"
                />

            </div>
        </div>
    );
};

export default PageNotFound;
