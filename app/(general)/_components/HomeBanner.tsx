"use client";
import React from "react";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCardSection } from "@/hooks/CardSectionsContext";
import { getStrapiMediaUrl } from "@/lib/getStrapiMediaUrl";

function HomeBanner() {
  const { data: sections, loading, error } = useCardSection("ponlmmmda3n3wrhw8ilzau85", { populate: "*" });
  const section = sections[0] || null;

  const isDesktop = useIsDesktop(768);

  return (
    <div
      className="container-section bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: isDesktop
          ? `url(${getStrapiMediaUrl(section?.background?.url)})`
          : `url(${getStrapiMediaUrl(section?.mobileBackground?.url)})`,
      }}
    >
      <div className="content-section flex flex-col gap-8 md:gap-10 pt-8 lg:justify-center min-h-[600px] md:min-h-[700px] text-white">
        {section && (
          <>
            <div className="font-orbitron text-4xl md:text-6xl lg:text-7xl">
              {section.title?.split(' ')[0]}
              <br />
              <span className="font-bold">{section.title?.split(' ').slice(1).join(' ')}</span>
            </div>
            <div className="w-fit bg-accent py-2 px-4 sm:px-6 text-lg sm:text-xl md:text-xl rounded-full hidden lg:block">
              {section.subtitle}
            </div>
            <span className="text-base sm:text-lg md:text-xl font-light max-w-lg lg:max-w-lg xl:max-w-xl    ">
              {section.description}
            </span>
            <Button className="w-fit text-base sm:text-lg md:text-xl rounded-full px-6 py-2 sm:py-3 bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary transition-all duration-300">
              <Link href={section.buttonLink || "/"}>
                {section.buttonText}
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default HomeBanner;
