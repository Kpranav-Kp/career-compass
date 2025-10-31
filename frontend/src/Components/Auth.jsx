import React, { useState, useEffect } from 'react';
import SignIn from './Login';  // Your SignIn component
import Signup from './Signup';  // Your Signup component

const Auth = ({ startWithSignUp = false }) => {
    const [isSignUp, setIsSignUp] = useState(startWithSignUp);

    useEffect(() => {
        setIsSignUp(startWithSignUp);
    }, [startWithSignUp]);

    return (
        <div className="w-full flex items-center justify-center">
            {isSignUp ? (
                <Signup />
            ) : (
                <SignIn />
            )}
            <div className="absolute bottom-5">
                {isSignUp ? (
                    <span>Already have an account? 
                        <a href="#" className="text-[#4285F4]" onClick={() => setIsSignUp(false)}> Sign in</a>
                    </span>
                ) : (
                    <span>No Account? 
                        <a href="#" className="text-[#4285F4]" onClick={() => setIsSignUp(true)}> Sign up</a>
                    </span>
                )}
            </div>
        </div>
    );
};

export default Auth;
