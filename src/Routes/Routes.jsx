import * as React from "react";
import {
  createBrowserRouter
} from "react-router-dom";
import Layout from "../Componentes/Layout/Layout";
import Home from "../Componentes/Home/Home";
import Books from "../Componentes/Books/Books";
import Events from "../Componentes/Events/Events";
import Contact from "../Componentes/Contact/Contact";
import Admin from "../Componentes/Admin/Admin";
import Profile from "../Componentes/Profile/Profile";
import News from "../Componentes/News/News";
import SignIn from "../Componentes/SignIn/SignIn";
import SignUp from "../Componentes/SignUp/SignUp";
import BookDetials from "../Componentes/Shared/BookDetails/BookDetials";
import Welcome from "../Componentes/Admin/Welcome/Welcome";
import AddBook from "../Componentes/Admin/BookManagement/AddBook/AddBook";
import UpdateBook from "../Componentes/Admin/BookManagement/UpdateBook/UpdateBook";
import DeleteBook from "../Componentes/Admin/BookManagement/DeleteBook/DeleteBook";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,
    children: [
      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: "/books",
        element: <Books></Books>
      },
      {
        path: "/book/:id",
        element: <PrivateRoute><BookDetials></BookDetials></PrivateRoute>,
        loader: ({ params }) => fetch(`https://bookshelf-server-cyan.vercel.app/book/${params.id}`)
      },
      {
        path: "/events",
        element: <Events></Events>
      },
      {
        path: "/news",
        element: <News></News>
      },
      {
        path: "/contact",
        element: <Contact></Contact>
      },
      {
        path: "/profile",
        element: <Profile></Profile>
      },
      {
        path: "/admin",
        element: <Admin></Admin>,
        children: [
          {
            path: "/admin",
            element: <Welcome></Welcome>
          },
          {
            path: "/admin/add_book",
            element: <AddBook></AddBook>
          },
          {
            path: "/admin/update_book",
            element: <UpdateBook></UpdateBook>
          },
          {
            path: "/admin/delete_book",
            element: <DeleteBook></DeleteBook>
          },
        ]
      },
    ]
  },
  {
    path: "/signin",
    element: <SignIn></SignIn>
  },
  {
    path: "signup",
    element: <SignUp></SignUp>
  }
]);

export default router;