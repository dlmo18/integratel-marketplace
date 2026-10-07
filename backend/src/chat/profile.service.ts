import { Injectable } from "@nestjs/common";
import { CATALOG, CatalogProduct, PriceTier } from "./catalog-data";

// ===== Tipos del cuestionario =====
export interface ProfileOption {
  value: string;
  label: string;
}

export interface ProfileQuestion {
  id: string;
  question: string;
  options: ProfileOption[];
}

export interface ProfileAnswers {
  [questionId: string]: string;
}

export interface RecommendedProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  image: string;
  shortDescription: string;
  reason: string;
}

// ===== Set de preguntas para perfilar al cliente =====
// Cada opción aporta "tags", categorías o un rango de precio al matching.
export const PROFILE_QUESTIONS: ProfileQuestion[] = [
  {
    id: "forWho",
    question: "¿Para quién estás buscando?",
    options: [
      { value: "self", label: "Para mí" },
      { value: "gift", label: "Un regalo" },
      { value: "family", label: "Para mi familia / hogar" },
      { value: "kids", label: "Para niños" }
    ]
  },
  {
    id: "interest",
    question: "¿Qué te interesa más?",
    options: [
      { value: "tech", label: "Tecnología y gadgets" },
      { value: "home", label: "Hogar y cocina" },
      { value: "sport", label: "Deporte y fitness" },
      { value: "fashion", label: "Moda y estilo" },
      { value: "beauty", label: "Belleza y cuidado personal" },
      { value: "phone", label: "Telefonía / smartphones" }
    ]
  },
  {
    id: "usage",
    question: "¿Para qué lo usarías principalmente?",
    options: [
      { value: "work", label: "Trabajo / estudio" },
      { value: "entertainment", label: "Entretenimiento" },
      { value: "fitness", label: "Actividad física / salud" },
      { value: "daily", label: "Uso diario / práctico" }
    ]
  },
  {
    id: "budget",
    question: "¿Cuál es tu presupuesto aproximado?",
    options: [
      { value: "low", label: "Hasta S/ 300" },
      { value: "mid", label: "S/ 300 a S/ 1500" },
      { value: "high", label: "Más de S/ 1500" }
    ]
  }
];

// Mapeos de respuestas a señales de matching.
const INTEREST_TO_CATEGORY: Record<string, string[]> = {
  tech: ["tecnologia", "movistar"],
  home: ["hogar"],
  sport: ["deportes", "moda"],
  fashion: ["moda"],
  beauty: ["belleza"],
  phone: ["movistar"]
};

const INTEREST_TO_TAGS: Record<string, string[]> = {
  tech: ["tecnologia", "computo", "wearable", "audio"],
  home: ["hogar", "cocina", "electrodomestico"],
  sport: ["deporte", "fitness", "running"],
  fashion: ["moda", "ropa"],
  beauty: ["belleza", "cuidado"],
  phone: ["telefonia", "conectividad"]
};

const FORWHO_TO_TAGS: Record<string, string[]> = {
  self: [],
  gift: ["regalo"],
  family: ["familia", "hogar"],
  kids: ["ninos", "juguetes", "creatividad"]
};

const USAGE_TO_TAGS: Record<string, string[]> = {
  work: ["trabajo", "estudio", "productividad", "computo"],
  entertainment: ["entretenimiento", "audio", "musica"],
  fitness: ["fitness", "deporte", "salud", "running"],
  daily: ["familia", "cocina", "personal"]
};

const BUDGET_TO_TIER: Record<string, PriceTier[]> = {
  low: ["bajo"],
  mid: ["bajo", "medio"],
  high: ["medio", "alto"]
};

@Injectable()
export class ProfileService {
  getQuestions(): ProfileQuestion[] {
    return PROFILE_QUESTIONS;
  }

  // Motor de recomendación: puntúa cada producto según las respuestas.
  recommend(answers: ProfileAnswers, limit = 3): RecommendedProduct[] {
    const interest = answers.interest;
    const forWho = answers.forWho;
    const usage = answers.usage;
    const budget = answers.budget;

    const wantedCategories = INTEREST_TO_CATEGORY[interest] || [];
    const interestTags = INTEREST_TO_TAGS[interest] || [];
    const forWhoTags = FORWHO_TO_TAGS[forWho] || [];
    const usageTags = USAGE_TO_TAGS[usage] || [];
    const allowedTiers = BUDGET_TO_TIER[budget] || ["bajo", "medio", "alto"];

    const scored = CATALOG.map((p) => {
      const { score, reasons } = this.scoreProduct(p, {
        wantedCategories,
        interestTags,
        forWhoTags,
        usageTags,
        allowedTiers
      });
      return { product: p, score, reason: reasons.join(" · ") };
    });

    // Ordena por puntaje y, a igualdad, por rating.
    scored.sort((a, b) => b.score - a.score || b.product.rating - a.product.rating);

    const top = scored.filter((s) => s.score > 0).slice(0, limit);
    // Si nada hizo match (perfil muy raro), cae a los mejor valorados.
    const chosen = top.length > 0 ? top : scored.slice(0, limit);

    return chosen.map(({ product, reason }) => this.toRecommended(product, reason));
  }

  private scoreProduct(
    p: CatalogProduct,
    ctx: {
      wantedCategories: string[];
      interestTags: string[];
      forWhoTags: string[];
      usageTags: string[];
      allowedTiers: PriceTier[];
    }
  ): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    if (ctx.wantedCategories.includes(p.category)) {
      score += 5;
      reasons.push("coincide con tu interés");
    }

    const interestMatches = p.tags.filter((t) => ctx.interestTags.includes(t)).length;
    if (interestMatches > 0) score += interestMatches * 2;

    const usageMatches = p.tags.filter((t) => ctx.usageTags.includes(t)).length;
    if (usageMatches > 0) {
      score += usageMatches * 2;
      reasons.push("ideal para el uso que buscas");
    }

    const forWhoMatches = p.tags.filter((t) => ctx.forWhoTags.includes(t)).length;
    if (forWhoMatches > 0) {
      score += forWhoMatches * 2;
      reasons.push("buena opción según para quién es");
    }

    // Presupuesto: dentro del rango suma, fuera penaliza.
    if (ctx.allowedTiers.includes(p.priceTier)) {
      score += 3;
      reasons.push("dentro de tu presupuesto");
    } else {
      score -= 4;
    }

    // Pequeño bonus por buena valoración.
    score += (p.rating - 4) * 2;

    return { score, reasons: reasons.slice(0, 2) };
  }

  private toRecommended(p: CatalogProduct, reason: string): RecommendedProduct {
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      brand: p.brand,
      price: p.price,
      rating: p.rating,
      image: p.image,
      shortDescription: p.shortDescription,
      reason: reason || "destacado por su buena valoración"
    };
  }

  // Resumen legible del perfil (para el texto del asistente y el fallback).
  describeProfile(answers: ProfileAnswers): string {
    const labelOf = (qid: string, value: string) => {
      const q = PROFILE_QUESTIONS.find((x) => x.id === qid);
      return q?.options.find((o) => o.value === value)?.label || value;
    };
    const parts: string[] = [];
    if (answers.forWho) parts.push(labelOf("forWho", answers.forWho));
    if (answers.interest) parts.push(labelOf("interest", answers.interest));
    if (answers.usage) parts.push(labelOf("usage", answers.usage));
    if (answers.budget) parts.push(labelOf("budget", answers.budget));
    return parts.join(" · ");
  }
}
