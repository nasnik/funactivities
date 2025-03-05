import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import ProviderPage from "./components/ProviderPage.tsx";
import ActivityPage from "./components/ActivityPage.tsx";
import BookingPage from "./components/BookingPage.tsx";
import SuccessPage from "./components/SuccessPage.tsx";
import ProviderRegistration from "./components/ProviderRegistration.tsx";


function App() {

  return (
      <BrowserRouter>
          <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/booking" element={<BookingPage/>} />
                <Route path="/success" element={<SuccessPage/>} />
              <Route path="/provider-registration" element={<ProviderRegistration />} />
              <Route path="/activities/:id" element={<ActivityPage />} />
              <Route path="/activities/provider/:providerId" element={<ProviderPage />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
