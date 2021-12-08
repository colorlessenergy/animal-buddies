import { useEffect, useState } from 'react';
import Head from 'next/head';

import Nav from '../shared/components/Nav';
import Modal from '../shared/components/Modal/Modal';
import Auth from '../shared/components/Auth';

import '../firebase';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

export default function Home () {
    const [ isAuthModalOpen, setIsAuthModalOpen ] = useState(false);
    const toggleAuthModal = () => {
        setIsAuthModalOpen(previousIsAuthModalOpen => !previousIsAuthModalOpen);
    }

    const [ posts, setPosts ] = useState([]);
    const db = getFirestore();
    useEffect(() => {
        onSnapshot(collection(db, "posts"), (querySnapshot) => {
            let postsFromFirestore = [];
            querySnapshot.forEach(document => {
                postsFromFirestore.push({
                    ...document.data(),
                    id: document.id
                });
            });
            setPosts(postsFromFirestore);
        });
    }, []);

    return (
        <div>
            <Head>
                <title>animal buddies</title>
                <meta name="description" content="pictures of awesome animals" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Nav toggleAuthModal={ toggleAuthModal } />

            <div>
                { posts ? (posts.map(post => {
                    return (
                        <div key={ post.id }>
                            <img src={ post.image } alt={ post.title } />

                            <div>
                                <div>
                                    { post.title }
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16">
                                    <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                                </svg>
                            </div>

                            <div>
                                <a href={ post.source }>
                                    source
                                </a>
                            </div>
                        </div>
                        )
                    })
                ) : (null) }
            </div>

            { isAuthModalOpen ? (
                <Modal isOpen={ isAuthModalOpen }>
                    <Auth toggleAuthModal={ toggleAuthModal } />
                </Modal>
            ) : (null) }
        </div>
    );
}
