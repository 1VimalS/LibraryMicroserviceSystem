import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "../AuthContext.tsx";
import "./Home.css";
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
}

type User = {
  userId: number,
  username: string,
  checkedOutBooks: Book[]
}

interface CheckoutButtonProps {
  book: Book;
  username: string | null;
  booksAddedToCheckout: Book[];
  setBooksAddedToCheckout: React.Dispatch<React.SetStateAction<Book[]>>;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ book, username, booksAddedToCheckout, setBooksAddedToCheckout }) => {
  const [addedToCheckout, setAddedToCheckout] = useState<boolean>(false);
  const handleClick = async () => {
    if (!addedToCheckout) {
        if (booksAddedToCheckout.some(addedBook => addedBook.bookId === book.bookId)) {
          await MySwal.fire({
            icon: "error",
            title: "Error",
            text: "Book already added to Checkout List"
          });
          return;
        }
      try {
        const userResponse: AxiosResponse<User> = await axios.get(`${apiEndpoint}/user/${username}`);
        if (userResponse.status === 200) {
          const userData = userResponse.data;
          if (userData && userData.checkedOutBooks.some(checkedOutBook => checkedOutBook.bookId === book.bookId)) {
            await MySwal.fire({
              icon: "error",
              title: "Error",
              text: "You already have this book checked out"
            });
          }
          else {
            setBooksAddedToCheckout(prevBooks => {
              const updatedBooks = [...prevBooks, book];
              localStorage.setItem("booksAddedToCheckout", JSON.stringify(updatedBooks));
              return updatedBooks;
            });
            setAddedToCheckout(true);
            await MySwal.fire({
              icon: "success",
              title: "Success",
              text: "Book added to checkout"
            });
          }
        }
      } catch(error: any) {
        await MySwal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to fetch user data: ${error}`
        });
      }
    }
    else {
      setBooksAddedToCheckout(prevBooks => {
        const updatedBooks = prevBooks.filter(booksAddedToCheckout => booksAddedToCheckout !== book);
        localStorage.setItem("booksAddedToCheckout", JSON.stringify(updatedBooks));
        return updatedBooks;
      }); 
      setAddedToCheckout(false);
      await MySwal.fire({
        icon: "success",
        title: "Success",
        text: "Book removed from checkout"
      });
    }
    
  };

  return (
    <button className="checkout-btn" onClick={handleClick}>
      {!addedToCheckout ? <div className="checkout-message-unchecked">Add to Checkout</div> : <div className="checkout-message-checked">Added to Checkout</div>}
    </button>
  );
}

const Home: React.FC = () => {
  const [booksAddedToCheckout, setBooksAddedToCheckout] = useState<Book[]>(() => {
    const savedBooks = localStorage.getItem("booksAddedToCheckout");
    return savedBooks ? JSON.parse(savedBooks) : [];
  });
  const { username } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response: AxiosResponse<Book[]> = await axios.get(`${apiEndpoint}/book`);
        if (response.status === 200) {
          setBooks(response.data);
        }
      } catch (error: any) {
        await MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load books",
        });
      }
    };
    fetchBooks();
  }, []);

  const listBooks = books.map(book =>
    <li key={book.bookId}>
      {book.name} , {book.author}, {book.genre}, 
      <CheckoutButton 
        book={book}
        username={username}
        booksAddedToCheckout={booksAddedToCheckout}
        setBooksAddedToCheckout={setBooksAddedToCheckout}
      />
    </li>
  );

  const handleAdd = async () => {
    const { value: formValues } = await MySwal.fire({
      title: "Add a New Book",
      html: `
        <input id="name" class="swal2-input" placeholder="Book Name" />
        <input id="author" class="swal2-input" placeholder="Author" />
        <input id="genre" class="swal2-input" placeholder="Genre" />
        <input id="numCopies" type="number" class="swal2-input" placeholder="Number of Copies" />
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById("name") as HTMLInputElement).value;
        const author = (document.getElementById("author") as HTMLInputElement).value;
        const genre = (document.getElementById("genre") as HTMLInputElement).value;
        const numCopies = parseInt((document.getElementById("numCopies") as HTMLInputElement).value);
        return { name, author, genre, numCopies };
      },
    });

    if (formValues) {
      try {
        const response = await axios.post(`${apiEndpoint}/book`, formValues);
        if (response.status === 201) {
          await MySwal.fire({
            icon: "success",
            title: "Success",
            text: "Book added successfully!",
          });
          setBooks((prevBooks) => [...prevBooks, response.data]);
        }
      } catch (error: any) {
        await MySwal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to add book: ${error.message}`,
        });
      }
    }
  };

  return (
      <>
        <Navbar />
        <h1>Welcome to Home, {username}!</h1>
        <button className="add-book-btn"onClick={handleAdd}>Add Book</button>
        <div className="book-list">
          <h3>Book Title, Author, Genre, Add</h3>
          <ul>{listBooks}</ul>
        </div>
      </>
  );
};

export default Home;