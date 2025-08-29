import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Landing from "./Landing.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Lattice3D from './components/background/Lattice3D.jsx'
import Login from "./Login.jsx";
import PostLogin from './PostLogin.jsx'
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL; 
axios.defaults.withCredentials = true; 

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login/>},
  { path: "/post-login", element: <PostLogin/> },
  { path: "/flow/:id", element: <App /> }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Lattice3D/>
  </StrictMode>
);
