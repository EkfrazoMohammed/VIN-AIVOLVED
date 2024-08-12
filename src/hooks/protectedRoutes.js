import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element }) => {
    const token = useSelector((state) => state.auth.authData.access_token); // Get token from authSlice
    const plantData = useSelector((state) => state.plant.plantData); // Get PlantData from plantSlice
    console.log(token, element, "<<<")

    if (!token) {
        // If the user is not authenticated, redirect them to the login page
        return <Navigate to="/login" replace />;
    }


    return element;
};

export default ProtectedRoute;
