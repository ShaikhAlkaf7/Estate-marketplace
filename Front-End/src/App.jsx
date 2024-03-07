import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../src/pages/Home";
import SignUp from "./pages/SignUp";
import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Header from "./components/Header";
import PageNotFound from "./pages/PageNotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { signInSuccess } from "./redux/userSlice";
import PrivateRoutes from "./components/PrivateRoutes";
import CreateListing from "./pages/CreateListing";
import UpdateListng from "./pages/UpdateListng";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
function App() {
  const dispatch = useDispatch();
  const userData = localStorage.getItem("user");
  dispatch(signInSuccess(JSON.parse(userData)));
  return (
    <BrowserRouter>
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:id" element={<UpdateListng />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
