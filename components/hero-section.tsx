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
  const isArabic = language === "ar";

  const heroHeadline = isArabic
    ? {
        eyebrow: "شريكك في التحول الرقمي",
        lineOne: "نطوّر المستقبل الرقمي",
        lineTwo: "بثقة وابتكار",
        description: "حيث تتحول الأفكار إلى حلول تقنية رائدة.",
      }
    : null;

  const videoUrl = hero.video || "https://admin.zynqor.org/public/vid.mp4";

  return (
    <section
      id="home"
      className="relative bg-gradient-to-b from-blue-50/50 to-background pt-4 md:pt-6 lg:pt-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 pt-1 md:pt-3 lg:pt-4 pb-12 md:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div
            className={`space-y-6 transition-all duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-100/80 px-4 py-2 text-sm font-medium text-blue-800 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              {isArabic ? heroHeadline?.eyebrow : t(hero.meta_keywords)}
            </div>

            {isArabic ? (
              <div className="mx-auto w-full max-w-xl space-y-5 lg:mx-0 lg:max-w-2xl">
                <div className="w-full max-w-2xl text-center lg:text-right">
                  <h1
                    className="mx-auto flex w-full flex-col items-center overflow-visible pb-2 text-slate-950 lg:mx-0 lg:items-start"
                    style={{ fontFamily: 'var(--font-cairo), Cairo, system-ui, sans-serif' }}
                  >
                    <span className="block w-full whitespace-nowrap pb-[0.16em] text-center text-[2.05rem] font-extrabold leading-[1.34] tracking-[-0.02em] sm:text-[2.45rem] sm:leading-[1.32] md:text-[2.95rem] md:leading-[1.3] lg:text-right lg:text-[3.35rem] lg:leading-[1.24] xl:text-[3.75rem] xl:leading-[1.22]">
                      {heroHeadline?.lineOne}
                    </span>
                    <span className="block w-full whitespace-nowrap pb-[0.18em] text-center text-[1.95rem] font-extrabold leading-[1.32] tracking-[-0.015em] text-transparent bg-gradient-to-l from-blue-500 via-sky-500 to-blue-700 bg-clip-text sm:text-[2.35rem] sm:leading-[1.3] md:text-[2.8rem] md:leading-[1.28] lg:text-right lg:text-[3.1rem] lg:leading-[1.22] xl:text-[3.45rem] xl:leading-[1.2]">
                      {heroHeadline?.lineTwo}
                    </span>
                  </h1>
                </div>

                <div className="mx-auto max-w-xl rounded-2xl border border-blue-100/80 bg-white/85 px-5 py-4 shadow-lg shadow-blue-100/40 backdrop-blur-sm md:px-6 lg:mx-0">
                  <p className="text-center text-base font-medium leading-8 text-slate-700 md:text-lg lg:text-right">
                    {heroHeadline?.description}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold md:text-6xl">
                  {t(hero.title)}
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-500 to-blue-700">
                    {" "}
                    {t(hero.subtitle)}
                  </span>
                </h1>

                <p className="max-w-xl text-lg text-muted-foreground">{t(hero.description)}</p>
              </>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:items-center">
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

          <div
            className={`transition-all duration-700 delay-300 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl shadow-2xl sm:max-w-lg lg:max-w-xl">
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
