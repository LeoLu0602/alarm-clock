'use client';

import { useState, useRef, ChangeEvent, MutableRefObject } from 'react';
import Number from '@/components/Number';

interface Clock {
  h: number;
  m: number;
}

interface Alarm extends Clock {
  timeoutID: number;
  ringtone: HTMLAudioElement;
}

export default function Page() {
  const now = new Date();
  const [h, setH] = useState<number>(now.getHours());
  const [m, setM] = useState<number>(now.getMinutes());
  const [ringtone, setRingtone] = useState<HTMLAudioElement | null>(null);
  const [alarm, setAlarm] = useState<Alarm | null>(null);
  const inputRef: MutableRefObject<HTMLInputElement | null> =
    useRef<HTMLInputElement | null>(null);

  function chooseFile(): void {
    inputRef.current?.click();
  }

  function upload(e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.files) {
      const file: File = e.target.files[0];
      const objUrl: string = URL.createObjectURL(file);
      const audio: HTMLAudioElement = new Audio(objUrl);

      setRingtone(audio);
    }
  }

  function save(): void {
    if (!ringtone) {
      alert("No ringtone. Can't save.");
      return;
    }

    ringtone.currentTime = 0;
    ringtone.play();
    ringtone.pause();

    const delay: number = calculateDelay(h, m);
    const timeoutID: number = window.setTimeout(() => {
      goOff(ringtone);
    }, delay);

    setAlarm({
      h,
      m,
      timeoutID,
      ringtone,
    });
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

  function goOff(ringtone: HTMLAudioElement): void {
    ringtone.play();
  }

  function stop(): void {
    clearTimeout(alarm?.timeoutID);
    alarm?.ringtone.pause();
    setAlarm(null);
  }

  return (
    <>
      <main className='absolute left-0 top-0 flex min-h-screen w-screen flex-col items-center'>
        <h1 className='my-8 text-2xl font-bold text-zinc-600'>
          MP3 Alarm Clock
        </h1>

        <section className='flex w-screen flex-col items-center'>
          <section className='flex text-5xl text-zinc-600'>
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

          <section className='my-8 w-60 overflow-hidden text-lg'>
            <button
              className='text-sky-500'
              onClick={() => {
                chooseFile();
              }}
            >
              ➕
            </button>
            {ringtone && (
              <div className='animate-move w-fit whitespace-nowrap text-emerald-500'>
                {inputRef.current?.files?.[0].name ?? ''}
              </div>
            )}
            <input
              className='mt-2 hidden w-full'
              ref={inputRef}
              type='file'
              accept='.mp3'
              onChange={upload}
            />
          </section>

          {!alarm && (
            <button
              className='rounded-lg bg-emerald-500 px-8 py-1 font-bold text-white'
              onClick={() => {
                save();
              }}
            >
              Save
            </button>
          )}
        </section>

        {alarm && (
          <section className='flex w-full items-center justify-center gap-8 text-2xl'>
            <h3>
              ⏰ {alarm.h.toString().padStart(2, '0')}:
              {alarm.m.toString().padStart(2, '0')}
            </h3>
            <span
              className='cursor-pointer text-red-500'
              onClick={() => {
                stop();
              }}
            >
              stop
            </span>
          </section>
        )}
      </main>
    </>
  );
}
