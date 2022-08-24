import type { NextPage } from "next";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";

import { IndexButton } from "../../components/navigation/IndexButton";
import {Clip} from "../../public/interfaces"


const clip_input_list = [
  "gMapsLink",
  "name",
  "group",
  "videotext",
  "latlong",
  "start",
  "stop",
  "isRenderd",
  "isUploadedYt",
  "isUploadedTikTok",
  "isUploadedInstagram",
  "ymusic_id",
  "clip_id",
  "ymusic_title"
  // "streetviewVideo",
] as const;

function InputList({ clip }: { clip: Clip }) {
  const router = useRouter();

  const input_fields = clip_input_list.map((field) =>
    field === "clip_id" ? (

      <div key={field} className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">{field}</span>
            </label>
            <input name={field} disabled readOnly type="text" placeholder={field} defaultValue={clip[field]} className="input input-bordered w-full max-w-xs input-sm" />
      </div>

    ) : (

      <div key={field} className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">{field}</span>
        </label>
        <input name={field} type="text" placeholder={field} defaultValue={clip[field]} className="input input-bordered w-full max-w-xs input-sm" />
      </div>

    )
  );

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL

  const handleData = async (event: any) => {
    async function send_clip_dict(dict: Clip) {
      if (video !== undefined) {
        try {
          const response = await fetch(`${baseURL}/sendStreetviewVideo`, {
            method: "POST",
            headers: {
              "Content-Type": "video/mp4",
              "Content-Disposition": `${clip.clip_id}`,
            },
            body: video,
          });
          const answer = await response.json();
        } catch (e) {
          alert(e);
        }
      }
      try {
        const response = await fetch(`${baseURL}/write_edit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dict),
        });
        const answer = await response.json();
      } catch (e) {
        alert(e);
      }
    }

    event.preventDefault();
    // const data = () => {
    let fetch_dict: Clip = {clip_id: event.target["clip_id"].value};
    console.log(event.target["clip_id"].value)
    for (let key of clip_input_list) {
      if (key.includes("is" as const)) {
        if (event.target[key].value === "false") {
          fetch_dict[key] = false;
        } else if (event.target[key].value === "true") {
          fetch_dict[key] = true;
        }
      } else {
        fetch_dict[key] = event.target[key].value;
      }
    }

    // fetch_dict = fetch_dict as Clip
    send_clip_dict(fetch_dict);


    router.push("/");
    return "hello";
  };

  let video: any;

  function PersonalDropzone() {
    function storeFile(acceptFiles: any) {
      video = acceptFiles[0];
    }

    return (
      <Dropzone onDrop={(acceptFiles: any) => storeFile(acceptFiles)}>
        {({ getRootProps, getInputProps }: any) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag n drop streetviewclip</p>
            </div>
          </section>
        )}
      </Dropzone>
    );
  }

  return (
    <>
      <form onSubmit={handleData}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {input_fields}
        </div>
        <br />
        <div className="btn btn-info">
          <PersonalDropzone />
        </div>
        <button className="btn btn-wide" type="submit">
          Submit changes
        </button>
      </form>
    </>
  );
}

const Edit: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL

  const [response_clip, setResponse] = useState<Clip>();

  async function fetch_data() {
    try {
      const response = await fetch(`${baseURL}/edit/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const dict = await response.json();
      setResponse(dict);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (typeof id !== "undefined") {
      fetch_data();
    }
  }, [id]);

  if (typeof response_clip === "undefined") {
    return <div>loading</div>;
  }

  function delete_clip(clip: Clip) {
    const response = fetch(`${baseURL}/delete/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    alert(`The clip with the id ${id} has been deleted.`);

    router.push("/");
  }

  function Video() {
    return (
      <>
        <div className="sm:pl-4 p-4">
          <div className="sm:mockup-phone">
            <div className="sm:camera camera"></div>
            <div className="display">
              <div className="artboard artboard-demo phone-1">
                <video
                  width="320"
                  height="240"
                  src={`${baseURL}/getStreetviewVideo/${id}.mp4`}
                  controls
                ></video>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <IndexButton />
      <div className="flex flex-col sm:flex-row justify-evenly w-full">
        <div>
        <InputList clip={response_clip} />
        </div>
        <div >
          <Video />
        </div>
      </div>
      <br/>
      <button
        className="btn btn-error btn-wide"
        onClick={() => delete_clip(response_clip)}
      >
        Delete
      </button>
    </>
  );
};

export default Edit;
