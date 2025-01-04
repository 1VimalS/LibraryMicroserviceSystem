import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "../AuthContext.tsx";
import "./Checkout.css";
import Navbar from "../Navbar/Navbar.tsx";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const apiEndpoint = "http://localhost:8080";

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
            selectedBooks.map(async id => {
                const response: AxiosResponse = await axios.put(`${apiEndpoint}/user/${username}/checkout/${id}`);
                if (response.status === 200) {
                    setBooks(prev => {
                        const updatedBooks = prev.filter(book => book.bookId !== id);
                        localStorage.setItem("booksAddedToCheckout", JSON.stringify(updatedBooks));
                        return updatedBooks;
                    });
                    setSelectedBooks(prev => prev.filter(bookId => bookId !== id));
                }
                else {
                    MySwal.fire({
                        title: "Error",
                        text: `Failed to checkout book: ${response.statusText}`,
                        icon: "error"
                    });
                    return;
                }
            })

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
            <h1>Your Checkout List</h1>
            <div className="checkout-list">
                <ul>
                {books.map(book => (
                    <li key={book.bookId}>
                    {book.name}, {book.author}, {book.genre}
                    <input
                        type="checkbox"
                        checked={selectedBooks.includes(book.bookId)}
                        onChange={() => handleCheckboxChange(book.bookId)}
                    />
                    </li>
                ))}
                </ul>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
        </>
    );
};

export default Checkout;