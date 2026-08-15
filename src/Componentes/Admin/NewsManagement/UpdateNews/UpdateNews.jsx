import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import {
    FaSearch,
    FaHeading,
    FaAlignLeft,
    FaCalendarAlt,
    FaImage,
    FaEdit,
} from "react-icons/fa";

const UpdateNews = () => {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const [news, setNews] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [selectedNews, setSelectedNews] = useState(null);
    /* ---------------- Load News ---------------- */

    useEffect(() => {
        setLoading(true);
        fetch("https://bookshelf-server-zot1.onrender.com/news")
            .then(res => res.json())
            .then(data => {
                setNews(data);
                setFilteredNews(data);
            }).then(() => {
                setLoading(false)
            })

    }, []);

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const inputStyle =
        "w-full rounded-2xl border border-amber-500/20 bg-[#1d140f] px-5 py-4 text-white outline-none transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 placeholder:text-slate-500";

    const labelStyle =
        "flex items-center gap-2 text-amber-300 font-semibold mb-3";


    /* ---------------- Search ---------------- */

    useEffect(() => {

        const value = search.toLowerCase();

        setFilteredNews(

            news.filter(item =>
                item.title.toLowerCase().includes(value)
            )

        );

    }, [search, news]);

    /* ---------------- Select News ---------------- */

    const handleSelectNews = (item) => {

        setSelectedNews(item);

        setPreviewImage(item.image);

        setValue("title", item.title);
        setValue("description", item.description);
        setValue("date", item.date);

        window.scrollTo({

            top: 0,
            behavior: "smooth",

        });

    };

    /* ---------------- Preview Image ---------------- */

    const handlePreview = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setPreviewImage(URL.createObjectURL(file));

    };

    /* ---------------- Update News ---------------- */

    const onSubmit = async (data) => {

        if (!selectedNews) {

            Swal.fire({

                icon: "warning",

                title: "Select a news first",

            });

            return;

        }

        try {

            setLoading(true);

            let image = selectedNews.image;
            let public_id = selectedNews.public_id;

            /* Upload New Image */

            if (data.image?.length) {

                /* Delete Previous Image */

                if (selectedNews.public_id) {

                    await fetch("https://bookshelf-server-zot1.onrender.com/delete-image", {

                        method: "DELETE",

                        headers: {

                            "content-type": "application/json",

                        },

                        body: JSON.stringify({

                            public_id: selectedNews.public_id,

                        }),

                    });

                }

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

                image = upload.data.secure_url;
                public_id = upload.data.public_id;

            }

            const updateData = {

                title: data.title,
                description: data.description,
                date: data.date,
                image,
                public_id,
                status: true,

            };

            await fetch(

                `https://bookshelf-server-zot1.onrender.com/news/${selectedNews?._id}`,

                {

                    method: "PUT",

                    headers: {

                        "content-type": "application/json",

                    },

                    body: JSON.stringify(updateData),

                }

            );

            Swal.fire({

                icon: "success",

                title: "News Updated Successfully",

                timer: 1500,

                showConfirmButton: false,

            });

            const updatedNews = news.map(item =>
                item._id === selectedNews._id
                    ? { ...item, ...updateData }
                    : item
            );

            setNews(updatedNews);
            setFilteredNews(updatedNews);

            setSelectedNews(null);

        }
        catch (err) {

            Swal.fire({

                icon: "error",

                title: err.message,

            });

        }
        finally {

            setLoading(false);

        }

    };

    if (loading) {
        return <h1>Loading .....</h1>
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-0 sm:px-2">

            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5 sm:p-8 lg:p-10 mb-6 sm:mb-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

                <div className="absolute -right-20 sm:-right-24 -top-20 sm:-top-24 w-48 sm:w-80 h-48 sm:h-80 rounded-full bg-amber-500/10 blur-[100px] sm:blur-[120px]" />

                <div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-[#8f6500] via-[#f6d778] to-[#d4af37]" />

                <div className="relative flex flex-col sm:flex-row items-center sm:items-center gap-5 sm:gap-6 text-center sm:text-left">

                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center shadow-[0_0_35px_rgba(251,191,36,.25)]">

                        <FaEdit className="text-3xl sm:text-4xl text-slate-900" />

                    </div>

                    <div className="min-w-0">

                        <p className="uppercase tracking-[3px] sm:tracking-[5px] text-amber-400 text-[10px] sm:text-sm font-semibold">

                            Bookshelf Admin

                        </p>

                        <h1 className="mt-1 sm:mt-2 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">

                            Update News

                        </h1>

                    </div>

                </div>

            </div>


            {/* Search */}
            <div className="relative mb-6 sm:mb-10">

                <FaSearch className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`${inputStyle} w-full min-w-0 pl-11 sm:pl-14`}
                    placeholder="Search News..."
                />

            </div>


            {/* News List */}
            {
                !selectedNews && (

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7 lg:gap-8 mb-8 sm:mb-12">

                        {
                            filteredNews
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .reverse()
                                .map(item => (

                                    <div
                                        key={item._id}
                                        onClick={() => handleSelectNews(item)}
                                        className="group cursor-pointer rounded-2xl sm:rounded-[30px] overflow-hidden border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] shadow-[0_20px_60px_rgba(0,0,0,.40)] hover:-translate-y-1 sm:hover:-translate-y-2 hover:border-amber-400/40 duration-300 min-w-0"
                                    >

                                        {/* Image */}
                                        <div className="relative overflow-hidden">

                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="h-48 sm:h-52 lg:h-56 w-full object-cover group-hover:scale-105 duration-500"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-[#15100c]/60 via-transparent to-transparent pointer-events-none" />

                                        </div>


                                        {/* Content */}
                                        <div className="p-5 sm:p-6 bg-[#1b120d]">

                                            <h3 className="text-xl sm:text-2xl font-bold text-white leading-7 sm:leading-8 line-clamp-2 min-h-[56px] sm:min-h-16 break-words">

                                                {item.title}

                                            </h3>

                                            <p className="text-sm sm:text-base text-slate-400 mt-2">

                                                {item.date}

                                            </p>

                                        </div>

                                    </div>

                                ))
                        }

                    </div>

                )
            }


            {/* Update Form */}
            {
                selectedNews && (

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
                                        />

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


                                    {/* Image */}
                                    <div className="min-w-0">

                                        <label className={labelStyle}>

                                            <FaImage className="text-amber-400 shrink-0" />

                                            Replace Image (Optional)

                                        </label>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            {...register("image")}
                                            onChange={handlePreview}
                                            className={`${inputStyle} w-full min-w-0 file:bg-amber-500 file:border-0 file:px-3 sm:file:px-5 file:py-2 file:rounded-lg sm:file:rounded-xl file:text-slate-900 file:font-bold file:mr-3`}
                                        />

                                    </div>


                                    {/* Preview */}
                                    {
                                        previewImage && (

                                            <div className="md:col-span-2 min-w-0">

                                                <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-500/20 shadow-[0_15px_40px_rgba(0,0,0,.35)]">

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
                                            ? "Updating News..."
                                            : "Update News"
                                    }

                                </button>

                            </div>

                        </div>

                    </form>

                )
            }

        </div>
    );

};

export default UpdateNews;