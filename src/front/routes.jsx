import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import SettingsPage from "./pages/settings-page";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { CreateEvent } from "./pages/CreateEvent";
import { Signup } from "./pages/Signup";
import { FavoritesList } from "./pages/FavoritesList";
import ProfilePage from "./pages/Profile-page";
import Login from "./pages/Login.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import GoalTracker from "./pages/Goals-page.jsx";
import { UserSearch } from "./components/UserSearch.jsx";
import EventList from "./pages/EventList.jsx";
import ListViewer from "./components/ListViewer.jsx";
import { EditEvent } from "./pages/EditEvent.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route index element={<Login />} />

      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<Signup />} />

      {/* Profile routes */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />

      <Route path="/goals" element={<GoalTracker />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/create/event" element={<CreateEvent />} />
      <Route path="/events/:eventId" element={<EventDetails />} />
      <Route path="/eventlist/:userId" element={<EventList />} />
      <Route path="/favoritesList" element={<FavoritesList />} />
      <Route path="/search" element={<UserSearch />} />
      <Route path="/listview/:userId" element={<ListViewer />} />
      <Route path="/edit/event/:eventId" element={<EditEvent />} />
    </Route>
  )
);
