"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingUp, Users, Award, Briefcase } from "lucide-react";
import { getStatistics } from "@/lib/home";
import { useLanguage } from "@/lib/i18n/language-context";

type LocalizedString = {
  ar: string;
  en: string;
  ru?: string;
};

type StatData = {
  value: string;
  label: LocalizedString;
  icon: string | null;
};

type StatsResponse = {
  success: boolean;
  data: StatData[];
};

// Default icons mapping based on common stat types
const iconMap: Record<string, any> = {
  employee: Users,
  project: Briefcase,
  client: Users,
  experience: TrendingUp,
  success: Award,
};

// Function to determine icon based on label or value
const getIconForStat = (stat: StatData, index: number): any => {
  const labelLower = stat.label.en.toLowerCase();
  
  if (labelLower.includes("employee") || labelLower.includes("team")) return Users;
  if (labelLower.includes("project")) return Briefcase;
  if (labelLower.includes("client") || labelLower.includes("customer")) return Users;
  if (labelLower.includes("experience") || labelLower.includes("year")) return TrendingUp;
  if (labelLower.includes("success") || labelLower.includes("rate")) return Award;
  
  // Fallback to rotation if no match
  const icons = [Briefcase, Users, Award, TrendingUp];
  return icons[index % icons.length];
};

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = target / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-foreground">
      {count}
      {suffix}
    </div>
  );
}

export function StatsSection() {
  const [stats, setStats] = useState<StatData[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    getStatistics()
      .then((response: StatsResponse) => {
        if (response.success) {
          setStats(response.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-6">
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </section>
    );
  }

  if (stats.length === 0) return null;

  // Helper function to get localized text with fallback
  const t = (field: LocalizedString) => {
    return field[language] || field.en || field.ar || "";
  };

  // Parse value to extract number and suffix
  const parseValue = (value: string): { number: number; suffix: string } => {
    const match = value.match(/^(\d+)(.*)$/);
    if (match) {
      return {
        number: parseInt(match[1], 10),
        suffix: match[2] || "",
      };
    }
    return { number: 0, suffix: value };
  };

  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = getIconForStat(stat, index);
            const { number, suffix } = parseValue(stat.value);

            return (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl mb-4 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <Counter target={number} suffix={suffix} />
                <p className="text-muted-foreground mt-2 font-medium">{t(stat.label)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}