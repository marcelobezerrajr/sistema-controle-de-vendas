import React, { useState, useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import "../styles/profile-page.css";

const getInitials = (name) => {
  return name ? name.charAt(0).toUpperCase() : "U";
};

const ProfilePage = () => {
  const [userName, setUserName] = useState("Username");
  const [userEmail, setUserEmail] = useState("Email");
  const [userPermissions, setUserPermissions] = useState("Permission");

  useEffect(() => {
    setUserName(localStorage.getItem("user_username") || "Username");
    setUserEmail(localStorage.getItem("user_email") || "Email");
    setUserPermissions(localStorage.getItem("user_permission") || "Permission");
  }, []);

  return (
    <MainLayout>
      <Container className="profile-container">
        <Card className="profile-card">
          <Card.Body>
            <div className="profile-header">
              <div className="profile-avatar">
                <FaUserCircle size={120} className="default-avatar" />
                <div className="avatar-initials-large">
                  {getInitials(userName)}
                </div>
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{userName}</h2>
                <p className="profile-email">
                  <strong>Email:</strong> {userEmail}
                </p>
                <p className="profile-permission">
                  <strong>Permission:</strong> {userPermissions}
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default ProfilePage;
