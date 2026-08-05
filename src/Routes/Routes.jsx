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
import News from "../Componentes/News/News";
import SignIn from "../Componentes/SignIn/SignIn";
import SignUp from "../Componentes/SignUp/SignUp";
import BookDetials from "../Componentes/Shared/BookDetails/BookDetails";
import Welcome from "../Componentes/Admin/Welcome/Welcome";
import AddBook from "../Componentes/Admin/BookManagement/AddBook/AddBook";
import UpdateBook from "../Componentes/Admin/BookManagement/UpdateBook/UpdateBook";
import DeleteBook from "../Componentes/Admin/BookManagement/DeleteBook/DeleteBook";
import PrivateRoute from "./PrivateRoute";
import JWTDecode from "../Componentes/JWTDecode/JWTDecode";
import AddEvent from "../Componentes/Admin/EventManagement/AddEvent/AddEvent";
import UpdateEvent from "../Componentes/Admin/EventManagement/UpdateEvent/UpdateEvent";
import DeleteEvent from "../Componentes/Admin/EventManagement/DeleteEvent/DeleteEvent";
import BookDetails from "../Componentes/Shared/BookDetails/BookDetails";
import Cart from "../Componentes/Cart/Cart";
import MyProfile from "../Componentes/MyProfile/MyProfile";
import AddNews from "../Componentes/Admin/NewsManagement/AddNews/AddNews";
import UpdateNews from "../Componentes/Admin/NewsManagement/UpdateNews/UpdateNews";
import DeleteNews from "../Componentes/Admin/NewsManagement/DeleteNews/DeleteNews";
import Community from "../Componentes/Admin/Community/Community";
import ContactMessage from "../Componentes/Admin/ContactMessage/ContactMessage";
import Settings from "../Componentes/Admin/Settings/Settings";
import Users from "../Componentes/Admin/Users/Users";
import AdminRoute from "./AdminRoute";

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
        element: <PrivateRoute><BookDetails /></PrivateRoute>,
        loader: ({ params }) => fetch(`http://localhost:2000/book/${params.id}`)
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
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/profile",
        element: <MyProfile />
      },
      {
        path: "/admin",
        element: <PrivateRoute><AdminRoute><Admin></Admin></AdminRoute></PrivateRoute>,
        children: [
          {
            path: "/admin",
            element: <PrivateRoute><Welcome></Welcome></PrivateRoute>
          },
          {
            path: "/admin/add_book",
            element: <PrivateRoute><AddBook></AddBook></PrivateRoute>
          },
          {
            path: "/admin/update_book",
            element: <PrivateRoute><UpdateBook></UpdateBook></PrivateRoute>
          },
          {
            path: "/admin/delete_book",
            element: <PrivateRoute><DeleteBook></DeleteBook></PrivateRoute>
          },
          {
            path: "/admin/add_event",
            element: <PrivateRoute><AddEvent></AddEvent></PrivateRoute>
          },
          {
            path: "/admin/update_event",
            element: <PrivateRoute><UpdateEvent></UpdateEvent></PrivateRoute>
          },
          {
            path: "/admin/delete_event",
            element: <PrivateRoute><DeleteEvent></DeleteEvent></PrivateRoute>
          },
          {
            path: "/admin/add_news",
            element: <PrivateRoute><AddNews /></PrivateRoute>
          },
          {
            path: "/admin/update_news",
            element: <PrivateRoute><UpdateNews /></PrivateRoute>
          },
          {
            path: "/admin/delete_news",
            element: <PrivateRoute><DeleteNews /></PrivateRoute>
          },
          {
            path: "/admin/community",
            element: <PrivateRoute><Community /></PrivateRoute>
          },
          {
            path: "/admin/messages",
            element: <PrivateRoute><ContactMessage /></PrivateRoute>
          },
          {
            path: "/admin/users",
            element: <PrivateRoute><Users /></PrivateRoute>
          },
          {
            path: "/admin/settings",
            element: <PrivateRoute><Settings /></PrivateRoute>
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