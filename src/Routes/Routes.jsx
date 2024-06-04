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
        path: "/contact",
        element: <Contact></Contact>
      },
      {
        path: "/admin",
        element: <Admin></Admin>
      },
      {
        path: "/profile",
        element: <Profile></Profile>
      }
    ]
  },
]);

export default router;