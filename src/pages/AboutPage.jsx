import { Camera, LineChart, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <section className="about-page">
      <p className="eyebrow">About ChicCheap</p>
      <h1>Fashion search that protects your budget.</h1>
      <p className="hero-copy">ChicCheap helps shoppers upload a photo or type a description, compare similar fashion items across retailers and second-hand marketplaces, and track the items they care about.</p>
      <div className="feature-grid">
        <article><Camera /><h3>Image-first search</h3><p>Find exact or similar clothing without knowing the model name.</p></article>
        <article><LineChart /><h3>Price comparison</h3><p>Results are organized by value so users can avoid overpaying.</p></article>
        <article><MapPin /><h3>Local focus</h3><p>Prioritizes stores and marketplaces that ship to Israel.</p></article>
      </div>
    </section>
  );
}
