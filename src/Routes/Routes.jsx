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
import AddBook from "../Componentes/Admin/AddBook/AddBook";
import SignIn from "../Componentes/SignIn/SignIn";
import SignUp from "../Componentes/SignUp/SignUp";

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
            element: <AddBook></AddBook>
          }
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