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
  const now = new Date();
  const [h, setH] = useState<number>(now.getHours());
  const [m, setM] = useState<number>(now.getMinutes());
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

    const delay: number = calculateDelay(h, m);
    const timeoutID: number = window.setTimeout(() => {
      goOff(ringtone.audio);
    }, delay);

    setAlarms([
      ...alarms,
      {
        h,
        m,
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
    if (option === 'h') {
      setH((oldVal) => (oldVal + 1) % 24);
    } else if (option === 'm') {
      setM((oldVal) => (oldVal + 1) % 60);
    }
  }

  function decrement(option: 'h' | 'm'): void {
    if (option === 'h') {
      setH((oldVal) => (oldVal - 1 + 24) % 24);
    } else if (option === 'm') {
      setM((oldVal) => (oldVal - 1 + 60) % 60);
    }
  }

  return (
    <>
      <main className='absolute left-0 top-0 flex min-h-screen w-screen flex-col items-center'>
        <h1 className='pb-8 pt-4 text-3xl font-bold'>MP3 Alarm Clock</h1>

        <section className='flex w-screen flex-col items-center'>
          <section className='flex text-3xl font-bold'>
            <Number
              num={h}
              increment={() => {
                increment('h');
              }}
              decrement={() => {
                decrement('h');
              }}
            />
            <Number
              num={m}
              increment={() => {
                increment('m');
              }}
              decrement={() => {
                decrement('m');
              }}
            />
          </section>

          <section className='w-60 py-8'>
            <label htmlFor='file'>Ringtone:</label>
            <input
              className='mt-2 w-full'
              type='file'
              name='file'
              accept='audio/mp3'
              onChange={upload}
            />
          </section>

          <button
            className='mb-8 rounded-lg bg-emerald-500 px-8 py-1 font-bold text-white'
            onClick={save}
          >
            Save
          </button>
        </section>

        <section>
          {alarms.map((alarm, i) => (
            <section className='mt-4 flex w-32 justify-between' key={i}>
              <h3>
                {alarm.h.toString().padStart(2, '0')}:
                {alarm.m.toString().padStart(2, '0')}
              </h3>
              <span className='cursor-pointer text-red-500'>delete</span>
            </section>
          ))}
        </section>
      </main>
    </>
  );
}
