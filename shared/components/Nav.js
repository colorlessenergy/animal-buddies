import { useAuth } from '../contexts/AuthUserContext';

const Nav = ({ toggleAuthModal }) => {
    const { authUser, signOutUser } = useAuth();

    return (
        <nav>
            <div>
                animal buddies
            </div>

            { authUser ? (
                <button onClick={ signOutUser }>log out</button>
            ) : (
                <button onClick={ toggleAuthModal }>log in</button>
            ) }
        </nav>
    );
};

export default Nav;