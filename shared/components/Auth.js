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