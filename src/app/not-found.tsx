import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <span className="brand-mark">RF</span>
      <p className="eyebrow">Page not found</p>
      <h1>This RouteFlow page is not available.</h1>
      <p>Return to the operations workspace and choose an available module.</p>
      <Link href="/">Back to overview</Link>
    </main>
  );
}
