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

            await fetch("http://localhost:2000/news", {

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

        <div className="max-w-7xl mx-auto">

            {/* Header */}

            <div className="relative overflow-hidden rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-10 mb-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

                <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-amber-500/10 blur-[120px]" />

                <div className="flex items-center gap-6">

                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center">

                        <FaNewspaper className="text-4xl text-slate-900" />

                    </div>

                    <div>

                        <p className="uppercase tracking-[5px] text-amber-400">

                            Bookshelf Admin

                        </p>

                        <h1 className="text-5xl font-black text-white">

                            Add News

                        </h1>

                        <p className="mt-2 text-slate-400">

                            Publish latest news and announcements for library members.

                        </p>

                    </div>

                </div>

            </div>

            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

                    <div className="grid md:grid-cols-2 gap-7">

                        <div className="md:col-span-2">

                            <label className={labelStyle}>

                                <FaHeading />

                                News Title

                            </label>

                            <input
                                {...register("title", { required: true })}
                                className={inputStyle}
                                placeholder="Enter news title"
                            />

                            {
                                errors.title &&
                                <p className="text-red-400 mt-2 text-sm">
                                    Title is required.
                                </p>
                            }

                        </div>

                        <div className="md:col-span-2">

                            <label className={labelStyle}>

                                <FaAlignLeft />

                                Description

                            </label>

                            <textarea
                                rows={8}
                                {...register("description", { required: true })}
                                className={`${inputStyle} resize-none`}
                                placeholder="Write news details..."
                            />

                        </div>

                        <div>

                            <label className={labelStyle}>

                                <FaCalendarAlt />

                                Publish Date

                            </label>

                            <input
                                type="date"
                                {...register("date", { required: true })}
                                className={inputStyle}
                            />

                        </div>

                        <div>

                            <label className={labelStyle}>

                                <FaImage />

                                News Image

                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                {...register("image", { required: true })}
                                onChange={handlePreview}
                                className={`${inputStyle} file:bg-amber-500 file:border-0 file:px-5 file:py-2 file:rounded-xl file:text-slate-900 file:font-bold`}
                            />

                        </div>

                        {
                            previewImage &&
                            <div className="md:col-span-2">

                                <img
                                    src={previewImage}
                                    alt=""
                                    className="w-full h-[320px] rounded-3xl object-cover border border-amber-500/20"
                                />

                            </div>
                        }

                    </div>

                    <button

                        type="submit"

                        disabled={loading}

                        className="mt-10 w-full py-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-slate-900 font-bold text-lg hover:scale-[1.01] duration-300"

                    >

                        {
                            loading
                                ? "Publishing News..."
                                : "Publish News"
                        }

                    </button>

                </div>

            </form>

        </div>

    );

};

export default AddNews;