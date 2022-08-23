import type { NextPage } from "next";
import { useRouter } from "next/router";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

function Create_new_clip_button() {
  const router = useRouter();

  function load_edeting(dict: { [key: string]: string }) {
    router.push(`/edit/${dict.clip_id}`);
  }

  async function receive_data(data: { [key: string]: string }) {
    
    try {
      const response = await fetch(`${baseURL}/edit/${data.clip_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify(data),
      });
      load_edeting(await response.json());
    } catch (e) {
      alert(e);
    }
  }

  async function create_new_clip() {
    try {
      const response = await fetch(`${baseURL}/create_new_clip`, {
        method: "GET",
      });
      const json = await response.json();
      receive_data(await json);
    } catch (e) {
      alert(e);
    }
  }

  return (
    <>
      <button className="btn  btn-primary" onClick={create_new_clip}>
        New Clip
      </button>
    </>
  );
}

function Show_all_clips_button() {
  const router = useRouter();
  function show_all_clips() {
    router.push(`/show_all`);
  }

  return (
    <button className="btn btn-secondary" onClick={show_all_clips}>
      Show all clips
    </button>
  );
}

const Home: NextPage = () => {
  return (
    <>
      <Create_new_clip_button />
      <button className="btn btn-info">Show clips without video</button>
      <Show_all_clips_button />
      {/* last five clips */}
    </>
  );
};

export default Home;
