import { Container, Nav, Tab, Row, Col } from "react-bootstrap";
import CreateArticle from "../components/create/CreateArticle"; 
import CreateAudio from "../components/create/CreateAudio";     
import CreateEvent from "../components/create/CreateEvent";      
import CreateVideo from "../components/create/CreateVideo";     
import CreatePost from "../components/create/CreatePost";       
import CreateCourse from "../components/create/CreateCourse";

function CreatePage() {
  return (
    <Container className="py-4">
      <h1>Create Content</h1>
      <Tab.Container defaultActiveKey="post">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="post">Create Post</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="article">Create Article</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="audio">Create Audio</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="video">Create Video</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="event">Create Event</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="course">Create Course</Nav.Link>
          </Nav.Item>
        </Nav>
        <Row>
          <Col>
            <Tab.Content>
              <Tab.Pane eventKey="post">
                <CreatePost /> {/* Add your CreatePost component here */}
              </Tab.Pane>
              <Tab.Pane eventKey="article">
                <CreateArticle />
              </Tab.Pane>
              <Tab.Pane eventKey="audio">
                <CreateAudio />
              </Tab.Pane>
              <Tab.Pane eventKey="video">
                <CreateVideo /> {/* Add your CreateVideo component here */}
              </Tab.Pane>
              <Tab.Pane eventKey="event">
                <CreateEvent /> {/* Add your CreateEvent component here */}
              </Tab.Pane>
              <Tab.Pane eventKey="course">
                <CreateCourse /> {/* Add your CreateCourse component here */}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default CreatePage;
