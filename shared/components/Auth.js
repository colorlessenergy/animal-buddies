import { useState } from 'react';

import { useAuth } from '../contexts/AuthUserContext';

const Auth = ({ toggleAuthModal }) => {
    const [ userData, setUserData ] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (event) => {
        setUserData(previousUserData => ({
            ...previousUserData,
            [ event.target.id ]: event.target.value
        }));
    }

    const { signInUser, signUpUser } = useAuth();
    const [ submitError, setSubmitError ] = useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitError('');

        if (isSignInView) {
            signInUser(userData)
                .then(() => toggleAuthModal())
                .catch(() => setSubmitError('That email and password combination is incorrect.'));
        } else {
            signUpUser(userData)
                .then(() => toggleAuthModal())
                .catch(error => {
                    if (error.code === 'auth/weak-password') {
                        setSubmitError('Password should be at least 6 characters.');
                    } else if (error.code === 'auth/email-already-in-use') {
                        setSubmitError('Email is already in use.');
                    }
                });
        }
    }

    const [ isSignInView, setIsSignInView ] = useState(true);
    const toggleSignInView = () => {
        setIsSignInView(previousIsSignInView => !previousIsSignInView);
    }

    return (
        <div>
            <form onSubmit={ handleSubmit }>
                <label htmlFor="email">email</label>
                <input
                    type="email"
                    id="email"
                    onChange={ handleInputChange }
                    value={ userData.email }
                    required />

                <label htmlFor="password">password</label>
                <input
                    type="password"
                    id="password"
                    onChange={ handleInputChange }
                    value={ userData.password }
                    required />
                <button>
                    { isSignInView ? ("Log in") : ("create account") }
                </button>

                { submitError ? (
                    <p>
                       { submitError }
                    </p> 
                ) : (null) }
            </form>

            <button onClick={ toggleSignInView }>
                { isSignInView ? ("Create an account") : ("already have an account? sign in") }
            </button>
        </div>
    );
}

export default Auth;