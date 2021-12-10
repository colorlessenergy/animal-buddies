import { useEffect, useState } from 'react';
import Head from 'next/head';

import Nav from '../shared/components/Nav';
import Modal from '../shared/components/Modal/Modal';
import Auth from '../shared/components/Auth';

import '../firebase';
import { getFirestore, collection, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../shared/contexts/AuthUserContext';

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

            sortPostsByOptions(postsFromFirestore);
        });
    }, []);

    const { authUser } = useAuth();
    const handleLikeOrUnLikePost = ({ postID, isLiked }) => {
        if (isLiked) {
            const postRef = doc(db, 'posts', postID);
            updateDoc(postRef, {
                liked: arrayRemove(authUser.uid)
            });
        } else {
            const postRef = doc(db, 'posts', postID);
            updateDoc(postRef, {
                liked: arrayUnion(authUser.uid)
            });
        }
    }

    const [ sortOptions, setSortOptions ] = useState({
        liked: true,
        heart: false
    });

    useEffect(() => {
        sortPostsByOptions(posts);
    }, [ sortOptions.liked, sortOptions.heart ]);

    const sortPostsByOptions = (posts) => {
        if (posts.length === 0) return;
        const clonePosts = JSON.parse(JSON.stringify(posts));

        clonePosts.sort(sortPostsByLiked);
        clonePosts.sort(sortPostsByHeart);

        setPosts(clonePosts);
    }

    const sortPostsByHeart = (postOne, postTwo) => {
        if (sortOptions.heart) {
            if (postOne.liked.includes(authUser.uid) && postTwo.liked.includes(authUser.uid)) {
                return 0;
            } else if (postOne.liked.includes(authUser.uid) && !postTwo.liked.includes(authUser.uid)) {
                return -1;
            } else  {
                return 1;
            }
        } else {
            if (postOne.liked.includes(authUser.uid) && postTwo.liked.includes(authUser.uid)) {
                return 0;
            } else if (postOne.liked.includes(authUser.uid) && !postTwo.liked.includes(authUser.uid)) {
                return 1;
            } else  {
                return -1;
            }
        }
    }

    const sortPostsByLiked = (postOne, postTwo) => {
        if (postOne.liked.length === postTwo.liked.length) {
            return postTwo.createdAt.seconds - postOne.createdAt.seconds;
        }

        if (sortOptions.liked) {
            return postTwo.liked.length - postOne.liked.length;
        } else {
            return postOne.liked.length - postTwo.liked.length;
        }
    }

    const toggleSortOptions = (sortType) => {
        setSortOptions(previousSortOptions => ({
            ...previousSortOptions,
            [ sortType ]: !previousSortOptions[ sortType ]
        }));
    }

    const [ searchValue, setSearchValue ] = useState('');
    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    }
    const filterPostBySearch = (post) => {
        if (post.title.includes(searchValue)) {
            return true;
        }

        for(let i = 0; i < post.tags.length; i++) {
            if (post.tags[ i ].includes(searchValue)) {
                return true;
            }
        }

        return false;
    }

    return (
        <div>
            <Head>
                <title>animal buddies</title>
                <meta name="description" content="pictures of awesome animals" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="container">
                <Nav toggleAuthModal={ toggleAuthModal } />

                <div className="text-center">
                    <label
                        htmlFor="filter-posts"
                        className="d-none">filter posts</label>
                    <input
                        type="text"
                        id="filter-posts"
                        onChange={ handleInputChange }
                        value={ searchValue }
                        placeholder="bear..."
                        className="mb-1" />
                </div>

                <div className="mb-1">
                    <span className="mr-1">sort by</span> 
                    <button className={`mr-1 ${ sortOptions.liked ? ("post-filter-active") : ("") }`} onClick={ () => toggleSortOptions('liked') }>liked</button> 
                    <button className={`${ sortOptions.heart ? ("post-filter-active") : ("") }`} onClick={ () => toggleSortOptions('heart') }>heart</button>
                </div>

                <div className="posts-container">
                    { posts && posts.filter(filterPostBySearch).length ? (posts.filter(filterPostBySearch).map(post => {
                        const isLiked = authUser ? (post.liked.includes(authUser.uid)) : false;

                        return (
                            <div
                                key={ post.id }
                                className="post mb-1">
                                <img
                                    className="w-100"
                                    src={ post.image }
                                    alt={ post.title } />

                                <div className="post-item">
                                    <div>
                                        { post.title }
                                    </div>

                                    <button
                                        onClick={ authUser ? () => handleLikeOrUnLikePost({ postID: post.id, isLiked }) : toggleAuthModal }
                                        className={ `post-like` }>
                                        <span className="mr-1">
                                            { post.liked.length }
                                        </span>
                                        { isLiked ? (
                                        <svg
                                            className="post-heart"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="#ffffff"
                                            stroke="#ffffff"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16">
                                            <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16">
                                            <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
                                        </svg>
                                    ) }
                                    </button>
                                </div>

                                <div className="text-right">
                                    <a 
                                        href={ post.source }
                                        className="color-dark-blue-1 text-decoration-underline">
                                        source
                                    </a>
                                </div>
                            </div>
                            )
                        })
                    ) : (searchValue ? (
                            <div className="m0-auto">
                                <p className="text-2 font-weight-700">
                                    nothing was found
                                </p>

                                <p>
                                    have you tried bear 🤔
                                </p>
                            </div>
                        ) : (null) 
                    ) }
                </div>
            </div>

            { isAuthModalOpen ? (
                <Modal isOpen={ isAuthModalOpen }>
                    <Auth toggleAuthModal={ toggleAuthModal } />
                </Modal>
            ) : (null) }
        </div>
    );
}
