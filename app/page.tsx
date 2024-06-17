'use client';

import { useState, ChangeEvent } from 'react';
import Number from '@/components/Number';

interface Clock {
  h: number;
  m: number;
}

interface Ringtone {
  audio: HTMLAudioElement;
  title: string;
}

interface Alarm extends Clock {
  ringtone: string;
  timeoutID: number;
  isActive: boolean;
}

export default function Page() {
  const [clock, setClock] = useState<Clock>({ h: 12, m: 0 });
  const [ringtone, setRingtone] = useState<Ringtone | null>(null);
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  function upload(e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.files) {
      const file: File = e.target.files[0];
      const objUrl: string = URL.createObjectURL(file);
      const audio: HTMLAudioElement = new Audio(objUrl);

      setRingtone({ audio, title: file.name });
    }
  }

  function save(): void {
    if (!ringtone) {
      alert("No ringtone. Can't save.");
      return;
    }

    const delay: number = calculateDelay(clock.h, clock.m);
    const timeoutID: number = window.setTimeout(() => {
      goOff(ringtone.audio);
    }, delay);

    setAlarms([
      ...alarms,
      {
        h: clock.h,
        m: clock.m,
        ringtone: ringtone.title,
        timeoutID,
        isActive: true,
      },
    ]);
  }

  function calculateDelay(h: number, m: number): number {
    const now: Date = new Date();
    const target: Date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      h,
      m
    );
    const delay: number = target.valueOf() - now.valueOf();

    return delay < 0 ? delay + 86400 * 1000 : delay;
  }

  function goOff(audio: HTMLAudioElement): void {
    audio.play();
  }

  function increment(option: 'h' | 'm'): void {
    const bound: number = option === 'h' ? 23 : 59;

    if (option === 'h' && clock.h + 1 <= bound) {
      setClock({ ...clock, h: clock.h + 1 });
    } else if (option === 'm' && clock.m + 1 <= bound) {
      setClock({ ...clock, m: clock.m + 1 });
    }
  }

  function decrement(option: 'h' | 'm'): void {
    const bound: number = 0;

    if (option === 'h' && clock.h - 1 >= bound) {
      setClock({ ...clock, h: clock.h - 1 });
    } else if (option === 'm' && clock.m - 1 >= bound) {
      setClock({ ...clock, m: clock.m - 1 });
    }
  }

  return (
    <>
      <main>
        <h1>Alarm Clock</h1>

        <section>
          <section className="flex">
            <Number
              num={clock.h}
              increment={() => {
                increment('h');
              }}
              decrement={() => {
                decrement('h');
              }}
            />
            <Number
              num={clock.m}
              increment={() => {
                increment('m');
              }}
              decrement={() => {
                decrement('m');
              }}
            />
          </section>

          <section>
            <h2>Ringtone: </h2>
            <input type="file" onChange={upload} />
          </section>

          <button onClick={save}>Save</button>
        </section>

        <section></section>
      </main>
    </>
  );
}
