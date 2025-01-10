import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "../AuthContext.tsx";
import "../CheckInOut.css";
import Navbar from "../Navbar/Navbar.tsx";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const BASE_URL = import.meta.env.VITE_BASE_URL;

type Book = {
  bookId: number,
  name: string,
  author: string,
  genre: string,
  numCopies: number
};

const Checkout: React.FC = () => {
    const { username } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBooks, setSelectedBooks] = useState<number[]>([]);

    useEffect(() => {
        const storedBooks = localStorage.getItem("booksAddedToCheckout");
        if (storedBooks) {
            const parsedBooks: Book[] = JSON.parse(storedBooks);
            setBooks(parsedBooks);
        }
    }, []);

    const handleCheckboxChange = (bookId: number) => {
        setSelectedBooks(selectedBooks =>
            selectedBooks.includes(bookId) ? selectedBooks.filter(id => id !== bookId) : [...selectedBooks, bookId]
        );
    };

    const handleCheckout = async () => {
        const selectedBookObjects: Book[] = books.filter(book => selectedBooks.includes(book.bookId));

        const unavailableBooks: Book[] = selectedBookObjects.filter(book => book.numCopies === 0);
        if (unavailableBooks.length > 0) {
            MySwal.fire({
                title: "Out of Stock",
                text: `The following books are out of stock: ${unavailableBooks.map(book => book.name).join(", ")}`,
                icon: "error"
            });
            unavailableBooks.map(unavailableBook => {
                setBooks(prev => {
                    const updatedBooks = prev.filter(book => book.bookId !== unavailableBook.bookId);
                    localStorage.setItem("booksAddedToCheckout", JSON.stringify(updatedBooks));
                    return updatedBooks;
                })
            });
            return;
        }

        try {
            // selectedBooks.map(async id => {
            //     const response: AxiosResponse = await axios.put(`${apiEndpoint}/user/${username}/checkout/${id}`);
            //     if (response.status === 200) {
            //         setBooks(prev => {
            //             const updatedBooks = prev.filter(book => book.bookId !== id);
            //             localStorage.setItem("booksAddedToCheckout", JSON.stringify(updatedBooks));
            //             return updatedBooks;
            //         });
            //         setSelectedBooks(prev => prev.filter(bookId => bookId !== id));
            //     }
            //     else {
            //         MySwal.fire({
            //             title: "Error",
            //             text: `Failed to checkout book: ${response.statusText}`,
            //             icon: "error"
            //         });
            //         return;
            //     }
            // })
            // Sequential way of calling Endpoints due to non ACID
            const checkoutBooks = async () => {
                for (const id of selectedBooks) {
                    try {
                        const response: AxiosResponse = await axios.put(`${BASE_URL}/user/${username}/checkout/${id}`, {
                            headers: {
                                'ngrok-skip-browser-warning': '1'
                              },
                        });
            
                        if (response.status === 200) {
                            setBooks(prev => {
                                const updatedBooks: Book[] = prev.filter(book => book.bookId !== id);
                                localStorage.setItem("booksAddedToCheckout", JSON.stringify(updatedBooks));
                                return updatedBooks;
                            });
                            setSelectedBooks(prev => prev.filter(bookId => bookId !== id));
                        } else {
                            MySwal.fire({
                                title: "Error",
                                text: `Failed to checkout book: ${response.statusText}`,
                                icon: "error"
                            });
                        }
                    } catch (error: any) {
                        MySwal.fire({
                            title: "Error",
                            text: `Failed to checkout book: ${error.message}`,
                            icon: "error"
                        });
                        break;
                    }
                }
            };
            checkoutBooks();

            MySwal.fire({
                title: "Success",
                text: "All selected books have been checked out successfully!",
                icon: "success"
            });
            setSelectedBooks([]);
        } catch (error: any) {
            MySwal.fire({
                title: "Error",
                text: `Failed to checkout book: ${error.message}`,
                icon: "error"
            });
        }
    };

    

    return (
        <>
            <Navbar />
            <div className="checkout-container">
                <h1>Your Checkout List</h1>
                <div className="checkout-list">
                    <ul>
                        {books.map((book) => (
                            <li key={book.bookId}>
                                <span>{book.name}</span>
                                <span>{book.author}</span>
                                <span>{book.genre}</span>
                                <label className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        checked={selectedBooks.includes(book.bookId)}
                                        onChange={() => handleCheckboxChange(book.bookId)}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                    Checkout
                </button>
            </div>
        </>
    );
};

export default Checkout;