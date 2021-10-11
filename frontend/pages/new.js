import { useRef, useState } from "react";
import { useRouter } from "next/router";
import config from "../config";
import { API } from "aws-amplify";
import { s3Upload } from "../lib/awsLib";
import { onError } from "../lib/errorLib";
import Navbar from "../components/Navbar/Navbar";
import LoaderButton from "../components/LoaderButton";

export default function Create() {
  const file = useRef(null);
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
    setIsLoading(true);
    try {
      const attachment = file.current ? await s3Upload(file.current) : null;
      await createNote({ content, attachment });
      router.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createNote(note) {
    return API.post("notes", "/notes", {
      body: note,
    });
  }

  function validateForm() {
    return content.length > 0;
  }

  return (
    <div>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <textarea
          autoFocus
          cols="30"
          rows="10"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        ></textarea>
        <input type="file" name="" id="" onChange={handleFileChange} />
        <LoaderButton disabled={!validateForm()} type="submit" isLoading={isLoading}>
          Submit
        </LoaderButton>
      </form>
    </div>
  );
}
