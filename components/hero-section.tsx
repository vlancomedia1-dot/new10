"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getHero } from "@/lib/home";
import { useLanguage } from "@/lib/i18n/language-context";

type LocalizedString = {
  ar: string;
  en: string;
  ru?: string;
};

type HeroData = {
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  meta_title: LocalizedString;
  meta_description: LocalizedString;
  meta_keywords: LocalizedString;
  image?: string;
  video?: string;
};

type HeroResponse = {
  success: boolean;
  data: HeroData;
};

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [hero, setHero] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    setMounted(true);

    getHero()
      .then((response: HeroResponse) => {
        if (response.success) {
          setHero(response.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Play video when it's loaded and mounted
    const video = videoRef.current;
    if (video && mounted && hero) {
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.error("Video autoplay failed:", error);
        }
      };
      
      // Try to play after a small delay to ensure video is loaded
      const timer = setTimeout(playVideo, 500);
      return () => clearTimeout(timer);
    }
  }, [mounted, hero]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </section>
    );
  }

  if (!hero) return null;

  // Helper function to get localized text with fallback
  const t = (field: LocalizedString) => {
    return field[language] || field.en || field.ar || "";
  };

  // Determine text direction based on language
  const isRTL = language === "ar";
  const isArabic = language === "ar";

  const heroHeadline = isArabic
    ? {
        eyebrow: "شريكك في التحول الرقمي",
        lineOne: "نطوّر المستقبل الرقمي",
        lineTwo: "بثقة وابتكار",
        description: "حيث تتحول الأفكار إلى حلول تقنية رائدة.",
      }
    : null;

  // Use video URL from hero data or fallback to default
  const videoUrl = hero.video || "https://admin.zynqor.org/public/vid.mp4";

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-background pt-16 lg:pt-20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-4 md:pt-8 lg:pt-10 pb-12 md:pb-16 lg:pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Content */}
          <div
            className={`space-y-6 transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-blue-100/90 text-blue-800 px-4 py-2 rounded-full text-sm font-medium w-fit shadow-sm">
              <Sparkles className="w-4 h-4" />
              {isArabic ? heroHeadline?.eyebrow : t(hero.meta_keywords)}
            </div>

            {isArabic ? (
              <div className="space-y-4 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-balance">
                  <span className="block text-foreground">{heroHeadline?.lineOne}</span>
                  <span className="mt-2 block text-transparent bg-clip-text bg-gradient-to-l from-blue-500 via-cyan-500 to-blue-700">
                    {heroHeadline?.lineTwo}
                  </span>
                </h1>

                <div className="max-w-xl rounded-2xl border border-blue-100/80 bg-white/80 backdrop-blur-sm px-5 py-4 shadow-lg shadow-blue-100/40">
                  <p className="text-lg md:text-xl text-slate-700 leading-8 font-medium">
                    {heroHeadline?.description}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl font-bold">
                  {t(hero.title)}
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-500 to-blue-700">
                    {" "}
                    {t(hero.subtitle)}
                  </span>
                </h1>

                <p className="text-lg text-muted-foreground max-w-xl">
                  {t(hero.description)}
                </p>
              </>
            )}

            <div className="flex gap-4">
              <Button size="lg" className="rounded-full">
                {t(hero.meta_title)}
                {isRTL ? (
                  <ArrowLeft className="mr-2 w-4 h-4" />
                ) : (
                  <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
                )}
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                {t(hero.meta_description)}
              </Button>
            </div>
          </div>

          {/* Video */}
          <div
            className={`transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              >
                <source src={videoUrl} type="video/mp4" />
                {isRTL 
                  ? "متصفحك لا يدعم تشغيل الفيديو" 
                  : "Your browser does not support the video tag."}
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
