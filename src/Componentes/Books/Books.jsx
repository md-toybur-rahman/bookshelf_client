import React from "react";
import { FaBookOpen, FaArrowDown } from "react-icons/fa";
import FeaturesBook from "../Home/FeaturesBook/FeaturesBook";
import NewArrivals from "../Home/NewArrivals/NewArrivals";
import BestSellers from "../Home/BestSellers/BestSellers";

const Books = () => {

    return (

        <div className="relative overflow-hidden">

            {/* Background */}

            <div className="absolute top-0 left-0 w-96 h-96 bg-amber-400/10 blur-[160px] rounded-full"></div>

            <div className="absolute right-0 top-1/3 w-[500px] h-[500px] bg-orange-500/10 blur-[180px] rounded-full"></div>

            {/* Hero */}

            <section className="relative min-h-[85vh] flex items-center justify-center">

                <div className="absolute inset-0">

                    <img
                        src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&q=80"
                        className="w-full h-full object-cover"
                        alt=""
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-[#090603]/70 via-[#0f0905]/90 to-[#090603]"></div>

                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-5">

                    <div className="max-w-4xl mx-auto text-center">

                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-amber-500/20 backdrop-blur-xl text-amber-300 uppercase tracking-[3px] text-sm">

                            <FaBookOpen />

                            Premium Library Collection

                        </div>

                        <h1 className="mt-8 text-6xl lg:text-8xl font-black leading-none text-white">

                            Discover

                            <span className="block mt-3 bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">

                                Extraordinary Books

                            </span>

                        </h1>

                        <p className="mt-8 text-xl leading-9 text-gray-300 max-w-3xl mx-auto">

                            Explore timeless classics, bestselling novels,
                            inspiring biographies and thousands of carefully
                            curated books from around the world.

                        </p>

                        <div className="flex flex-wrap justify-center gap-6 mt-12">

                            <button className="px-9 py-4 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-600 text-[#1f150b] font-bold shadow-[0_20px_40px_rgba(255,185,60,.25)] hover:scale-105 duration-300">

                                Browse Collection

                            </button>

                            <button className="px-9 py-4 rounded-2xl border border-amber-400/30 bg-white/5 backdrop-blur-xl text-white hover:border-amber-400 duration-300">

                                Learn More

                            </button>

                        </div>

                    </div>

                </div>

                {/* Scroll */}

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">

                    <FaArrowDown className="text-amber-400 text-2xl" />

                </div>

            </section>

            {/* Featured */}

            <section className="relative py-24">

                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-72 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

                <FeaturesBook />

            </section>

            {/* Divider */}

            <div className="max-w-6xl mx-auto px-5">

                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"></div>

            </div>

            {/* New Arrivals */}

            <section className="relative py-24">

                <NewArrivals />

            </section>

            {/* Divider */}

            <div className="max-w-6xl mx-auto px-5">

                <div className="h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"></div>

            </div>

            {/* Best Sellers */}

            <section className="relative py-24">

                <BestSellers />

            </section>

        </div>

    );

};

export default Books;