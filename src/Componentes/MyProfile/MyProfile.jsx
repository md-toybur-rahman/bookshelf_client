import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

import {
    FaCamera,
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaUser,
    FaVenusMars,
    FaCrown,
    FaShieldAlt,
    FaShoppingBag,
} from "react-icons/fa";

import { MdVerified } from "react-icons/md";

import { AuthContext } from "../../Providers/AuthProvider";

import "./MyProfile.css";

const MyProfile = () => {

    const { user } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [uploading, setUploading] = useState(false);

    const {

        register,

        handleSubmit,

        reset,

        setValue,

        formState: { errors },

    } = useForm();



    /* =====================================
                LOAD PROFILE
    ===================================== */

    useEffect(() => {

        if (!user?.email) return;

        fetch(`http://localhost:2000/users/${user.email}`)

            .then(res => res.json())

            .then(data => {

                if (Array.isArray(data)) {

                    setProfile(data[0]);

                    reset(data[0]);

                }
                else {

                    setProfile(data);

                    reset(data);

                }

                setLoading(false);

            })

            .catch(() => {

                setLoading(false);

            });

    }, [user, reset]);



    /* =====================================
                IMAGE UPLOAD
    ===================================== */

    const handleImageUpload = async (e) => {

        const image = e.target.files[0];

        if (!image) return;

        try {

            setUploading(true);

            const formData = new FormData();

            formData.append("file", image);

            formData.append(

                "upload_preset",

                import.meta.env.VITE_preset

            );

            const res = await axios.post(

                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloudinary_name}/image/upload`,

                formData

            );

            const imageUrl = res.data.secure_url;

            // UI Update
            setProfile(prev => ({
                ...prev,
                image: imageUrl,
            }));

            setValue("image", imageUrl);

            // Database Update
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:2000/users/profile_image/${profile?.email}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        image: imageUrl,
                    }),
                }
            );

            const result = await response.json();

            Swal.fire({

                icon: "success",

                title: "Profile Image Updated",

                showConfirmButton: false,

                timer: 1500,

            });

            if (!result.success) {
                throw new Error(result.message || "Failed to update database");
            }


        }

        catch (err) {

            Swal.fire({

                icon: "error",

                title: "Upload Failed",

                text: err.message,

            });

        }

        finally {

            setUploading(false);

        }

    };



    /* =====================================
                UPDATE PROFILE
    ===================================== */

    const onSubmit = async (data) => {

        try {

            setLoading(true);

            const updatedData = {

                first_name: data.first_name,

                last_name: data.last_name,

                phone_number: data.phone_number,

                address: data.address,

                gender: data.gender,

                image: profile.image,

            };

            const token = localStorage.getItem("token");

            const res = await fetch(

                `http://localhost:2000/users/${profile?.email}`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type": "application/json",

                        authorization: `Bearer ${token}`,

                    },

                    body: JSON.stringify(updatedData),

                }

            );

            const result = await res.json();

            if (result.success) {

                setProfile({

                    ...profile,

                    ...updatedData,

                });

                Swal.fire({

                    icon: "success",

                    title: "Profile Updated Successfully",

                    showConfirmButton: false,

                    timer: 1500,

                });

            }

            else {

                Swal.fire({

                    icon: "error",

                    title: result.message || "Update Failed",

                });

            }

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

        return (

            <div className="profile-page">

                <div className="profile-loading">

                    <div className="profile-spinner"></div>

                    Loading Profile...

                </div>

            </div>

        );

    }

    return (

        <div className="profile-page">


            {/* Background */}

            <div className="absolute inset-0 bg-gradient-to-br from-[#120d09] via-[#18120e] to-[#090909]" />

            <div className="absolute -left-48 top-0 h-[420px] w-[420px] rounded-full bg-yellow-500/10 blur-[130px]" />

            <div className="absolute -right-48 bottom-0 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[160px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-5"></div>

            <div className="container mx-auto">

                <div className="relative text-center mb-20">

                    <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 to-yellow-700 flex justify-center items-center shadow-[0_0_60px_rgba(212,175,55,.4)]">

                        <FaUser className="text-4xl text-black" />

                    </div>

                    <h1 className="mt-8 text-6xl lg:text-8xl font-black leading-none text-white">

                        <span className="block bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">

                            My Profile

                        </span>

                    </h1>

                </div>

                <div className="profile-card">

                    <div className="profile-content">

                        {/* ====================================
                                LEFT SIDE
                        ==================================== */}

                        <div className="profile-left">

                            <div className="flex flex-col items-center justify-center w-full">
                                <div className="profile-avatar">

                                    <img

                                        src={
                                            profile?.image ||
                                            "https://i.ibb.co/ZYW3VTp/brown-brim.png"
                                        }

                                        alt="profile"

                                    />

                                    <label className="profile-avatar-overlay">

                                        <FaCamera />

                                        <input

                                            hidden

                                            type="file"

                                            accept="image/*"

                                            onChange={handleImageUpload}

                                        />

                                    </label>

                                </div>

                                <button

                                    className="profile-upload-btn"

                                >
                                    <label className="profile-avatar-overlay">

                                        <FaCamera />

                                        <input

                                            hidden

                                            type="file"

                                            accept="image/*"

                                            onChange={handleImageUpload}

                                        />

                                    </label>

                                    {

                                        uploading

                                            ?

                                            "Uploading..."

                                            :

                                            "Change Profile Photo"

                                    }

                                </button>
                            </div>

                            <div className="profile-divider"></div>

                            <h1 className="text-2xl lg:text-4xl font-black leading-none text-white">

                                <span className="block bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">

                                    {profile?.first_name} {profile?.last_name}

                                </span>

                            </h1>

                            <p className="profile-email">

                                <FaEnvelope className="text-[#d4af37]" />

                                {profile?.email}

                            </p>

                            <div className="profile-badge flex items-center justify-start gap-3">

                                {

                                    profile?.type === "admin"

                                        ?

                                        <>

                                            <FaShieldAlt className="text-[#d4af37]" />

                                            <span>Administrator</span>

                                        </>

                                        :

                                        <>

                                            <FaCrown className="text-[#d4af37]" />

                                            <span>Library Member</span>

                                        </>

                                }

                            </div>

                            <div className="profile-verified flex items-center justify-start gap-3">

                                <MdVerified className="text-[#d4af37]" />

                                Verified Account

                            </div>

                        </div>

                        {/* ====================================
                                RIGHT SIDE
                        ==================================== */}

                        <div className="profile-right">

                            <form

                                onSubmit={handleSubmit(onSubmit)}

                                className="profile-form"

                            >

                                <div className="profile-field">

                                    <label>

                                        <FaUser />

                                        First Name

                                    </label>

                                    <input

                                        {...register("first_name", {

                                            required: true,

                                        })}

                                    />

                                </div>

                                <div className="profile-field">

                                    <label>

                                        <FaUser />

                                        Last Name

                                    </label>

                                    <input

                                        {...register("last_name", {

                                            required: true,

                                        })}

                                    />

                                </div>

                                <div className="profile-field">

                                    <label>

                                        <FaEnvelope />

                                        Email

                                    </label>

                                    <input

                                        value={profile?.email || ""}

                                        readOnly

                                    />

                                </div>

                                <div className="profile-field">

                                    <label>

                                        <FaPhoneAlt />

                                        Phone Number

                                    </label>

                                    <input

                                        {...register("phone_number")}

                                    />

                                </div>

                                <div className="profile-field">

                                    <label>

                                        <FaVenusMars />

                                        Gender

                                    </label>

                                    <select

                                        {...register("gender")}

                                    >

                                        <option value="">Select Gender</option>

                                        <option value="Male">Male</option>

                                        <option value="Female">Female</option>

                                        <option value="Other">Other</option>

                                    </select>

                                </div>

                                <div className="profile-field">

                                    <label>

                                        Account Type

                                    </label>

                                    <input

                                        value={profile?.type || ""}

                                        readOnly

                                    />

                                </div>

                                <div className="profile-field md:col-span-2">

                                    <label>

                                        <FaMapMarkerAlt />

                                        Address

                                    </label>

                                    <textarea

                                        rows={5}

                                        {...register("address")}

                                    />

                                </div>

                                <div className="profile-actions">

                                    <button

                                        type="submit"

                                        className="profile-save-btn"

                                        disabled={loading || uploading}

                                    >

                                        {

                                            loading || uploading

                                                ?

                                                "Updating..."

                                                :

                                                "Save Changes"

                                        }

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default MyProfile;