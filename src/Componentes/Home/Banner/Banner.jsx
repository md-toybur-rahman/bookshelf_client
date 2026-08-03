import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaBookOpen,
    FaStar,
    FaUsers,
} from "react-icons/fa";
import {
    BsBookmarkHeartFill,
} from "react-icons/bs";

const Banner = () => {
    return (
        <section className="relative overflow-hidden ">

            {/* Background */}


            <div className="absolute left-0 top-10 h-[700px] w-[400px] rounded-full bg-[#d4af37]/10 blur-[120px]" />

            <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#8b5a2b]/10 blur-[130px]" />


            <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center justify-between gap-16 px-6 py-20 lg:flex-row">

                {/* LEFT */}

                <div className="max-w-2xl">

                    <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2 backdrop-blur-xl">

                        <BsBookmarkHeartFill className="text-yellow-400" />

                        <span className="text-sm font-semibold tracking-widest text-yellow-300">

                            PREMIUM DIGITAL LIBRARY

                        </span>

                    </div>

                    <h1 className="text-5xl font-black leading-tight text-white md:text-6xl xl:text-7xl">

                        Read.

                        <br />

                        Learn.

                        <br />

                        <span className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 bg-clip-text text-transparent">

                            Inspire.

                        </span>

                    </h1>

                    <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">

                        Discover thousands of carefully selected books,
                        world-famous authors, timeless classics and
                        modern bestsellers inside one beautiful digital
                        bookshelf.

                    </p>

                    <div className="mt-10 flex flex-wrap gap-5">

                        <Link
                            to="/books"
                            className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-600 px-8 py-4 font-bold text-slate-900 shadow-2xl transition duration-500 hover:-translate-y-2 hover:shadow-yellow-500/30"
                        >

                            Explore Books

                            <FaArrowRight className="transition group-hover:translate-x-2" />

                        </Link>

                        <Link
                            to="/events"
                            className="rounded-2xl border border-yellow-500/40 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-yellow-400 hover:bg-white/10"
                        >

                            Library Events

                        </Link>

                    </div>

                    <div className="mt-14 flex flex-wrap gap-10">

                        <div>

                            <h2 className="text-4xl font-black text-yellow-400">

                                20K+

                            </h2>

                            <p className="mt-2 text-slate-400">

                                Premium Books

                            </p>

                        </div>

                        <div>

                            <h2 className="text-4xl font-black text-yellow-400">

                                150+

                            </h2>

                            <p className="mt-2 text-slate-400">

                                Publishers

                            </p>

                        </div>

                        <div>

                            <h2 className="text-4xl font-black text-yellow-400">

                                50K+

                            </h2>

                            <p className="mt-2 text-slate-400">

                                Happy Readers

                            </p>

                        </div>

                    </div>

                </div>

                {/* RIGHT */}

                <div className="relative hidden w-full items-center justify-center lg:flex">

                    {/* Main Glow */}

                    <div className="absolute h-[620px] w-[620px] rounded-full bg-yellow-500/10 blur-[120px]" />

                    {/* Floating Book Stack */}

                    <div className="group relative h-[620px] w-[520px]">

                        {/* Back Book */}

                        <div
                            className="
                            absolute
                            left-6
                            top-10
                            w-[260px]
                            overflow-hidden
                            rounded-[26px]
                            border
                            border-yellow-500/20
                            bg-white/5
                            shadow-2xl
                            backdrop-blur-xl
                            transition-all
                            duration-700
                            group-hover:-translate-x-6
                            group-hover:-translate-y-4
                            group-hover:-rotate-[12deg]
                        "
                        >

                            <img
                                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop"
                                className="h-[360px] w-full object-cover"
                            />

                        </div>

                        {/* Right Book */}

                        <div
                            className="
                            absolute
                            right-0
                            top-24
                            w-[250px]
                            overflow-hidden
                            rounded-[26px]
                            border
                            border-yellow-500/20
                            bg-white/5
                            shadow-2xl
                            backdrop-blur-xl
                            transition-all
                            duration-700
                            group-hover:translate-x-8
                            group-hover:-translate-y-5
                            group-hover:rotate-[14deg]
                        "
                        >

                            <img
                                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop"
                                className="h-[350px] w-full object-cover"
                            />

                        </div>

                        {/* Center Book */}

                        <div
                            className="
                            absolute
                            left-1/2
                            top-16
                            w-[300px]
                            -translate-x-1/2
                            overflow-hidden
                            rounded-[30px]
                            border
                            border-yellow-400/30
                            bg-white/10
                            shadow-[0_40px_120px_rgba(0,0,0,.45)]
                            backdrop-blur-xl
                            transition-all
                            duration-700
                            group-hover:-translate-y-6
                            group-hover:scale-110
                        "
                        >

                            <img
                                src="https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=1200&auto=format&fit=crop"
                                className="h-[430px] w-full object-cover transition duration-700 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            <div className="absolute bottom-0 p-7">

                                <p className="text-sm uppercase tracking-[4px] text-yellow-300">

                                    Featured Collection

                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-white">

                                    Modern Reading

                                </h2>

                            </div>

                        </div>

                        {/* Floating Card */}

                        <div
                            className="
                            absolute
                            -left-10
                            bottom-24
                            animate-bounce
                            rounded-3xl
                            border
                            border-yellow-500/20
                            bg-white/10
                            p-5
                            backdrop-blur-xl
                            [animation-duration:5s]
                        "
                        >

                            <div className="flex items-center gap-4">

                                <div className="rounded-2xl bg-yellow-400 p-4 text-slate-900">

                                    <FaBookOpen />

                                </div>

                                <div>

                                    <h3 className="font-bold text-white">

                                        1,500+

                                    </h3>

                                    <p className="text-sm text-slate-300">

                                        New Releases

                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* Floating Rating */}

                        <div
                            className="
                            absolute
                            -right-8
                            top-5
                            animate-bounce
                            rounded-3xl
                            border
                            border-yellow-500/20
                            bg-white/10
                            p-5
                            backdrop-blur-xl
                            [animation-duration:6s]
                        "
                        >

                            <div className="flex items-center gap-4">

                                <div className="rounded-2xl bg-yellow-400 p-4 text-slate-900">

                                    <FaStar />

                                </div>

                                <div>

                                    <h3 className="font-bold text-white">

                                        4.9★

                                    </h3>

                                    <p className="text-sm text-slate-300">

                                        Reader Rating

                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* Readers */}

                        <div
                            className="
                            absolute
                            bottom-0
                            left-1/2
                            -translate-x-1/2
                            rounded-full
                            border
                            border-yellow-500/20
                            bg-white/10
                            px-8
                            py-4
                            backdrop-blur-xl
                        "
                        >

                            <div className="flex items-center gap-3">

                                <FaUsers className="text-yellow-400" />

                                <span className="font-semibold text-white">

                                    50,000+ Active Readers

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default Banner;