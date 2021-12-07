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

    const { signInUser, createUser } = useAuth();
    const handleSubmit = (event) => {
        event.preventDefault();

        if (isLogInView) {
            signInUser(userData)
                .then(() => toggleAuthModal())
                .catch(error => {
                    console.log(error.message)
                });
        } else {
            createUser(userData)
                .then(() => toggleAuthModal())
                .catch(error => {
                    console.log(error.message)
                });
        }
    }

    const [ isLogInView, setIsLogInView ] = useState(true);
    const toggleLogInView = () => {
        setIsLogInView(previousIsLogInView => !previousIsLogInView);
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
                    { isLogInView ? ("Log in") : ("Register") }
                </button>
            </form>

            <button onClick={ toggleLogInView }>
                { isLogInView ? ("Create an account") : ("already have an account? Log in") }
            </button>
        </div>
    );
}

export default Auth;