import React, { createContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import app from '../firebase/firebase.config';

export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {

	const [user, setUser] = useState(false);
	const [loading, setLoading] = useState(true);

	const createUser = (email, password) => {
		setLoading(true);
		return createUserWithEmailAndPassword(auth, email, password);
	}

	const signIn = (email, password) => {
		setLoading(true);
		return signInWithEmailAndPassword(auth, email, password);
	}

	const googleSignIn = () => {
		setLoading(true);
		return signInWithPopup(auth, googleProvider)

	}

	const logOut = () => {
		setLoading(true);
		setUser(false)
		return signOut(auth);
	}

	useEffect(() => {
		const userActivity = onAuthStateChanged(auth, loggedUser => {
			console.log(loggedUser);
			if(loggedUser) {
				setUser(loggedUser);
				setLoading(false);
			} else {
				setUser(false);
				setLoading(false);
			}
		})
		return () => {
			return userActivity();
		}
	}, [user]);

	const authCollection = {
		user,
		loading,
		createUser,
		googleSignIn,
		signIn,
		logOut,
	}

	return (
		<AuthContext.Provider value={authCollection}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;