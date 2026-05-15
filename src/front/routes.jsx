import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/login/Login";
import { Signup } from "./pages/signup/Signup";
import { GameDetail } from "./pages/game-detail/GameDetail";
import { TierList } from "./pages/tier-list/TierList";
import { Profile } from "./pages/profile/Profile";
import { Survey } from "./pages/survey/Survey";
import { RequireAuth } from "./components/RequireAuth";

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
        <Route path="/" element={<Home />} />
        <Route path="/games/:id" element={<GameDetail />} />
        <Route path="/tier-list" element={<TierList />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    )
);