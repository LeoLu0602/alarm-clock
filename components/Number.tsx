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
    <section>
      <button onClick={increment}>+</button>
      <div>{num.toString().padStart(2, '0')}</div>
      <button onClick={decrement}>-</button>
    </section>
  );
}
