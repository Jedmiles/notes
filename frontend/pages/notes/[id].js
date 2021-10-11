import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { API, Storage } from "aws-amplify";
import { s3Upload } from "../../lib/awsLib";
import { onError } from "../../lib/errorLib";
import config from "../../config";
import Navbar from "../../components/Navbar/";
import LoaderButton from "../../components/LoaderButton";

export default function Note() {
  const file = useRef(null);
  const router = useRouter();
  const { id } = router.query;
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadNote() {
      return API.get("notes", `/notes/${id}`);
    }
    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;
        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }
        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }
    onLoad();
  }, [id]);

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function saveNote(note) {
    return API.put("notes", `/notes/${id}`, {
      body: note,
    });
  }

  async function handleSubmit(event) {
    let attachment;

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
      if (file.current) {
        attachment = await s3Upload(file.current);
        Storage.vault.remove(note.attachment);
      }
      await saveNote({
        content,
        attachment: attachment || note.attachment,
      });
      router.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteNote() {
    return API.del("notes", `/notes/${id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      if (note.attachment) {
        await Promise.all([
          deleteNote(),
          Storage.vault.remove(note.attachment),
        ]);
      } else {
        await deleteNote();
      }
      router.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <Navbar />
      {note && (
        <form onSubmit={handleSubmit}>
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          {note.attachment && (
            <p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={note.attachmentURL}
              >
                {formatFilename(note.attachment)}
              </a>
            </p>
          )}
          <input type="file" name="" id="" onChange={handleFileChange} />
          <LoaderButton  isLoading={isLoading} disabled={!validateForm()}>
            Save
          </LoaderButton>
          <LoaderButton  isLoading={isDeleting} onClick={handleDelete}>
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}
