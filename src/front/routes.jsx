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
import { CreateEvent } from "./pages/CreateEvent";
import { CreateGoal } from "./pages/CreateGoal.jsx";
import { Signup } from "./pages/Signup";
import { FavoritesList } from "./pages/FavoritesList";
import ProfilePage from "./pages/Profile-page";
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
      <Route path="/profile/:userId" element={<ProfilePage />} />
      <Route path="/create/event" element={<CreateEvent />} />
      <Route path="/create/goal" element={<CreateGoal />} />
      <Route path="/favoritesList" element={<FavoritesList />} />
    </Route >

  )
);
