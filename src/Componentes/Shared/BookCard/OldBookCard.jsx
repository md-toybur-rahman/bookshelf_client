import React from "react";
import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaBookOpen,
    FaHeart,
    FaRegHeart,
    FaStar,
    FaUserEdit,
} from "react-icons/fa";

const BookCard = ({ book }) => {

    const {
        _id,
        book_name,
        cover_image,
        author,
        category,
        rating,
        quantity,
    } = book;

    return (

        <div className="group h-full">

            <div
                className="relative overflow-hidden rounded-[30px]
                border border-[#4d3b2f]
                bg-gradient-to-b
                from-[#241b15]
                via-[#1b1511]
                to-[#15100d]
                transition-all
                duration-500
                hover:-translate-y-3
                hover:border-[#d4af37]
                hover:shadow-[0_20px_60px_rgba(212,175,55,.18)]"
            >

                {/* Glow */}

                <div
                    className="absolute
                    -right-20
                    -top-20
                    h-44
                    w-44
                    rounded-full
                    bg-[#d4af37]/10
                    blur-[70px]"
                />

                {/* Image */}

                <div className="relative overflow-hidden">

                    <img
                        src={cover_image}
                        alt={book_name}
                        className="h-[330px]
                        w-full
                        object-cover
                        transition
                        duration-700
                        group-hover:scale-110"
                    />

                    {/* Overlay */}

                    <div
                        className="absolute
                        inset-0
                        bg-gradient-to-t
                        from-[#130f0c]
                        via-transparent
                        to-black/20"
                    />

                    {/* Category */}

                    <div
                        className="absolute
                        left-4
                        top-4
                        rounded-full
                        bg-[#d4af37]
                        px-4
                        py-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-[2px]
                        text-[#1d1712]"
                    >

                        {category || "Book"}

                    </div>

                    {/* Wishlist */}

                    <button
                        className="absolute
                        right-4
                        top-4
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        bg-[#1f1813]/90
                        text-[#d4af37]
                        backdrop-blur
                        transition
                        hover:scale-110"
                    >

                        <FaRegHeart />

                    </button>

                </div>

                {/* Content */}

                <div className="p-6">

                    <div
                        className="mb-3
                        flex
                        items-center
                        justify-between"
                    >

                        <div className="flex items-center gap-2">

                            <FaStar className="text-[#d4af37]" />

                            <span className="font-semibold text-[#d4af37]">

                                {rating || "4.8"}

                            </span>

                        </div>

                        <div
                            className="rounded-full
                            bg-[#2b211b]
                            px-3
                            py-1
                            text-xs
                            text-[#bda58b]"
                        >

                            {quantity || 0} Copies

                        </div>

                    </div>

                    <h2
                        className="line-clamp-2
                        min-h-[62px]
                        text-2xl
                        font-bold
                        leading-8
                        text-white
                        transition
                        group-hover:text-[#d4af37]"
                    >

                        {book_name}

                    </h2>

                    <div
                        className="mt-5
                        flex
                        items-center
                        gap-3
                        text-[#cdbfae]"
                    >

                        <FaUserEdit className="text-[#d4af37]" />

                        <span>

                            {author || "Unknown Author"}

                        </span>

                    </div>
                    {/* Divider */}

                    <div className="my-6 h-px bg-gradient-to-r from-transparent via-[#5d4638] to-transparent" />

                    {/* Bottom */}

                    <div className="flex items-center justify-between">

                        {/* Left */}

                        <div>

                            <p className="text-xs uppercase tracking-[3px] text-[#8f7a66]">

                                Premium Collection

                            </p>

                            <div className="mt-2 flex items-center gap-2">

                                <FaBookOpen className="text-[#d4af37]" />

                                <span className="font-medium text-[#cdbfae]">

                                    Available Now

                                </span>

                            </div>

                        </div>

                        {/* Button */}

                        <Link
                            to={`/book/${_id}`}
                            state={{ from: `/book/${_id}` }}
                            className="group/button inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] px-5 py-3 font-bold text-[#1b1712] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#d4af37]/30"
                        >
                            Details

                            <FaArrowRight className="transition-transform duration-300 group-hover/button:translate-x-1" />
                        </Link>

                    </div>

                </div>

                {/* Bottom Glow */}

                <div
                    className="absolute
                    bottom-0
                    left-0
                    h-[4px]
                    w-0
                    bg-gradient-to-r
                    from-[#b8860b]
                    via-[#f5d76e]
                    to-[#d4af37]
                    transition-all
                    duration-500
                    group-hover:w-full"
                />

            </div>

        </div>

    );

};

export default BookCard;