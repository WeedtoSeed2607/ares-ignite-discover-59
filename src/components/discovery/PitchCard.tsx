import { motion, PanInfo } from "framer-motion";
import { Flag, Users, Eye, Puzzle, Instagram, Twitter, Music, Linkedin, Youtube, Github, Facebook } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const gemstoneBackgrounds = [
  "bg-ruby-shine text-white",
  "bg-emerald-shine text-white", 
  "bg-sapphire-shine text-white",
  "bg-amethyst-shine text-white",
  "bg-topaz-shine text-black"
];

const getRandomGemstoneBackground = () => 
  gemstoneBackgrounds[Math.floor(Math.random() * gemstoneBackgrounds.length)];

const getSocialIcon = (platform: string) => {
  switch (platform) {
    case 'instagram': return Instagram;
    case 'twitter': return Twitter;
    case 'tiktok': return Music;
    case 'linkedin': return Linkedin;
    case 'youtube': return Youtube;
    case 'github': return Github;
    case 'facebook': return Facebook;
    default: return Twitter;
  }
};

export type SocialMedia = {
  platform: 'instagram' | 'twitter' | 'tiktok' | 'linkedin' | 'youtube' | 'github' | 'facebook' | 'twitch';
  url: string;
};

export type Pitch = {
  id: string;
  name: string;
  bio: string;
  sample?: string;
  tags?: string[];
  photo?: string;
  video?: string;
  audio?: string;
  poster?: string;
  followerCount?: number;
  viewCount?: number;
  socialMedia?: SocialMedia[];
  mysteryPuzzle?: {
    id: string;
    hint: string;
    revealed: boolean;
  };
};

type Props = {
  pitch: Pitch;
  onSwipe: (dir: "left" | "right") => void;
  onFlag: () => void;
};

const swipeConfidenceThreshold = 10000;

const PitchCard = ({ pitch, onSwipe, onFlag }: Props) => {
  const [exiting, setExiting] = useState<"left" | "right" | null>(null);

  const onDragEnd = (_: any, info: PanInfo) => {
    const swipe = Math.abs(info.offset.x) * info.velocity.x;
    if (swipe < -swipeConfidenceThreshold) {
      setExiting("left");
      onSwipe("left");
    } else if (swipe > swipeConfidenceThreshold) {
      setExiting("right");
      onSwipe("right");
    }
  };

  return (
    <motion.div
      className="relative"
      initial={{ scale: 0.98, opacity: 0.9 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: exiting === "left" ? -300 : 300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={onDragEnd}
      style={{
        filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.2))'
      }}
    >
      <Card className={`w-full max-w-md mx-auto ${getRandomGemstoneBackground()} hover-glow font-google-body relative`}>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-30 pointer-events-none" />
        <button
          onClick={onFlag}
          className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-destructive/20 text-destructive-foreground hover:bg-destructive/30 transition-colors"
          aria-label="Flag as misinformation or trolling"
        >
          <Flag className="h-3.5 w-3.5" /> Flag
        </button>
        <CardContent className="p-6 space-y-4">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-google-display font-bold">{pitch.name}</h3>
                  {pitch.socialMedia && pitch.socialMedia.length > 0 && (
                    <div className="flex items-center gap-1">
                      {pitch.socialMedia.map((social, index) => {
                        const IconComponent = getSocialIcon(social.platform);
                        return (
                          <a
                            key={index}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 backdrop-blur border border-white/30 hover:bg-white/30 transition-colors"
                            aria-label={`${pitch.name} on ${social.platform}`}
                          >
                            <IconComponent className="h-3 w-3" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
                <p className="text-sm opacity-90 mt-1 font-google-body">{pitch.bio}</p>
              </div>
              {(pitch.followerCount !== undefined || pitch.viewCount !== undefined) && (
                <div className="flex flex-col items-end gap-1 mt-8">
                  {pitch.followerCount !== undefined && (
                    <div className="flex items-center gap-1 text-xs bg-black/30 backdrop-blur px-2 py-1 rounded-full border border-white/20">
                      <Users className="h-3 w-3" />
                      <span className="font-medium">{pitch.followerCount.toLocaleString()}</span>
                    </div>
                  )}
                  {pitch.viewCount !== undefined && (
                    <div className="flex items-center gap-1 text-xs bg-black/30 backdrop-blur px-2 py-1 rounded-full border border-white/20">
                      <Eye className="h-3 w-3" />
                      <span className="font-medium">{pitch.viewCount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {pitch.tags && pitch.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {pitch.tags.map(t => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full bg-black/20 backdrop-blur text-white border border-white/30 font-google-body">{t}</span>
                ))}
              </div>
            )}
          </div>

          {pitch.sample && (
            <div className="p-4 rounded-md bg-black/20 backdrop-blur border border-white/30">
              <p className="text-sm font-google-body"><span className="font-medium">Sample:</span> {pitch.sample}</p>
            </div>
          )}

          {(pitch.photo || pitch.video || pitch.audio) && (
            <div className="space-y-3">
              {pitch.photo && (
                <img
                  src={pitch.photo}
                  alt={`${pitch.name} sample photo`}
                  className="w-full rounded-md"
                  loading="lazy"
                />
              )}
              {pitch.video && (
                <video className="w-full rounded-md" controls poster={pitch.poster} preload="metadata">
                  <source src={pitch.video} type="video/mp4" />
                </video>
              )}
              {pitch.audio && (
                <audio className="w-full" controls preload="metadata">
                  <source src={pitch.audio} type="audio/mpeg" />
                </audio>
              )}
            </div>
          )}

          {pitch.mysteryPuzzle && (
            <div className="relative">
              <div className="absolute bottom-2 left-2 group">
                <div className="p-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur border border-white/30 hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-300 cursor-pointer hover:scale-110">
                  <Puzzle className="h-4 w-4 text-white animate-pulse" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 backdrop-blur text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Mystery puzzle: {pitch.mysteryPuzzle.hint}
                </div>
              </div>
            </div>
          )}

          
          <div className="pt-3 text-center">
            <p className="text-xs opacity-70 font-google-body">
              Unauthorised Usage of this idea/platform would be liable for a lawsuit. Don't try
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PitchCard;
