"use client";
import { useEffect, useState } from "react";

interface FeatureCard {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}
import { Card, CardContent } from "@/components/ui/card";
import { getCardSections } from "@/hooks/cardSectionsAPI";

export default function FeaturesSection() {
  const [featuresSectionTitle, setFeaturesSectionTitle] = useState<string>("");
  const [cards, setCards] = useState<FeatureCard[]>([]);

  useEffect(() => {
    async function fetchFeaturesSection() {
      try {
        const sections = await getCardSections({
          documentId: "fstrvw9pumbbsvv1qcco52o4",
          populateCard: true
        });
        const section = sections[0];
        console.log("FeaturesSection data:", section);
        setFeaturesSectionTitle(section?.title || "");
        const mappedCards = (section?.card || []).map((card: any): FeatureCard => {
          let description = "";
          if (Array.isArray(card.description) && card.description.length > 0) {
            const paragraph = card.description.find((d: any) => d.type === "paragraph");
            if (paragraph && Array.isArray(paragraph.children) && paragraph.children.length > 0) {
              description = paragraph.children.map((child: any) => child.text).join(" ");
            }
          }
          return {
            image: card.image?.url ? `${process.env.NEXT_PUBLIC_STRAPI_ENDPOINT}${card.image.url}` : "/feature1.png",
            title: card.title,
            description,
            buttonText: card.buttonText,
            buttonLink: card.buttonLink,
            id: card.id
          };
        });
        setCards(mappedCards);
        mappedCards.forEach((card: FeatureCard) => console.log("Card asociada:", card));
      } catch (error) {
        console.error("Error al obtener features section:", error);
      }
    }
    fetchFeaturesSection();
  }, []);

  return (
    <section className="relative bg-gray-100 py-16 z-1 container-section">
      {/* Gradient Decoration */}
      <div className="absolute left-0 top-10 h-32 hidden lg:block md:h-64 w-32 sm:w-48 md:w-64  z-0">
        <img 
          src="/iconotipo.png" 
          alt="Iconotipo MainTech" 
          className="w-full h-full object-contain opacity-40"
        />      
      </div>

      <div className="content-section   ">
        <h2 className="mb-12 z-10 text-center text-3xl font-bold text-gray-800">
          {featuresSectionTitle}
          <span className="mt-2 block h-1 w-20 bg-pink-500 mx-auto"></span>
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((feature, index) => (
            <Card key={feature.id || index} className="border-none shadow-lg z-10">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-6 rounded-full p-3">
                  <img 
                    src={feature.image}
                    className="w-[120px]"
                    alt={feature.title}
                  />
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
                {feature.buttonText && feature.buttonLink && (
                  <a href={feature.buttonLink} className="mt-2 text-blue-600 underline block">{feature.buttonText}</a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

