'use client';

export default function Number({
  num,
  increment,
  decrement,
}: {
  num: number;
  increment: () => void;
  decrement: () => void;
}) {
  return (
    <section className='flex w-24 flex-col items-center'>
      <button
        className='w-full'
        onClick={() => {
          increment();
        }}
      >
        +
      </button>
      <div>{num.toString().padStart(2, '0')}</div>
      <button
        className='w-full'
        onClick={() => {
          decrement();
        }}
      >
        -
      </button>
    </section>
  );
}
