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
    const video = videoRef.current;
    if (video && mounted && hero) {
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.error("Video autoplay failed:", error);
        }
      };

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

  const t = (field: LocalizedString) => {
    return field[language] || field.en || field.ar || "";
  };

  const isRTL = language === "ar";
  const videoUrl = hero.video || "https://admin.zynqor.org/public/vid.mp4";

  const titleText = t(hero.title);
  const subtitleText = t(hero.subtitle);
  const descriptionText = t(hero.description);

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-background pt-16 lg:pt-20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 pt-4 md:pt-8 lg:pt-10 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-2">
          <div
            className={`order-2 lg:order-1 transition-all duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 text-center lg:mx-0 lg:items-start lg:text-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/80 px-4 py-2 text-sm font-medium text-blue-800 shadow-sm backdrop-blur w-fit">
                <Sparkles className="h-4 w-4" />
                <span className="leading-none">{t(hero.meta_keywords)}</span>
              </div>

              <div className="space-y-3 md:space-y-4">
                <h1 className="max-w-[14ch] text-balance text-4xl font-extrabold leading-[1.2] tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:max-w-[12ch] xl:text-7xl">
                  <span className="block">{titleText}</span>
                  <span className="mt-2 block text-transparent bg-gradient-to-l from-blue-500 via-sky-500 to-blue-700 bg-clip-text">
                    {subtitleText}
                  </span>
                </h1>
              </div>

              <div className="w-full max-w-xl rounded-3xl border border-blue-100 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm md:px-6 md:py-5">
                <p className="text-base leading-8 text-slate-700 md:text-lg">
                  {descriptionText}
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button size="lg" className="min-h-12 rounded-full px-6 text-base shadow-md">
                  {t(hero.meta_title)}
                  {isRTL ? (
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  ) : (
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="min-h-12 rounded-full border-blue-200 bg-white/70 px-6 text-base text-slate-700"
                >
                  {t(hero.meta_description)}
                </Button>
              </div>
            </div>
          </div>

          <div
            className={`order-1 lg:order-2 transition-all duration-700 delay-300 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
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
