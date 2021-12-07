import { useState } from 'react';
import Head from 'next/head';

import Nav from '../shared/components/Nav';
import Modal from '../shared/components/Modal/Modal';
import Auth from '../shared/components/Auth';

export default function Home () {
    const [ isAuthModalOpen, setIsAuthModalOpen ] = useState(false);
    const toggleAuthModal = () => {
        setIsAuthModalOpen(previousIsAuthModalOpen => !previousIsAuthModalOpen);
    }

    return (
        <div>
            <Head>
                <title>animal buddies</title>
                <meta name="description" content="pictures of awesome animals" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Nav toggleAuthModal={ toggleAuthModal } />

            { isAuthModalOpen ? (
                <Modal isOpen={ isAuthModalOpen }>
                    <Auth toggleAuthModal={ toggleAuthModal } />
                </Modal>
            ) : (null) }
        </div>
    );
}
