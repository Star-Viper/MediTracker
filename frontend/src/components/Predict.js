import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Predict() {
    const location = useLocation();
    const { predictedDisease, probability } = location.state;

    return (
        <div>
            <h1>Result</h1>
            <p>Predicted Disease: {predictedDisease}</p>
            <p>Probability: {probability}</p>
        </div>
    );
}
