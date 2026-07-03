import { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoEmbedProps {
  src: string;
  poster?: string;
  title: string;
  className?: string;
}

// Click-to-play: shows the poster until the user hits play, so none of the large
// (12–29MB) GoDaddy-hosted videos download until requested. Keeps the page fast.
export default function VideoEmbed({ src, poster, title, className = '' }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <video
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        preload="metadata"
        className={`aspect-video w-full rounded-none bg-ink object-cover ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className={`group relative aspect-video w-full overflow-hidden rounded-none bg-ink ring-1 ring-paper/20 ${className}`}
    >
      {poster && (
        <img
          src={poster}
          alt={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
        />
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/90 text-ink transition group-hover:scale-110 group-hover:bg-paper">
          <Play size={26} className="ml-1" fill="currentColor" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}
