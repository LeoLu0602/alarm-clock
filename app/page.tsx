'use client';

import { useState, ChangeEvent } from 'react';

interface Clock {
  h: number;
  m: number;
}

export default function Page() {
  const [clock, setClock] = useState<Clock>({ h: 16, m: 44 });
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  function upload(e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.files) {
      const objUrl: string = URL.createObjectURL(e.target.files[0]);
      const newAudio: HTMLAudioElement = new Audio(objUrl);

      setAudio(newAudio);
    }
  }

  function save(): void {
    if (!audio) {
      alert("No ringtone. Can't save.");
      return;
    }

    const now: Date = new Date();
    const target: Date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      clock.h,
      clock.m
    );
    let delay: number = target.valueOf() - now.valueOf();

    if (delay < 0) {
      delay += 86400 * 1000;
    }

    setTimeout(goOff, delay);
  }

  function goOff(): void {
    if (audio) {
      audio.play();
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

        <button onClick={save}>Save</button>
      </main>
    </>
  );
}
