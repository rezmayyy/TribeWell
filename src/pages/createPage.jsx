import { Container, Nav, Tab, Card } from "react-bootstrap";
import { FaPen, FaFileAlt, FaMusic, FaVideo, FaCalendarAlt, FaChalkboardTeacher } from "react-icons/fa";
import CreateArticle from "../components/create/CreateArticle"; 
import CreateAudio from "../components/create/CreateAudio";     
import CreateEvent from "../components/create/CreateEvent";      
import CreateVideo from "../components/create/CreateVideo";     
import CreatePost from "../components/create/CreatePost";       
import CreateCourse from "../components/create/CreateCourse";
import { useState } from "react";

function CreatePage() {
  const [activeKey, setActiveKey] = useState("post");

  const tabItems = [
    { key: "post", label: "Post", icon: <FaPen size={26} /> },
    { key: "article", label: "Article", icon: <FaFileAlt size={26} /> },
    { key: "audio", label: "Audio", icon: <FaMusic size={26} /> },
    { key: "video", label: "Video", icon: <FaVideo size={26} /> },
    { key: "event", label: "Event", icon: <FaCalendarAlt size={26} /> },
    { key: "course", label: "Course", icon: <FaChalkboardTeacher size={26} /> }
  ];

  return (
    <Container className="py-5" style={{ maxWidth: "1100px" }}>
      <div className="text-center mb-5">
        <h1 style={{ fontSize: "3rem", fontWeight: "700" }}>Create Content</h1>
        <p style={{ fontSize: "1.2rem", color: "#555" }}>
          Share your knowledge, your journey, and your healing stories.
        </p>
      </div>

      <Card className="shadow-sm rounded-4" style={{ border: "none", padding: "30px", backgroundColor: "#FAFAFA" }}>
        <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
          <Nav variant="pills" justify className="mb-4 flex-wrap" style={{ gap: "15px" }}>
            {tabItems.map(({ key, label, icon }) => (
              <Nav.Item key={key}>
                <Nav.Link
                  eventKey={key}
                  className="d-flex flex-column align-items-center"
                  style={{
                    borderRadius: "15px",
                    padding: "10px 20px",
                    backgroundColor: activeKey === key ? "#5B56A4" : "#EFEFEF",
                    color: activeKey === key ? "white" : "#333",
                    transition: "all 0.3s ease",
                    boxShadow: activeKey === key ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none",
                    cursor: "pointer"
                  }}
                >
                  {icon}
                  <div style={{ marginTop: "5px", fontWeight: "500" }}>{label}</div>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="post">
              <CreatePost />
            </Tab.Pane>
            <Tab.Pane eventKey="article">
              <CreateArticle />
            </Tab.Pane>
            <Tab.Pane eventKey="audio">
              <CreateAudio />
            </Tab.Pane>
            <Tab.Pane eventKey="video">
              <CreateVideo />
            </Tab.Pane>
            <Tab.Pane eventKey="event">
              <CreateEvent />
            </Tab.Pane>
            <Tab.Pane eventKey="course">
              <CreateCourse />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Card>
    </Container>
  );
}

export default CreatePage;
