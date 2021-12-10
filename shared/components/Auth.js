import { useState } from 'react';

import { getFirestore, setDoc, doc } from 'firebase/firestore';

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
            const db = getFirestore();
            signUpUser(userData)
                .then(userCredential => {
                    setDoc(doc(db, 'users', userCredential.user.uid), {
                        liked: []
                    });

                    toggleAuthModal();
                })
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
        setSubmitError('');
        setIsSignInView(previousIsSignInView => !previousIsSignInView);
    }

    return (
        <div>
            <button
                onClick={ toggleAuthModal }
                className="modal-close-button"
                title="close">
                <svg
                    className="modal-close-button__icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>

            <div className="text-2 font-weight-700 text-center">
                animal buddies
            </div>
            <p className="text-center">
                { isSignInView ? ("log in to like posts") : ("create an account to like posts") }
            </p>

            <form onSubmit={ handleSubmit }>
                <div className="auth-form-group">
                    <label htmlFor="email">email</label>
                    <input
                        type="email"
                        id="email"
                        className="mb-1"
                        onChange={ handleInputChange }
                        value={ userData.email }
                        required />
                </div>

                <div className="auth-form-group">
                    <label htmlFor="password">password</label>
                    <input
                        type="password"
                        id="password"
                        className="mb-1"
                        onChange={ handleInputChange }
                        value={ userData.password }
                        required />
                </div>

                <button className={ `auth-button ${ isSignInView ? ("auth-button--sign-in") : ("auth-button--sign-up") } mb-1` }>
                    { isSignInView ? ("Log in") : ("create account") }
                </button>

                { submitError ? (
                    <p className="color-red-1">
                       { submitError }
                    </p> 
                ) : (null) }
            </form>

            <button
                className="color-dark-blue-1 text-decoration-underline"
                onClick={ toggleSignInView }>
                { isSignInView ? ("Create an account") : ("sign in") }
            </button>
        </div>
    );
}

export default Auth;