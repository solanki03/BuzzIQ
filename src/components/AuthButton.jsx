import React, { useState } from "react";
import styled from "styled-components";

// Styled Components for Button and Avatar
const Button = styled.button`
  font-family: "Poppins", sans-serif;  // Added Poppins font
  line-height: 1;
  text-decoration: none;
  display: inline-flex;
  border: none;
  cursor: pointer;
  align-items: center;
  gap: 0.75rem;
  background-color: #000;
  color: #fff;
  border-radius: 10rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  padding-left: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4F46E5;
  }
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  width: 25px;
  height: 25px;
  position: relative;
  color: ${(props) => props.color || "#4F46E5"};
  background-color: #fff;
  border-radius: 50%;
  display: grid;
  place-items: center;
  overflow: hidden;

  ${Button}:hover & {
    color: #000;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const AuthButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dummy user data (Replace with actual authentication logic)
  const user = {
    name: "John Doe",
  };

  // Generate a default avatar URL using RoboHash
  const defaultAvatarUrl = `https://robohash.org/${user.name}.png?size=40x40`;

  // Handle Login (Replace with real authentication)
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <Button onClick={handleLogin} color="#000">
          <span>Log in</span>
          <IconWrapper>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M10 2H14V4H10V2ZM12 18C7.58 18 4 14.42 4 10C4 5.58 7.58 2 12 2C16.42 2 20 5.58 20 10C20 14.42 16.42 18 12 18ZM12 4C8.69 4 6 6.69 6 10C6 13.31 8.69 16 12 16C15.31 16 18 13.31 18 10C18 6.69 15.31 4 12 4Z"></path>
            </svg>
          </IconWrapper>
        </Button>
      ) : (
        <Avatar>
          <AvatarImage
            src={defaultAvatarUrl}
            alt={user.name}
            title={user.name}
          />
        </Avatar>
      )}
    </div>
  );
};

export default AuthButton;
