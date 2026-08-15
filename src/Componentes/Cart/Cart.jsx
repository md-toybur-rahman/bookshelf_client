import React, {
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

import Swal from "sweetalert2";

import {
    FaShoppingBag,
    FaPlus,
    FaMinus,
    FaTrashAlt,
    FaArrowRight
} from "react-icons/fa";

import { Link } from "react-router-dom";

import { AuthContext } from "../../Providers/AuthProvider";

const Cart = () => {

    const { user } = useContext(AuthContext);

    const [cartBooks, setCartBooks] = useState([]);

    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    /* ==========================
        Load Cart
    =========================== */

    useEffect(() => {

        if (!user?.email) return;

        fetch(`https://bookshelf-server-zot1.onrender.com/cart/${user.email}`, {

            headers: {

                authorization: `Bearer ${token}`

            }

        })

            .then(res => res.json())

            .then(data => {

                const books = data.map(book => ({

                    ...book,

                    quantity: 1

                }));

                setCartBooks(books);

                setLoading(false);

            })

            .catch(err => {

                console.log(err);

                setLoading(false);

            });

    }, [user]);



    /* ==========================
        Quantity
    =========================== */

    const increaseQuantity = (_id) => {

        setCartBooks(prev =>

            prev.map(item =>

                item._id === _id

                    ? {

                        ...item,

                        quantity: item.quantity + 1

                    }

                    : item

            )

        );

    };



    const decreaseQuantity = (_id) => {

        setCartBooks(prev =>

            prev.map(item =>

                item._id === _id

                    ? {

                        ...item,

                        quantity:

                            item.quantity > 1

                                ? item.quantity - 1

                                : 1

                    }

                    : item

            )

        );

    };



    /* ==========================
        Remove
    =========================== */

    const removeBook = async (_id) => {

        const confirm = await Swal.fire({

            title: "Remove Book?",

            text: "This book will be removed from your cart.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Remove",

            confirmButtonColor: "#d4af37",

            cancelButtonColor: "#444"

        });

        if (!confirm.isConfirmed) return;

        fetch(

            `https://bookshelf-server-zot1.onrender.com/cart/${user.email}/${_id}`,

            {

                method: "DELETE",

                headers: {

                    authorization: `Bearer ${token}`

                }

            }

        )

            .then(res => res.json())

            .then(data => {

                if (data.success) {

                    setCartBooks(prev =>

                        prev.filter(book =>

                            book?._id !== _id

                        )

                    );

                    Swal.fire({

                        icon: "success",

                        title: "Removed",

                        timer: 1500,

                        showConfirmButton: false

                    });

                }

            });

    };



    /* ==========================
        Summary
    =========================== */

    const subtotal = useMemo(() => {

        return cartBooks.reduce(

            (sum, book) =>

                sum + (book?.price * book?.quantity),

            0

        );

    }, [cartBooks]);



    const tax = subtotal * 0.05;

    const total = subtotal + tax;



    if (loading) {

        return (

            <div className="min-h-screen flex justify-center items-center">

                <span className="loading loading-spinner loading-lg text-warning"></span>

            </div>

        );

    }



    return (

        <section className="relative min-h-screen overflow-hidden py-10 md:py-20">

            {/* Background */}

            <div className="absolute inset-0 bg-gradient-to-br from-[#120d09] via-[#18120e] to-[#090909]" />

            <div className="absolute -left-48 top-0 h-[420px] w-[420px] rounded-full bg-yellow-500/10 blur-[130px]" />

            <div className="absolute -right-48 bottom-0 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[160px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-5">

                {/* Hero */}

                <div className="text-center mb-10 md:mb-20">

                    <div className="mx-auto w-12 h-12 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-300 to-yellow-700 flex justify-center items-center shadow-[0_0_60px_rgba(212,175,55,.4)]">

                        <FaShoppingBag className="text-2xl md:text-4xl text-black" />

                    </div>

                    <h1 className="mt-5 md:mt-8 text-3xl lg:text-8xl font-black leading-none text-white">

                        <span className="block bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent">

                            My Cart

                        </span>

                    </h1>

                    <p className="mt-3 md:mt-6 max-w-2xl mx-auto text-slate-400">

                        Review every selected book before completing your purchase.

                    </p>

                </div>

                {
                    cartBooks.length === 0 ?

                        <div className="max-w-xl mx-auto rounded-[34px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#19130e] to-[#130f0d] p-14 text-center shadow-[0_30px_70px_rgba(0,0,0,.45)]">

                            <div className="mx-auto w-32 h-32 rounded-full flex items-center justify-center bg-amber-400/10 border border-amber-400/20">

                                <FaShoppingBag className="text-6xl text-amber-300" />

                            </div>

                            <h2 className="mt-10 text-4xl font-black">

                                Cart Is Empty

                            </h2>

                            <p className="mt-5 text-slate-400">

                                You haven't added any books yet.

                            </p>

                            <Link

                                to="/books"

                                className="inline-flex items-center gap-3 mt-10 px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-amber-300 via-yellow-500 to-yellow-700 text-black hover:scale-105 duration-300"

                            >

                                Browse Books

                                <FaArrowRight />

                            </Link>

                        </div>

                        :

                        <div className="grid lg:grid-cols-3 gap-10">

                            {/* LEFT */}

                            <div className="lg:col-span-2 space-y-8">

                                {

                                    cartBooks.map(book => (

                                        <div

                                            key={book?._id}

                                            className="group relative overflow-hidden rounded-[34px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#19130e] to-[#130f0d] p-7 transition duration-500 hover:-translate-y-2 hover:border-amber-400/40 hover:shadow-[0_30px_70px_rgba(0,0,0,.5)]"

                                        >

                                            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-yellow-400/10 blur-[110px]" />

                                            <div className="relative z-10 flex flex-row gap-8">

                                                <img

                                                    src={book?.cover_image}

                                                    alt={book?.book_name}

                                                    className="md:w-44 w-20 h-24 md:h-64 rounded-2xl object-cover shadow-2xl transition duration-500 group-hover:scale-105 group-hover:rotate-2"

                                                />

                                                <div className="flex-1">

                                                    <span className="inline-block px-4 py-2 rounded-full text-xs tracking-[3px] uppercase bg-gradient-to-r from-amber-300 to-yellow-700 text-black font-bold">

                                                        {book?.genre}

                                                    </span>

                                                    <h2 className="mt-2 md:mt-5 text-lg md:text-3xl font-black">

                                                        {book?.book_name}

                                                    </h2>

                                                    <p className="md:mt-3 text-slate-400 text-xs md:text-base">

                                                        {book?.author_name}

                                                    </p>

                                                    <div className="mt-5 md:mt-10 hidden md:flex flex-wrap gap-2 md:gap-10">

                                                        <div>

                                                            <p className="text-slate-500 text-xs md:text-base">

                                                                Price

                                                            </p>

                                                            <h3 className="text-amber-300 text-lg md:text-3xl font-black">

                                                                ${book?.price}

                                                            </h3>

                                                        </div>


                                                        <div>

                                                            <p className="text-slate-500 text-xs md:text-base">

                                                                Quantity

                                                            </p>

                                                            <div className="mt-3 flex items-center md:gap-3">

                                                                <button

                                                                    onClick={() => decreaseQuantity(book?._id)}

                                                                    className="w-11 h-11 rounded-xl border border-amber-500/20 hover:bg-amber-400 hover:text-black duration-300 flex items-center justify-center"

                                                                >

                                                                    <FaMinus />

                                                                </button>

                                                                <span className="md:text-2xl font-bold w-8 text-center">

                                                                    {book?.quantity}

                                                                </span>

                                                                <button

                                                                    onClick={() => increaseQuantity(book?._id)}

                                                                    className="w-11 h-11 rounded-xl border border-amber-500/20 hover:bg-amber-400 hover:text-black duration-300 flex items-center justify-center"

                                                                >

                                                                    <FaPlus />

                                                                </button>

                                                            </div>

                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="hidden md:flex items-end">

                                                    <button

                                                        onClick={() => removeBook(book?._id)}

                                                        className="flex items-center gap-3 px-6 py-4 rounded-xl border border-red-500/30 hover:bg-red-500 duration-300"

                                                    >

                                                        <FaTrashAlt />

                                                        Remove

                                                    </button>

                                                </div>

                                            </div>

                                            <div className="mt-5 flex md:hidden justify-between items-end flex-wrap gap-2 md:gap-10">

                                                <div>

                                                    <p className="text-slate-500 text-xs md:text-base">

                                                        Quantity

                                                    </p>

                                                    <div className="mt-3 flex items-center md:gap-3">

                                                        <button

                                                            onClick={() => decreaseQuantity(book?._id)}

                                                            className="w-11 h-11 rounded-xl border border-amber-500/20 hover:bg-amber-400 hover:text-black duration-300 flex items-center justify-center"

                                                        >

                                                            <FaMinus />

                                                        </button>

                                                        <span className="md:text-2xl font-bold w-8 text-center">

                                                            {book?.quantity}

                                                        </span>

                                                        <button

                                                            onClick={() => increaseQuantity(book?._id)}

                                                            className="w-11 h-11 rounded-xl border border-amber-500/20 hover:bg-amber-400 hover:text-black duration-300 flex items-center justify-center"

                                                        >

                                                            <FaPlus />

                                                        </button>

                                                    </div>

                                                </div>
                                                <div className="flex items-end justify-end">

                                                    <button

                                                        onClick={() => removeBook(book?._id)}

                                                        className="flex items-center gap-3 px-3 md:px-6 py-2 md:py-4 rounded-xl border border-red-500/30 hover:bg-red-500 duration-300"

                                                    >

                                                        <FaTrashAlt />

                                                        Remove

                                                    </button>

                                                </div>
                                            </div>

                                        </div>

                                    ))

                                }

                            </div>

                            {/* SUMMARY */}

                            <div>

                                <div className="sticky top-24 rounded-[34px] border border-amber-500/15 bg-gradient-to-br from-[#24160f] via-[#19130e] to-[#130f0d] p-8 shadow-[0_20px_60px_rgba(0,0,0,.45)]">

                                    <h2 className="text-2xl md:text-4xl font-black">

                                        Order Summary

                                    </h2>

                                    <div className="mt-5 md:mt-10 space-y-6 text-xs md:text-base">

                                        <div className="flex justify-between">

                                            <span className="text-slate-400">

                                                Subtotal

                                            </span>

                                            <span>

                                                ${subtotal.toFixed(2)}

                                            </span>

                                        </div>

                                        <div className="flex justify-between">

                                            <span className="text-slate-400">

                                                Tax (5%)

                                            </span>

                                            <span>

                                                ${tax.toFixed(2)}

                                            </span>

                                        </div>

                                        <div className="border-t border-amber-500/20 pt-6 flex justify-between text-xl md:text-3xl font-black">

                                            <span>Total</span>

                                            <span className="text-amber-300">

                                                ${total.toFixed(2)}

                                            </span>

                                        </div>

                                    </div>

                                    <button

                                        className="w-full mt-5 md:mt-10 py-3 md:py-5 rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-500 to-yellow-700 text-black font-black text-base md:text-lg hover:scale-[1.03] duration-300"

                                    >

                                        Proceed To Checkout

                                    </button>

                                </div>

                            </div>

                        </div>

                }

            </div>

        </section>

    );

};

export default Cart;