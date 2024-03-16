import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Ask() {
    const [symptoms, setSymptoms] = useState({
        Fever: false,
        Cough: false,
        Sore_throat: false,
        Body_aches: false,
        Fatigue: false,
        Runny_nose: false,
        Sneezing: false,
        Mild_fever: false,
        Itchy_eyes: false,
        Nausea: false,
        Vomiting: false,
        Diarrhea: false,
        Abdominal_pain: false
    });

    const navigate = useNavigate();

    const handleCheckboxChange = (symptom) => {
        setSymptoms(prevState => ({
            ...prevState,
            [symptom]: !prevState[symptom]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Redirect to the result page with the selected symptoms
        navigate('/result', { state: { symptoms } });
    };

    return (
        <div>
            <h1>Symptom Checker</h1>
            <form onSubmit={handleSubmit}>
                {Object.keys(symptoms).map((symptom, index) => (
                    <div key={index}>
                        <label>
                            <input
                                type="checkbox"
                                checked={symptoms[symptom]}
                                onChange={() => handleCheckboxChange(symptom)}
                            />
                            {symptom}
                        </label>
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
