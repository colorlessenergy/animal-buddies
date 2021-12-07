import { createContext, useContext } from 'react';

import useFirebaseAuth from '../hooks/useFirebaseAuth';

const authUserContext = createContext({
    authUser: null,
    loading: true,
    signInWithEmailAndPassword: () => {},
    createUserWithEmailAndPassword: () => {},
    signOut: () => {}
});

export function AuthUserProvider ({ children }) {
    const auth = useFirebaseAuth();

    if (auth.loading) {
        return (
            <div>
                loading auth
            </div>
        );
    }

    return (
        <authUserContext.Provider value={ auth }>
            { children }
        </authUserContext.Provider>
    );
}

export const useAuth = () => useContext(authUserContext);