'use client';

import { useState, ChangeEvent } from 'react';

export default function Page() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  function upload(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const objUrl: string = URL.createObjectURL(e.target.files[0]);
      const newAudio: HTMLAudioElement = new Audio(objUrl);

      setAudio(newAudio);
    }
  }

  return (
    <>
      <main>
        <h1>Alarm Clock</h1>

        <section></section>

        <section>
          <h2>Ringtone: </h2>
          <input type="file" onChange={upload} />
        </section>

        <button>Save</button>
      </main>
    </>
  );
}
