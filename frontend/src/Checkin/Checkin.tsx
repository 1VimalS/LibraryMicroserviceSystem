import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "../AuthContext.tsx";
import "./Checkin.css";
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
};

const Checkin: React.FC = () => {
    const { username } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
  
    useEffect(() => {
      const fetchCheckedOutBooks = async () => {
        try {
          const response: AxiosResponse = await axios.get(`${apiEndpoint}/user/${username}`);
          if (response.status === 200) {
            setBooks(response.data.checkedOutBooks || []);
          }
        } catch (error: any) {
          MySwal.fire({
            title: "Error",
            text: `Failed to load books: ${error.message}`,
            icon: "error",
          });
        }
      };
      fetchCheckedOutBooks();
    }, [username]);

    const handleCheckboxChange = (bookId: number) => {
        setSelectedBooks(selectedBooks =>
          selectedBooks.includes(bookId) ? selectedBooks.filter(id => id !== bookId) : [...selectedBooks, bookId]
        );
    };

    const handleCheckin = async () => {
        const selectedBookObjects = books.filter(book => selectedBooks.includes(book.bookId));
    
        try {
          const results = await Promise.allSettled(
            selectedBookObjects.map(book => axios.put(`${apiEndpoint}/user/${username}/checkin/${book.bookId}`))
          );
    
          const failedBooks = results
            .map((result, index) => result.status === "rejected" ? selectedBookObjects[index].name : null)
            .filter(name => name !== null);
    
          if (failedBooks.length > 0) {
            MySwal.fire({
              title: "Error",
              text: `Failed to check in the following books: ${failedBooks.join(", ")}`,
              icon: "error",
            });
          } else {
            MySwal.fire({
              title: "Success",
              text: "All selected books have been checked in successfully!",
              icon: "success",
            });
          }
    
          setBooks(prev => prev.filter(book => !selectedBooks.includes(book.bookId)));
          setSelectedBooks([]);
        } catch (error: any) {
          MySwal.fire({
            title: "Error",
            text: `An unexpected error occurred: ${error.message}`,
            icon: "error",
          });
        }
    };
    
    return (
        <>
          <Navbar />
          <h1>Your Checked Out Books</h1>
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
          <button className="checkout-btn" onClick={handleCheckin}>Check In</button>
        </>
      );
};

export default Checkin;