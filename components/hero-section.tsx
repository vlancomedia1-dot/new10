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
      className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-background pt-6 md:pt-8 lg:pt-10"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 pt-2 md:pt-4 lg:pt-6 pb-12 md:pb-16 lg:pb-20">
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
              <div className="mx-auto flex w-full max-w-xl flex-col items-center space-y-4 lg:max-w-2xl">
                <h1 className="flex w-full flex-col items-center text-center font-extrabold tracking-tight text-slate-950">
                  <span className="inline-block whitespace-nowrap pb-2 font-[Tajawal,IBM_Plex_Sans_Arabic,system-ui,sans-serif] text-[2.3rem] leading-[1.22] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[3.6rem] xl:text-[3.9rem]">
                    {heroHeadline?.lineOne}
                  </span>
                  <span className="inline-block whitespace-nowrap pb-1 text-center font-[Tajawal,IBM_Plex_Sans_Arabic,system-ui,sans-serif] text-[2.05rem] leading-[1.24] text-transparent bg-gradient-to-l from-blue-500 via-sky-500 to-blue-700 bg-clip-text sm:text-[2.45rem] md:text-[2.85rem] lg:text-[3.05rem] xl:text-[3.2rem]">
                    {heroHeadline?.lineTwo}
                  </span>
                </h1>

                <div className="group relative mx-auto max-w-xl overflow-hidden rounded-[28px] border border-blue-200/70 bg-gradient-to-l from-white via-sky-50 to-blue-50 px-5 py-4 shadow-[0_18px_50px_-24px_rgba(37,99,235,0.45)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(14,165,233,0.5)] md:px-6 lg:mx-0">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_34%)] opacity-90" />
                  <div className="pointer-events-none absolute -left-16 top-0 h-full w-24 -skew-x-12 bg-white/40 blur-xl transition-transform duration-700 group-hover:translate-x-[220%]" />
                  <div className="relative flex items-center justify-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-[0_0_0_6px_rgba(37,99,235,0.12)]" />
                    <p className="text-center text-base font-semibold leading-8 text-slate-800 md:text-lg lg:text-right">
                      {heroHeadline?.description}
                    </p>
                  </div>
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
