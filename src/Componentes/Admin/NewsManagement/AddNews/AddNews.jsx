import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import {
    FaNewspaper,
    FaHeading,
    FaAlignLeft,
    FaCalendarAlt,
    FaImage,
} from "react-icons/fa";

const AddNews = () => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const inputStyle =
        "w-full rounded-2xl border border-amber-500/20 bg-[#1d140f] px-5 py-4 text-white outline-none transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 placeholder:text-slate-500";

    const labelStyle =
        "flex items-center gap-2 text-amber-300 font-semibold mb-3";

    const handlePreview = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setPreviewImage(URL.createObjectURL(file));

    };

    const onSubmit = async (data) => {

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("file", data.image[0]);

            formData.append(
                "upload_preset",
                import.meta.env.VITE_preset
            );

            const upload = await axios.post(

                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloudinary_name}/image/upload`,

                formData

            );

            const newsData = {

                title: data.title,
                description: data.description,
                date: data.date,
                image: upload.data.secure_url,
                public_id: upload.data.public_id,
                status: true,

            };

            await fetch("https://bookshelf-server-zot1.onrender.com/news", {

                method: "POST",

                headers: {

                    "content-type": "application/json",

                },

                body: JSON.stringify(newsData),

            });

            Swal.fire({

                icon: "success",

                title: "News Added Successfully",

                timer: 1500,

                showConfirmButton: false,

            });

            reset();

            setPreviewImage("");

        }
        catch (err) {

            Swal.fire({

                icon: "error",

                title: "Upload Failed",

                text: err.message,

            });

        }
        finally {

            setLoading(false);

        }

    };

    return (
        <div className="w-full max-w-7xl mx-auto px-0 sm:px-2">

            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5 sm:p-8 lg:p-10 mb-6 sm:mb-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

                <div className="absolute -right-20 sm:-right-24 -top-20 sm:-top-24 w-48 sm:w-80 h-48 sm:h-80 rounded-full bg-amber-500/10 blur-[100px] sm:blur-[120px]" />

                <div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-[#8f6500] via-[#f6d778] to-[#d4af37]" />

                <div className="relative flex flex-col sm:flex-row items-center sm:items-center gap-5 sm:gap-6 text-center sm:text-left">

                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center shadow-[0_0_35px_rgba(251,191,36,.25)]">

                        <FaNewspaper className="text-3xl sm:text-4xl text-slate-900" />

                    </div>

                    <div className="min-w-0">

                        <p className="uppercase tracking-[3px] sm:tracking-[5px] text-amber-400 text-[10px] sm:text-sm font-semibold">

                            Bookshelf Admin

                        </p>

                        <h1 className="mt-1 sm:mt-2 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">

                            Add News

                        </h1>

                        <p className="mt-2 text-sm sm:text-base text-slate-400 leading-6 sm:leading-7 max-w-2xl">

                            Publish latest news and announcements for library members.

                        </p>

                    </div>

                </div>

            </div>


            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="relative overflow-hidden rounded-2xl sm:rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5 sm:p-8 lg:p-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

                    <div className="absolute -right-20 sm:-right-24 -top-20 sm:-top-24 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-amber-400/10 blur-[100px] sm:blur-[120px]" />

                    <div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-[#8f6500] via-[#f6d778] to-[#d4af37]" />

                    <div className="relative">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">

                            {/* News Title */}
                            <div className="md:col-span-2 min-w-0">

                                <label className={labelStyle}>

                                    <FaHeading className="text-amber-400 shrink-0" />

                                    News Title

                                </label>

                                <input
                                    {...register("title", { required: true })}
                                    className={`${inputStyle} w-full min-w-0`}
                                    placeholder="Enter news title"
                                />

                                {
                                    errors.title && (
                                        <p className="text-red-400 mt-2 text-sm">
                                            Title is required.
                                        </p>
                                    )
                                }

                            </div>


                            {/* Description */}
                            <div className="md:col-span-2 min-w-0">

                                <label className={labelStyle}>

                                    <FaAlignLeft className="text-amber-400 shrink-0" />

                                    Description

                                </label>

                                <textarea
                                    rows={8}
                                    {...register("description", { required: true })}
                                    className={`${inputStyle} w-full min-w-0 resize-none min-h-[180px]`}
                                    placeholder="Write news details..."
                                />

                                {
                                    errors.description && (
                                        <p className="text-red-400 mt-2 text-sm">
                                            Description is required.
                                        </p>
                                    )
                                }

                            </div>


                            {/* Publish Date */}
                            <div className="min-w-0">

                                <label className={labelStyle}>

                                    <FaCalendarAlt className="text-amber-400 shrink-0" />

                                    Publish Date

                                </label>

                                <input
                                    type="date"
                                    {...register("date", { required: true })}
                                    className={`${inputStyle} w-full min-w-0 relative cursor-pointer`}
                                />

                            </div>


                            {/* News Image */}
                            <div className="min-w-0">

                                <label className={labelStyle}>

                                    <FaImage className="text-amber-400 shrink-0" />

                                    News Image

                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register("image", { required: true })}
                                    onChange={handlePreview}
                                    className={`${inputStyle} w-full min-w-0 file:bg-amber-500 file:border-0 file:px-3 sm:file:px-5 file:py-2 file:rounded-lg sm:file:rounded-xl file:text-slate-900 file:font-bold file:mr-3`}
                                />

                            </div>


                            {/* Preview */}
                            {
                                previewImage && (
                                    <div className="md:col-span-2 min-w-0">

                                        <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-500/20 shadow-[0_15px_40px_rgba(0,0,0,.35)]">

                                            <img
                                                src={previewImage}
                                                alt="News preview"
                                                className="w-full h-48 sm:h-64 lg:h-[320px] object-cover"
                                            />

                                        </div>

                                    </div>
                                )
                            }

                        </div>


                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-7 sm:mt-10 w-full py-3.5 sm:py-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-slate-900 font-bold text-base sm:text-lg hover:scale-[1.01] duration-300 shadow-[0_0_35px_rgba(251,191,36,.25)] disabled:opacity-60 disabled:cursor-not-allowed"
                        >

                            {
                                loading
                                    ? "Publishing News..."
                                    : "Publish News"
                            }

                        </button>

                    </div>

                </div>

            </form>

        </div>
    );

};

export default AddNews;