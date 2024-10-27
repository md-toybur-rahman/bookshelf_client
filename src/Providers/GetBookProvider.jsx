import React, { createContext, useState } from 'react';


export const getBookContext = createContext(null)

const GetBookProvider = ({ children }) => {
	const [book, setBook] = useState([]);
	const token = localStorage.getItem('token');
	console.log(book)
	const handleGetBook = (id) => {
		fetch(`http://localhost:2000/books?id=${id}`)
			.then(res => res.json())
			.then(data => {
				setBook(data);
			})
	}

	const value = {
		book,
		setBook,
		handleGetBook
	}
	return (
		<getBookContext.Provider value={value}>
			{children}
		</getBookContext.Provider>
	);
};

export default GetBookProvider;