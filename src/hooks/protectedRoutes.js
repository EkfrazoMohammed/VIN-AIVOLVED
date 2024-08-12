import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = useSelector((state) => state.auth.authData.access_token); // Get token from authSlice
    console.log(token, "<<<")
    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
}