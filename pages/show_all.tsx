import type { NextPage } from "next";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { IndexButton } from "../components/navigation/IndexButton";


const baseURL = process.env.NEXT_PUBLIC_BASE_URL

interface Clip {
  gMapsLink?: string;
  name?: string;
  videotext?: string;
  start?: number;
  isRenderd?: boolean;
  isUploadedTikTok?: boolean;
  ymusic_id?: any;
  group?: string;
  clip_id: number;
  latlong?: string;
  stop?: number;
  isUploadedYt?: boolean;
  isUploadedInstagram?: boolean;
  streetviewVideo?: any
}

function sortByClipId(clips: Array<{ [key: string]: string }>) {
  return clips.sort(
    (a: { [key: string]: string }, b: { [key: string]: string }) =>
      parseFloat(b.clip_id) - parseFloat(a.clip_id)
  );
}

let checked_clips: Array<number> =  []

function ListClips(ammount: Showall) {
  const router = useRouter();

  function to_clip_edit(clip_id: number) {
    router.push(`/edit/${clip_id}`);
  }

  function clickCheckbox(clip_id: number) {
    if (checked_clips.includes(clip_id)) {
      checked_clips.splice(checked_clips.indexOf(clip_id), 1)
    } else if (!checked_clips.includes(clip_id)) {
      checked_clips.push(clip_id)
    }
    console.log(checked_clips)
  }

  async function show_all_clips() {
    console.log(baseURL)
    console.log(ammount);
    const response = await fetch(`${baseURL}/showall`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `${baseURL}`,
      },
    });
    const res = await response.json();

    return res;
  }

  const [response, setResponse] = useState();

  useEffect(() => {
    show_all_clips().then((clips) => {
      clips = sortByClipId(clips);
      setResponse(
        clips.map((clip: Clip) => (
          <tr className="hover" key={clip.clip_id}>
            <th>
              <label>
                <input onClick={() => clickCheckbox(clip.clip_id)} type="checkbox" className="checkbox" />
              </label>
            </th>
            <td onClick={() => to_clip_edit(clip.clip_id)}>{clip.clip_id}</td>
            <td onClick={() => to_clip_edit(clip.clip_id)}>{clip.name}</td>
            <td onClick={() => to_clip_edit(clip.clip_id)}>{clip.group}</td>
            <td onClick={() => to_clip_edit(clip.clip_id)}>{clip.latlong}</td>
          </tr>
        ))
      );
    });
  }, []);

  return (
    <>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th></th>
            <th>Id</th>
            <th>Name</th>
            <th>group</th>
            <th>latlong</th>
          </tr>
        </thead>
        <tbody>{response}</tbody>
      </table>
    </>
  );
}

interface Showall {
  ammount: number;
}

function DownloadClips(){

  async function sendFolderData(){
    // const response =  await fetch(`${baseURL}/requestfolder`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(checked_clips)
    // })
    // let res = await response.json()
    // console.log(res)
    let command = "python main.py -f"
    for (const x of checked_clips){
      command += " "
      command += x.toString()
    }
    command += " -u "
    command += baseURL
    console.log(command)
    navigator.clipboard.writeText(command)
  }
  return (
    <button onClick={sendFolderData} className="btn btn-wide" >ceate folder</button>
  )
}


const ShowAll: NextPage = () => {
  return (
    <>    
      <DownloadClips/>
      <IndexButton />
      <br/>
      <br/>
      <ListClips ammount={10} />
    </>
  );
};

export default ShowAll;
