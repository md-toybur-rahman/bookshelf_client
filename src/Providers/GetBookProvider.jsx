import React, { createContext, useState } from 'react';


export const getBookContext = createContext(null)

const GetBookProvider = ({ children }) => {
	const [book, setBook] = useState([]);
	console.log(book)
	const handleGetBook = async (id) => {
		await fetch(`http://localhost:2000/books/${id}`)
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