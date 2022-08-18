import type { NextPage } from "next";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";


import { IndexButton } from "../../components/navigation/IndexButton";

interface Clip {
  gMapsLink?: string;
  name?: string;
  videotext?: string;
  start?: number;
  isRenderd?: boolean;
  isUploadedTikTok?: boolean;
  ymusic_id?: any;
  group?: string;
  clip_id?: number;
  latlong?: string;
  stop?: number;
  isUploadedYt?: boolean;
  isUploadedInstagram?: boolean;
  streetviewVideo?: any;
}

const clip_input_list = [
  "clip_id",
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
  // "streetviewVideo",
] as const;

function InputList({ clip }: { clip: Clip }) {
  const router = useRouter();

  const input_fields = clip_input_list.map((field) =>
    field === "clip_id" ? (
      <li key={clip[field]}>
        {field}:
        <input
          readOnly
          name={field}
          placeholder={field}
          defaultValue={clip[field]}
        />
        <br /> <br />
      </li>
    ) : (
      <div key={field}>
        {field}:
        <input name={field} placeholder={field} defaultValue={clip[field]} />
        <br />
      </div>
    )
  );

  const baseURL = "http://127.0.0.1:8000";

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
    let fetch_dict: Clip = {};

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
    // return fetch_dict

    // }

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
              <p>Drag 'n' drop streetviewclip</p>
            </div>
          </section>
        )}
      </Dropzone>
    );
  }

  return (
    <>
      <form onSubmit={handleData}>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
  console.log(id);
  const baseURL = "http://127.0.0.1:8000";

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
        <div>
          <video
            width="320"
            height="240"
            src={`${baseURL}/getStreetviewVideo/${id}.mp4`}
            controls
          ></video>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 md:grid-rows-2 grid-cols-1">
        <InputList clip={response_clip} />
        <div className="row-span-2">
          <Video />
        </div>
        <div className="">
          <button
            className="btn btn-error btn-wide"
            onClick={() => delete_clip(response_clip)}
          >
            Delete
          </button>
          <IndexButton />
        </div>
      </div>
    </>
  );
};

export default Edit;
