// src/router.jsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
<<<<<<< HEAD
import { FavoritesList } from "./pages/FavoritesList";
import ProfilePage from "./pages/Profile-page";
=======
import { Signup } from "./pages/Signup";           
import ProfilePage from "./pages/Profile-page";     
>>>>>>> 2383b475a84be406731fe51c001282829bf2a0c3
import Login from "./pages/Login.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      {/* Root shows Login */}
      <Route index element={<Login />} />

      {/* Pages */}
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
<<<<<<< HEAD
      <Route path="/profile/:userId" element={<ProfilePage />} />
      <Route path="/favoritesList" element={<FavoritesList />} />
    </Route >

=======
    </Route>
>>>>>>> 2383b475a84be406731fe51c001282829bf2a0c3
  )
);
