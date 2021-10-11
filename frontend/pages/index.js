import Navbar from "../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { API, withSSRContext } from "aws-amplify";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuthContext } from "../contexts/AuthContext";

function Home() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);

  function loadNotes() {
    return API.get("notes", "/notes");
  }

  function renderLander() {
    return (
      <div>
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  function renderNotesList(notes) {
    return (
      <>
        {notes.map(({ noteId, content, createdAt }) => (
          <li key={noteId}>
            <Link href={`/notes/${noteId}`}>
              <div>
                <span>{content.trim().split("\n")[0]}</span>
                <br />
                <span>Created: {new Date(createdAt).toLocaleString()}</span>
              </div>
            </Link>
          </li>
        ))}
      </>
    );
  }

  function renderNotes() {
    return (
      <div>
        <h2>Your Notes</h2>
        <ul>{!isLoading && renderNotesList(notes)}</ul>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}

// export async function getServerSideProps({ req, res }) {
//   const { API } = withSSRContext({ req });
//   try {
//     const notes = await API.get("notes", "/notes");
//     return { props: { notes: notes } };
//   } catch (e) {
//     res.writeHead(302, { Location: "/login" });
//     res.end();
//   }
//   return { props: {} };
// }

export default Home
