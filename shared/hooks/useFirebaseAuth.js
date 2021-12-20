import { useEffect, useState } from 'react';

import '../../firebase';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const useFirebaseAuth = () => {
    const [ authUser, setAuthUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    const auth = getAuth();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                setAuthUser(null);
                setLoading(false);
                return;
            }
            
            setAuthUser({
                uid: user.uid,
                email: user.email
            });

            setLoading(false);
        });
    }, []);

    const signUpUser = ({ email, password }) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signInUser = ({ email, password }) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const signOutUser = () => {
        signOut(auth)
            .then(() => {
                setAuthUser(null);
            });
    }

    return {
        authUser,
        loading,
        signUpUser,
        signInUser,
        signOutUser
    }
}

export default useFirebaseAuth;
