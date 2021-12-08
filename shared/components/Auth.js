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
    const handleSubmit = (event) => {
        event.preventDefault();

        if (isSignInView) {
            signInUser(userData)
                .then(() => toggleAuthModal())
                .catch(error => {
                    console.log(error.message)
                });
        } else {
            signUpUser(userData)
                .then(() => toggleAuthModal())
                .catch(error => {
                    console.log(error.message)
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
                <label>email</label>
                <input
                    type="email"
                    id="email"
                    onChange={ handleInputChange }
                    value={ userData.email } />

                <label>password</label>
                <input
                    type="password"
                    id="password"
                    onChange={ handleInputChange }
                    value={ userData.password } />
                <button>
                    { isSignInView ? ("Log in") : ("create account") }
                </button>
            </form>

            <button onClick={ toggleSignInView }>
                { isSignInView ? ("Create an account") : ("already have an account? sign in") }
            </button>
        </div>
    );
}

export default Auth;