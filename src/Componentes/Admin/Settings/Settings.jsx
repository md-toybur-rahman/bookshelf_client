import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
    FaCog,
    FaUniversity,
    FaHome,
    FaPhoneAlt,
    FaPalette,
    FaChartBar,
    FaShareAlt,
    FaInfoCircle,
    FaBell,
    FaLock,
    FaSave,
} from "react-icons/fa";

const Settings = () => {

    const [loading, setLoading] = useState(false);

    const [activeTab, setActiveTab] = useState("general");

    const [settings, setSettings] = useState({

        /* General */

        library_name: "",
        logo: "",
        address: "",
        email: "",
        phone: "",
        opening_time: "",
        closing_time: "",

        /* Homepage */

        hero_title: "",
        hero_subtitle: "",
        hero_button_text: "",
        hero_button_link: "",

        /* Contact */

        contact_email: "",
        contact_phone: "",
        contact_address: "",
        google_map: "",

        /* Theme */

        primary_color: "#FBBF24",
        secondary_color: "#F59E0B",
        accent_color: "#EA580C",

        /* Statistics */

        total_books: "",
        total_members: "",
        total_events: "",
        total_awards: "",

        /* Social */

        facebook: "",
        instagram: "",
        linkedin: "",
        youtube: "",
        github: "",

        /* About */

        mission: "",
        vision: "",
        history: "",

        /* Notification */

        contact_notification: true,
        newsletter: true,
        event_notification: true,

        /* Maintenance */

        maintenance: false,

    });

    const menu = [

        {
            id: "general",
            name: "General",
            icon: FaUniversity,
        },
        {
            id: "homepage",
            name: "Homepage",
            icon: FaHome,
        },
        {
            id: "contact",
            name: "Contact",
            icon: FaPhoneAlt,
        },
        {
            id: "theme",
            name: "Theme",
            icon: FaPalette,
        },
        {
            id: "statistics",
            name: "Statistics",
            icon: FaChartBar,
        },
        {
            id: "social",
            name: "Social",
            icon: FaShareAlt,
        },
        {
            id: "about",
            name: "About",
            icon: FaInfoCircle,
        },
        {
            id: "notification",
            name: "Notification",
            icon: FaBell,
        },
        {
            id: "security",
            name: "Security",
            icon: FaLock,
        },

    ];

    useEffect(() => {

        fetch("http://localhost:2000/settings")

            .then(res => res.json())

            .then(data => {

                if (data) {

                    setSettings(prev => ({

                        ...prev,
                        ...data,

                    }));

                }

            });

    }, []);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setSettings(prev => ({

            ...prev,

            [name]: type === "checkbox"
                ? checked
                : value,

        }));

    };

    const handleSave = async () => {

        try {

            setLoading(true);

            await fetch("http://localhost:2000/settings", {

                method: "PUT",

                headers: {

                    "content-type": "application/json",

                },

                body: JSON.stringify(settings),

            });

            Swal.fire({

                icon: "success",

                title: "Settings Saved",

                timer: 1500,

                showConfirmButton: false,

            });

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

    const inputStyle =
        "w-full rounded-2xl border border-amber-500/20 bg-[#1d140f] px-5 py-4 text-white outline-none transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 placeholder:text-slate-500";

    return (

        <div className="max-w-7xl mx-auto">

            {/* Header */}

            <div className="relative overflow-hidden rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-10 mb-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

                <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-amber-500/10 blur-[120px]" />

                <div className="flex items-center gap-6">

                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center">

                        <FaCog className="text-4xl text-slate-900" />

                    </div>

                    <div>

                        <p className="uppercase tracking-[5px] text-amber-400">

                            Bookshelf Admin

                        </p>

                        <h1 className="text-5xl font-black text-white">

                            Website Settings

                        </h1>

                        <p className="mt-2 text-slate-400">

                            Manage your entire Bookshelf platform from one place.

                        </p>

                    </div>

                </div>

            </div>

            <div className="grid lg:grid-cols-12 gap-8">

                {/* Left Menu */}

                <div className="lg:col-span-3">

                    <div className="sticky top-24 rounded-[30px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-5">

                        {

                            menu.map(item => {

                                const Icon = item.icon;

                                return (

                                    <button

                                        key={item.id}

                                        onClick={() => setActiveTab(item.id)}

                                        className={`w-full mb-3 flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold duration-300 ${activeTab === item.id

                                                ? "bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-slate-900"

                                                : "text-slate-300 hover:bg-white/5"

                                            }`}

                                    >

                                        <Icon />

                                        {item.name}

                                    </button>

                                );

                            })

                        }

                    </div>

                </div>

                {/* Right Panel */}

                <div className="lg:col-span-9">

                    <div className="rounded-[35px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#1b120d] to-[#15100c] p-10 shadow-[0_25px_60px_rgba(0,0,0,.45)]">

                        {/* ---------------- GENERAL ---------------- */}

                        {

                            activeTab === "general" && (

                                <div>

                                    <h2 className="text-3xl font-black text-white mb-8">

                                        Library Information

                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-6">

                                        <input
                                            name="library_name"
                                            value={settings.library_name}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Library Name"
                                        />

                                        <input
                                            name="logo"
                                            value={settings.logo}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Logo URL"
                                        />

                                        <input
                                            name="email"
                                            value={settings.email}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Email"
                                        />

                                        <input
                                            name="phone"
                                            value={settings.phone}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Phone"
                                        />

                                        <input
                                            name="opening_time"
                                            value={settings.opening_time}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Opening Time"
                                        />

                                        <input
                                            name="closing_time"
                                            value={settings.closing_time}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Closing Time"
                                        />

                                        <textarea
                                            name="address"
                                            value={settings.address}
                                            onChange={handleChange}
                                            className={`${inputStyle} md:col-span-2 resize-none`}
                                            rows={4}
                                            placeholder="Library Address"
                                        />

                                    </div>

                                </div>

                            )

                        }

                        {/* Homepage */}

                        {

                            activeTab === "homepage" && (

                                <div>

                                    <h2 className="text-3xl font-black text-white mb-8">

                                        Homepage Settings

                                    </h2>

                                    <div className="grid gap-6">

                                        <input
                                            name="hero_title"
                                            value={settings.hero_title}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Hero Title"
                                        />

                                        <input
                                            name="hero_subtitle"
                                            value={settings.hero_subtitle}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Hero Subtitle"
                                        />

                                        <input
                                            name="hero_button_text"
                                            value={settings.hero_button_text}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Hero Button Text"
                                        />

                                        <input
                                            name="hero_button_link"
                                            value={settings.hero_button_link}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Hero Button Link"
                                        />

                                    </div>

                                </div>

                            )

                        }
                        {/* Contact */}

                        {

                            activeTab === "contact" && (

                                <div>

                                    <h2 className="text-3xl font-black text-white mb-8">

                                        Contact Information

                                    </h2>

                                    <div className="grid gap-6">

                                        <input
                                            name="contact_email"
                                            value={settings.contact_email}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Contact Email"
                                        />

                                        <input
                                            name="contact_phone"
                                            value={settings.contact_phone}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Contact Phone"
                                        />

                                        <input
                                            name="google_map"
                                            value={settings.google_map}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Google Map Link"
                                        />

                                        <textarea
                                            rows={4}
                                            name="contact_address"
                                            value={settings.contact_address}
                                            onChange={handleChange}
                                            className={`${inputStyle} resize-none`}
                                            placeholder="Office Address"
                                        />

                                    </div>

                                </div>

                            )

                        }

                        {/* Theme */}

                        {

                            activeTab === "theme" && (

                                <div>

                                    <h2 className="text-3xl font-black text-white mb-8">

                                        Theme Settings

                                    </h2>

                                    <div className="grid md:grid-cols-3 gap-6">

                                        <div>

                                            <label className="block text-amber-300 mb-3">

                                                Primary Color

                                            </label>

                                            <input
                                                type="color"
                                                name="primary_color"
                                                value={settings.primary_color}
                                                onChange={handleChange}
                                                className="w-full h-20 rounded-2xl bg-transparent"
                                            />

                                        </div>

                                        <div>

                                            <label className="block text-amber-300 mb-3">

                                                Secondary Color

                                            </label>

                                            <input
                                                type="color"
                                                name="secondary_color"
                                                value={settings.secondary_color}
                                                onChange={handleChange}
                                                className="w-full h-20 rounded-2xl bg-transparent"
                                            />

                                        </div>

                                        <div>

                                            <label className="block text-amber-300 mb-3">

                                                Accent Color

                                            </label>

                                            <input
                                                type="color"
                                                name="accent_color"
                                                value={settings.accent_color}
                                                onChange={handleChange}
                                                className="w-full h-20 rounded-2xl bg-transparent"
                                            />

                                        </div>

                                    </div>

                                </div>

                            )

                        }

                        {/* Statistics */}

                        {

                            activeTab === "statistics" && (

                                <div>

                                    <h2 className="text-3xl font-black text-white mb-8">

                                        Homepage Statistics

                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-6">

                                        <input
                                            name="total_books"
                                            value={settings.total_books}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Total Books"
                                        />

                                        <input
                                            name="total_members"
                                            value={settings.total_members}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Total Members"
                                        />

                                        <input
                                            name="total_events"
                                            value={settings.total_events}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Total Events"
                                        />

                                        <input
                                            name="total_awards"
                                            value={settings.total_awards}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Total Awards"
                                        />

                                    </div>

                                </div>

                            )

                        }
                        {/* Social */}

                        {

                            activeTab === "social" && (

                                <div>

                                    <h2 className="text-3xl font-black text-white mb-8">

                                        Social Media

                                    </h2>

                                    <div className="grid gap-6">

                                        <input
                                            name="facebook"
                                            value={settings.facebook}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Facebook URL"
                                        />

                                        <input
                                            name="instagram"
                                            value={settings.instagram}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Instagram URL"
                                        />

                                        <input
                                            name="linkedin"
                                            value={settings.linkedin}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="LinkedIn URL"
                                        />

                                        <input
                                            name="youtube"
                                            value={settings.youtube}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="YouTube URL"
                                        />

                                        <input
                                            name="github"
                                            value={settings.github}
                                            onChange={handleChange}
                                            className={inputStyle}
                                            placeholder="Github URL"
                                        />

                                    </div>

                                </div>

                            )

                        }

                        {/* About */}

                        {

                            activeTab === "about" && (

                                <div>

                                    <h2 className="text-3xl font-black text-white mb-8">

                                        About Library

                                    </h2>

                                    <div className="grid gap-6">

                                        <textarea
                                            rows={5}
                                            name="mission"
                                            value={settings.mission}
                                            onChange={handleChange}
                                            className={`${inputStyle} resize-none`}
                                            placeholder="Mission"
                                        />

                                        <textarea
                                            rows={5}
                                            name="vision"
                                            value={settings.vision}
                                            onChange={handleChange}
                                            className={`${inputStyle} resize-none`}
                                            placeholder="Vision"
                                        />

                                        <textarea
                                            rows={8}
                                            name="history"
                                            value={settings.history}
                                            onChange={handleChange}
                                            className={`${inputStyle} resize-none`}
                                            placeholder="History"
                                        />

                                    </div>

                                </div>

                            )

                        }

                        {/* Notification */}

                        {

                            activeTab === "notification" && (

                                <div>

                                    <h2 className="text-3xl font-black text-white mb-8">

                                        Notification Settings

                                    </h2>

                                    <div className="space-y-6">

                                        <label className="flex items-center justify-between rounded-2xl border border-amber-500/20 bg-[#1d140f] px-6 py-5">

                                            <span className="text-white font-semibold">

                                                Enable Contact Email

                                            </span>

                                            <input
                                                type="checkbox"
                                                name="contact_notification"
                                                checked={settings.contact_notification}
                                                onChange={handleChange}
                                                className="w-6 h-6 accent-amber-500"
                                            />

                                        </label>

                                        <label className="flex items-center justify-between rounded-2xl border border-amber-500/20 bg-[#1d140f] px-6 py-5">

                                            <span className="text-white font-semibold">

                                                Enable Newsletter

                                            </span>

                                            <input
                                                type="checkbox"
                                                name="newsletter"
                                                checked={settings.newsletter}
                                                onChange={handleChange}
                                                className="w-6 h-6 accent-amber-500"
                                            />

                                        </label>

                                        <label className="flex items-center justify-between rounded-2xl border border-amber-500/20 bg-[#1d140f] px-6 py-5">

                                            <span className="text-white font-semibold">

                                                Event Reminder

                                            </span>

                                            <input
                                                type="checkbox"
                                                name="event_notification"
                                                checked={settings.event_notification}
                                                onChange={handleChange}
                                                className="w-6 h-6 accent-amber-500"
                                            />

                                        </label>

                                    </div>

                                </div>

                            )

                        }

                        {/* Security */}

                        {

                            activeTab === "security" && (

                                <div>

                                    <h2 className="text-3xl font-black text-white mb-8">

                                        Security

                                    </h2>

                                    <div className="space-y-6">

                                        <label className="flex items-center justify-between rounded-2xl border border-red-500/20 bg-[#1d140f] px-6 py-5">

                                            <span className="text-white font-semibold">

                                                Maintenance Mode

                                            </span>

                                            <input
                                                type="checkbox"
                                                name="maintenance"
                                                checked={settings.maintenance}
                                                onChange={handleChange}
                                                className="w-6 h-6 accent-red-500"
                                            />

                                        </label>

                                    </div>

                                </div>

                            )

                        }

                        <div className="mt-12 flex justify-end">

                            <button

                                onClick={handleSave}

                                className="px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-slate-900 font-black text-lg flex items-center gap-4 hover:scale-105 duration-300"

                            >

                                <FaSave />

                                {

                                    loading

                                        ? "Saving..."

                                        : "Save All Settings"

                                }

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Settings;