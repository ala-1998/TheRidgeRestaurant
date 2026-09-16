import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  UtensilsCrossed,
  Fish,
  Flame,
  ChefHat,
  Share2,
  Check,
  X,
  Plus,
  Minus,
  ShoppingBag,
  ArrowUp
} from 'lucide-react';

/* ==========================================================================
   THE RIDGE RESTAURANT - MENU DATA SOURCE
   Faithfully transcribed from original physical menu with exact prices & items
   ========================================================================== */

export interface MenuItem {
  id: string;
  name: string;
  price: number | string; // number or special label like "Selon arrivage"
  priceUnit?: string;
  category: string;
  description?: string;
  tags?: ('signature' | 'fruits_de_mer' | 'sur_commande' | 'chef' | 'vegetarien')[];
  spicy?: boolean;
}

export interface Category {
  id: string;
  name: string;
  subheading?: string;
  iconName: string;
  isSpecialCard?: boolean;
}

export const CATEGORIES: Category[] = [
  { id: 'entrees_froides', name: 'Entrées froides', iconName: 'salad' },
  { id: 'entrees_chaudes', name: 'Entrées chaudes', iconName: 'flame' },
  { id: 'ojjas', name: 'Ojjas', iconName: 'bowl' },
  { id: 'escalopes', name: 'Escalopes', iconName: 'meat' },
  { id: 'pates', name: 'Pâtes', subheading: 'Spaghetti / Penne / Linguine au choix', iconName: 'pasta' },
  { id: 'viandes_rouges', name: 'Viandes rouges', iconName: 'steak' },
  { id: 'poissons', name: 'Poissons', iconName: 'fish' },
  { id: 'sur_commande', name: 'Sur commande', iconName: 'star', isSpecialCard: true },
  { id: 'desserts', name: 'Desserts', iconName: 'dessert' },
  { id: 'boissons', name: 'Boissons', iconName: 'drink' },
];

export const MENU_ITEMS: MenuItem[] = [
  // --- Entrées froides ---
  {
    id: 'ef-1',
    name: 'Salade verte',
    price: 10,
    category: 'entrees_froides',
    description: 'Sélection de crudités fraîches, vinaigrette maison et herbes fines',
    tags: ['vegetarien']
  },
  {
    id: 'ef-2',
    name: 'Salade méchouia',
    price: 12,
    category: 'entrees_froides',
    description: 'Poivrons et tomates grillés au feu de bois, ail, huile d’olive et thon',
    tags: ['signature']
  },
  {
    id: 'ef-3',
    name: 'Salade césar',
    price: 25,
    category: 'entrees_froides',
    description: 'Laitue croquante, filet de volaille rôti, copeaux de parmesan et sauce césar',
  },
  {
    id: 'ef-4',
    name: 'Salade fruits de mer',
    price: 30,
    category: 'entrees_froides',
    description: 'Généreux assortiment marin : crevettes, calamars marinés et agrumes',
    tags: ['fruits_de_mer', 'chef']
  },

  // --- Entrées chaudes ---
  {
    id: 'ec-1',
    name: 'Brik aux thon',
    price: 8,
    category: 'entrees_chaudes',
    description: 'Feuille de malsouka dorée et croustillante, œuf coulant, thon, persil et câpres',
    tags: ['signature']
  },
  {
    id: 'ec-2',
    name: 'Brik aux chevrettes',
    price: 12,
    category: 'entrees_chaudes',
    description: 'Brik croustillante farcie de petites crevettes fraîches assaisonnées',
    tags: ['fruits_de_mer']
  },
  {
    id: 'ec-3',
    name: 'Soupe de poisson',
    price: 15,
    category: 'entrees_chaudes',
    description: 'Soupe côtière traditionnelle mijotée aux poissons de roche et épices méditerranéennes',
    tags: ['fruits_de_mer']
  },
  {
    id: 'ec-4',
    name: 'Chevrettes sautées à l’ail',
    price: 25,
    category: 'entrees_chaudes',
    description: 'Crevettes poêlées minute à l’huile d’olive vierge, ail doré et piment doux',
    tags: ['fruits_de_mer', 'chef']
  },

  // --- Ojjas ---
  {
    id: 'oj-1',
    name: 'Ojja merguez',
    price: 22,
    category: 'ojjas',
    description: 'Sauce tomate mijotée pimentée, œufs pochés et merguez artisanales grillées',
    tags: ['signature'],
    spicy: true
  },
  {
    id: 'oj-2',
    name: 'Ojja escalopes',
    price: 22,
    category: 'ojjas',
    description: 'Fondue de tomates, poivrons rouges, œufs et émincé d’escalope dorée',
    spicy: true
  },
  {
    id: 'oj-3',
    name: 'Ojja fruits de mer',
    price: 30,
    category: 'ojjas',
    description: 'Traditionnelle poêlée relevée aux calamars, crevettes et herbes fraîches',
    tags: ['fruits_de_mer', 'chef'],
    spicy: true
  },

  // --- Escalopes ---
  {
    id: 'esc-1',
    name: 'Escalope grillée',
    price: 20,
    category: 'escalopes',
    description: 'Blanc de volaille saisi à la braise, garniture au choix',
  },
  {
    id: 'esc-2',
    name: 'Escalope panée',
    price: 23,
    category: 'escalopes',
    description: 'Escalope enrobée d’une chapelure dorée et croustillante, quartiers de citron',
  },
  {
    id: 'esc-3',
    name: 'Escalope à la crème et aux champignons',
    price: 27,
    category: 'escalopes',
    description: 'Nappée d’une onctueuse réduction de crème fraîche et champignons de Paris',
    tags: ['chef']
  },
  {
    id: 'esc-4',
    name: 'Escalope à l’italienne (sauce à la créme, jambon et fromage)',
    price: 30,
    category: 'escalopes',
    description: 'Gratinée au four avec sauce à la crème riche, jambon savoureux et fromage fondant',
    tags: ['signature']
  },

  // --- Pâtes (Spaghetti/Penne/Linguine) ---
  {
    id: 'pat-1',
    name: 'Pâtes à la bolognaise',
    price: 25,
    category: 'pates',
    description: 'Mijoté classique de viande hachée, tomates san marzano, ail et basilic',
  },
  {
    id: 'pat-2',
    name: 'Pâtes aux fruits de mer',
    price: 37,
    category: 'pates',
    description: 'Crevettes royales, calamars et moules dans un jus marin parfumé',
    tags: ['fruits_de_mer', 'signature']
  },
  {
    id: 'pat-3',
    name: 'Tagliatelles sauce pesto',
    price: 40,
    category: 'pates',
    description: 'Pesto frais au basilic doux, pignons de pin, huile d’olive et parmesan râpé',
    tags: ['vegetarien']
  },
  {
    id: 'pat-4',
    name: 'Tagliatelles aux crevettes épicées',
    price: 37,
    category: 'pates',
    description: 'Tagliatelles fraîches liées d’une émulsion aux crevettes et piments doux',
    tags: ['fruits_de_mer'],
    spicy: true
  },
  {
    id: 'pat-5',
    name: 'Lasagnes à la bolognaise',
    price: 28,
    category: 'pates',
    description: 'Feuilles de pâtes superposées, béchamel veloutée, ragoût de bœuf et fromage doré au four',
  },
  {
    id: 'pat-6',
    name: 'Lasagnes aux fruits de mer',
    price: 35,
    category: 'pates',
    description: 'Création signature du chef : lasagnes garnies de fruits de mer et sauce veloutée',
    tags: ['fruits_de_mer', 'chef']
  },

  // --- Viandes rouges ---
  {
    id: 'vr-1',
    name: 'Filet de bœuf grillé',
    price: 42,
    category: 'viandes_rouges',
    description: 'Pièce noble de bœuf sélectionnée, grillée selon votre cuisson désirée',
    tags: ['signature']
  },
  {
    id: 'vr-2',
    name: 'Filet de bœuf à la créme et aux champignons',
    price: 45,
    category: 'viandes_rouges',
    description: 'Filet tendre sublimé par une sauce veloutée aux champignons sauvages',
    tags: ['chef']
  },
  {
    id: 'vr-3',
    name: 'Filet de bœuf à la sauce crémeuse au poivre',
    price: 48,
    category: 'viandes_rouges',
    description: 'Sauce onctueuse montée au poivre de Madagascar concassé et cognac',
    tags: ['signature']
  },

  // --- Poissons ---
  {
    id: 'poi-1',
    name: 'Poisson du jour (par 100g selon arrivage)',
    price: 'Selon arrivage',
    priceUnit: 'par 100g',
    category: 'poissons',
    description: 'Pêche locale fraîche du matin, préparée entière grillée ou au four',
    tags: ['fruits_de_mer', 'signature']
  },
  {
    id: 'poi-2',
    name: 'Daurade grillée',
    price: 23,
    category: 'poissons',
    description: 'Daurade entière cuite à la plancha, herbes fraîches et quartier de citron',
    tags: ['fruits_de_mer']
  },
  {
    id: 'poi-3',
    name: 'Loup grillée',
    price: 27,
    category: 'poissons',
    description: 'Loup de mer royal grillé avec filet d’huile d’olive et fleur de sel',
    tags: ['fruits_de_mer']
  },
  {
    id: 'poi-4',
    name: 'Calamars grillée',
    price: 35,
    category: 'poissons',
    description: 'Calamars frais grillés tendres et caramélisés, assaisonnement provençal',
    tags: ['fruits_de_mer']
  },
  {
    id: 'poi-5',
    name: 'Symphonie de fruits de mer (2 personnes)',
    price: 120,
    category: 'poissons',
    description: 'Plateau prestigieux pour 2 personnes composé de poissons nobles, gambas, calamars et coquillages',
    tags: ['fruits_de_mer', 'chef', 'signature']
  },

  // --- Sur commande (Special highlighted items) ---
  {
    id: 'sc-1',
    name: 'Poisson en croûte de sel',
    price: 'Sur devis',
    priceUnit: '(par grammes)',
    category: 'sur_commande',
    description: 'Grand poisson sauvage cuit à l’étouffée sous une croûte de sel marin préservant tous les sucs',
    tags: ['sur_commande', 'fruits_de_mer', 'chef']
  },
  {
    id: 'sc-2',
    name: 'Gigot d’agneau au four au miel et amandes effilées',
    price: 220,
    category: 'sur_commande',
    description: 'Pièce entière rôtie lentement durant 5 heures, laquée au miel de thym et amandes grillées',
    tags: ['sur_commande', 'chef', 'signature']
  },

  // --- Desserts ---
  {
    id: 'des-1',
    name: 'Fondant au chocolat',
    price: 8,
    category: 'desserts',
    description: 'Cœur coulant au chocolat noir 70%, servi tiède',
    tags: ['signature']
  },
  {
    id: 'des-2',
    name: 'Sorbet au citron',
    price: 8,
    category: 'desserts',
    description: 'Sorbet artisanal rafraîchissant au citron vert et zeste confit',
  },
  {
    id: 'des-3',
    name: 'Cheesecake',
    price: 13,
    category: 'desserts',
    description: 'Gâteau crémeux new-yorkais sur lit de spéculoos croustillant et coulis de fruits',
  },
  {
    id: 'des-4',
    name: 'Fruits de saison',
    price: 25,
    category: 'desserts',
    description: 'Sélection rafraîchissante de tranches de fruits frais du marché',
  },

  // --- Boissons ---
  {
    id: 'boi-1',
    name: 'Eau minérale (0,5l)',
    price: 2.5,
    category: 'boissons',
    description: 'Bouteille individuelle 50cl servie fraîche',
  },
  {
    id: 'boi-2',
    name: 'Eau minérale (1l)',
    price: 4,
    category: 'boissons',
    description: 'Bouteille grand format 100cl',
  },
  {
    id: 'boi-3',
    name: 'Eau gazeuse',
    price: 5,
    category: 'boissons',
    description: 'Eau minérale pétillante rafraîchissante',
  },
  {
    id: 'boi-4',
    name: 'Sodas',
    price: 5,
    category: 'boissons',
    description: 'Coca-Cola, Sprite, Fanta, Boga, Tonic',
  },
  {
    id: 'boi-5',
    name: 'Jus frais de saison',
    price: 8,
    category: 'boissons',
    description: 'Pressé minute selon les agrumes et fruits frais du jour',
    tags: ['signature']
  }
];

/* ==========================================================================
   HELPER FORMATTER
   ========================================================================== */
function formatPrice(val: number | string): string {
  if (typeof val === 'number') {
    // Format 2.5 as 2,5 DT and 10 as 10 DT
    const str = val % 1 === 0 ? val.toString() : val.toFixed(1).replace('.', ',');
    return `${str} DT`;
  }
  return val;
}

/* ==========================================================================
   MAIN COMPONENT: The Ridge Restaurant Menu App
   ========================================================================== */
export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFilterTag, setActiveFilterTag] = useState<string>('all');
  const [tableOrder, setTableOrder] = useState<Record<string, number>>({});
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Tag filter
      if (activeFilterTag === 'fruits_de_mer' && !item.tags?.includes('fruits_de_mer')) {
        return false;
      }
      if (activeFilterTag === 'signature' && !item.tags?.includes('signature')) {
        return false;
      }
      if (activeFilterTag === 'sur_commande' && item.category !== 'sur_commande' && !item.tags?.includes('sur_commande')) {
        return false;
      }
      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const inName = item.name.toLowerCase().includes(query);
        const inDesc = item.description ? item.description.toLowerCase().includes(query) : false;
        const inCat = CATEGORIES.find(c => c.id === item.category)?.name.toLowerCase().includes(query) || false;
        return inName || inDesc || inCat;
      }
      return true;
    });
  }, [selectedCategory, activeFilterTag, searchTerm]);

  // Group items by category for structured display
  const groupedCategories = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const items = filteredItems.filter((i) => i.category === cat.id);
      return {
        ...cat,
        items
      };
    }).filter((catGroup) => catGroup.items.length > 0);
  }, [filteredItems]);

  // Total items in waiter notes
  const orderCount = useMemo(() => {
    return Object.values(tableOrder).reduce((a: number, b: number) => a + b, 0);
  }, [tableOrder]);

  const orderTotalDT = useMemo(() => {
    return Object.entries(tableOrder).reduce((sum: number, [itemId, qty]) => {
      const it = MENU_ITEMS.find((m) => m.id === itemId);
      if (it && typeof it.price === 'number') {
        return sum + it.price * Number(qty);
      }
      return sum;
    }, 0);
  }, [tableOrder]);

  const updateOrderQty = (itemId: string, delta: number) => {
    setTableOrder((prev) => {
      const curr = prev[itemId] || 0;
      const next = curr + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Ridge Restaurant - Menu Digital',
          text: 'Consultez la carte de The Ridge Restaurant',
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const scrollToCategory = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      window.scrollTo({ top: 350, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(`section-${catId}`);
    if (elem) {
      const headerOffset = 135;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#102a22] text-[#f7f3e8] font-sans antialiased pb-28">
      {/* ====================================================================
          TOP BAR / ANNOUNCEMENT BADGE
          ==================================================================== */}
      <header className="w-full bg-[#0a1e18] border-b border-[#1f4a3b]/40 py-2 px-4 text-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-emerald-300 uppercase tracking-widest text-[10px]">
              Ouvert Aujourd&apos;hui
            </span>
            <span className="text-[#88a99b] hidden sm:inline">•</span>
            <span className="text-[#a4c0b4] hidden sm:inline">12h00 — 23h30</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-[#d5c49f] hover:text-white transition-colors cursor-pointer text-[11px]"
              title="Partager le menu"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Lien copié !</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Partager</span>
                </>
              )}
            </button>

            <a
              href="tel:+21671000000"
              className="flex items-center gap-1 bg-[#1a4436] hover:bg-[#235846] text-[#dfc38a] px-2.5 py-0.5 rounded-full border border-[#c5a059]/30 transition-colors"
            >
              <Phone className="w-3 h-3 text-[#dfc38a]" />
              <span className="text-[11px] font-medium">Réserver</span>
            </a>
          </div>
        </div>
      </header>

      {/* ====================================================================
          SLEEK HERO SECTION
          Mirroring cover styling: Rich forest green texture, gold serif typography,
          and stylized geometric mountain silhouette peaks from the original menu
          ==================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0e2c22] via-[#12362b] to-[#0c241c] border-b border-[#2b5949]/50 pt-8 pb-10 px-4">
        {/* Subtle geometric pattern overlay resembling cover weave */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#c5a059 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Cover Mountains Crest SVG */}
          <div className="mb-4">
            <svg 
              className="w-20 h-16 text-[#e5dbbe] drop-shadow-md"
              viewBox="0 0 100 80" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Stylized sharp mountain peaks mirroring page 1 */}
              <polygon points="50,10 70,75 30,75" fill="#e8dfc8" />
              <polygon points="50,10 70,75 50,75" fill="#14372c" opacity="0.85" />
              <polygon points="28,30 45,75 10,75" fill="#f0e9d8" />
              <polygon points="28,30 45,75 28,75" fill="#0d281e" opacity="0.9" />
              <polygon points="72,32 92,75 52,75" fill="#dfd4bc" />
              <polygon points="72,32 92,75 72,75" fill="#184134" opacity="0.9" />
            </svg>
          </div>

          {/* Restaurant Title matching font & framing */}
          <div className="relative inline-block mb-3">
            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl tracking-[0.18em] font-bold text-[#f5eedb] uppercase drop-shadow">
              The Ridge
            </h1>
            <div className="mt-1 inline-block bg-[#163f32] border border-[#c5a059]/40 px-6 py-0.5 rounded shadow-inner">
              <p className="font-cinzel text-xs sm:text-sm tracking-[0.35em] text-[#d6c49e] font-semibold uppercase">
                Restaurant
              </p>
            </div>
          </div>

          {/* Tagline / Subtitle */}
          <p className="font-garamond italic text-[#c8dacfc9] text-base sm:text-lg max-w-md mt-1 mb-5">
            Gastronomie méditerranéenne &amp; spécialités terre-mer au cœur des hauteurs
          </p>

          {/* Info pill list: Hours, Address, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full max-w-xl text-left bg-[#0c221a]/80 backdrop-blur border border-[#2b5949]/60 rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-2.5 px-2 py-1">
              <div className="p-1.5 rounded-lg bg-[#184033] text-[#d6c49e]">
                <Clock className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="block text-[10px] uppercase font-semibold text-[#8caea0] tracking-wider">Horaires</span>
                <span className="text-xs text-[#f1ebdc] font-medium">12h00 — 23h30</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-2 py-1 border-t sm:border-t-0 sm:border-l border-[#204a3c]/60">
              <div className="p-1.5 rounded-lg bg-[#184033] text-[#d6c49e]">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="block text-[10px] uppercase font-semibold text-[#8caea0] tracking-wider">Adresse</span>
                <span className="text-xs text-[#f1ebdc] font-medium">Vue Panoramique, Tunis</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-2 py-1 border-t sm:border-t-0 sm:border-l border-[#204a3c]/60">
              <div className="p-1.5 rounded-lg bg-[#184033] text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="block text-[10px] uppercase font-semibold text-[#8caea0] tracking-wider">Service</span>
                <span className="text-xs text-emerald-300 font-medium">Plat du jour au marché</span>
              </div>
            </div>
          </div>

          {/* Daily Special Highlight Banner (Page 4 from Menu) */}
          <div className="mt-4 w-full max-w-xl bg-gradient-to-r from-[#173e31] via-[#1f5040] to-[#173e31] border border-[#c5a059]/40 rounded-xl p-3.5 shadow-md flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/60 flex items-center justify-center text-[#e9dcba]">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-cinzel text-sm font-semibold tracking-wide text-[#f5edd8]">
                  Plat du jour
                </h4>
                <p className="font-garamond italic text-[#cfdecb] text-xs">
                  « Selon la fraîcheur du marché » — Demandez nos arrivages au serveur
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block bg-[#0e271f] text-[#c5a059] text-[11px] font-semibold px-2.5 py-1 rounded-md border border-[#c5a059]/30">
              Pêche Locale
            </span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          STICKY NAVIGATION & LIVE SEARCH (Optimized for Mobile Viewports)
          ==================================================================== */}
      <div className="sticky top-0 z-30 bg-[#0d261e]/95 backdrop-blur-md border-b border-[#255242]/70 shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-2.5 space-y-2.5">
          {/* Instant Live Search Input */}
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-[#8faea1] pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un plat, ingrédient (ex: méchouia, dorade, ojja)..."
              className="w-full bg-[#13362a] text-[#f4eedd] placeholder-[#79998d] text-sm pl-10 pr-9 py-2 rounded-xl border border-[#2c5b4b] focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 p-1 rounded-full text-[#8faea1] hover:text-white transition-colors"
                title="Effacer la recherche"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Tags (All, Fruits de Mer, Signatures, Sur Commande) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
            <button
              onClick={() => setActiveFilterTag('all')}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all font-medium cursor-pointer ${
                activeFilterTag === 'all'
                  ? 'bg-[#c5a059] text-[#0d281e] font-semibold shadow'
                  : 'bg-[#163c30] text-[#cfdfd6] hover:bg-[#1f4e3f]'
              }`}
            >
              Tous les plats ({MENU_ITEMS.length})
            </button>
            <button
              onClick={() => setActiveFilterTag(activeFilterTag === 'fruits_de_mer' ? 'all' : 'fruits_de_mer')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full whitespace-nowrap transition-all font-medium cursor-pointer ${
                activeFilterTag === 'fruits_de_mer'
                  ? 'bg-[#c5a059] text-[#0d281e] font-semibold shadow'
                  : 'bg-[#163c30] text-[#cfdfd6] hover:bg-[#1f4e3f]'
              }`}
            >
              <Fish className="w-3 h-3" />
              Fruits de mer
            </button>
            <button
              onClick={() => setActiveFilterTag(activeFilterTag === 'signature' ? 'all' : 'signature')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full whitespace-nowrap transition-all font-medium cursor-pointer ${
                activeFilterTag === 'signature'
                  ? 'bg-[#c5a059] text-[#0d281e] font-semibold shadow'
                  : 'bg-[#163c30] text-[#cfdfd6] hover:bg-[#1f4e3f]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#dfc38a]" />
              Spécialités
            </button>
            <button
              onClick={() => setActiveFilterTag(activeFilterTag === 'sur_commande' ? 'all' : 'sur_commande')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full whitespace-nowrap transition-all font-medium cursor-pointer ${
                activeFilterTag === 'sur_commande'
                  ? 'bg-[#c5a059] text-[#0d281e] font-semibold shadow'
                  : 'bg-[#163c30] text-[#cfdfd6] hover:bg-[#1f4e3f]'
              }`}
            >
              Sur commande
            </button>
          </div>

          {/* Category Navigation Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5 pb-1 border-t border-[#1b4334]/50">
            <button
              onClick={() => scrollToCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#1e4c3d] text-[#f2e8cf] border border-[#c5a059]/60 font-semibold'
                  : 'text-[#9cbab0] hover:text-white hover:bg-[#153a2f]'
              }`}
            >
              Tout voir
            </button>

            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#1e4c3d] text-[#f6eed9] border border-[#c5a059]/60 font-semibold shadow-sm'
                      : 'text-[#9cbab0] hover:text-white hover:bg-[#153a2f]'
                  }`}
                >
                  {cat.name}
                  {cat.isSpecialCard && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ====================================================================
          MAIN CONTENT AREA (Menu Items rendered with original menu elegance)
          ==================================================================== */}
      <main className="max-w-3xl mx-auto px-4 mt-6 space-y-10">
        {/* Results summary when searching */}
        {searchTerm && (
          <div className="bg-[#13372c] border border-[#2b5e4c] rounded-xl p-3 flex items-center justify-between text-sm">
            <p className="text-[#d8ebd9]">
              Résultats pour &ldquo;<span className="text-[#f5edd8] font-semibold">{searchTerm}</span>&rdquo; :{' '}
              <span className="text-[#c5a059] font-bold">{filteredItems.length}</span> plat(s) trouvé(s)
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-[#9cbeaf] hover:text-white underline cursor-pointer"
            >
              Réinitialiser
            </button>
          </div>
        )}

        {/* If no items match */}
        {groupedCategories.length === 0 && (
          <div className="text-center py-16 px-4 bg-[#0d251d] rounded-2xl border border-[#214a3b] space-y-3">
            <UtensilsCrossed className="w-10 h-10 text-[#688e80] mx-auto" />
            <h3 className="font-cinzel text-lg font-semibold text-[#f1ebd9]">Aucun plat trouvé</h3>
            <p className="text-sm text-[#8faea1] max-w-sm mx-auto">
              Aucun résultat ne correspond à votre recherche. Essayez avec un autre terme ou consultez toutes les catégories.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setActiveFilterTag('all');
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#c5a059] text-[#0d261e] font-semibold text-xs rounded-xl shadow hover:bg-[#d6b36e] transition-colors"
            >
              Voir tout le menu
            </button>
          </div>
        )}

        {/* Categories loop */}
        {groupedCategories.map((group) => {
          const isSurCommande = group.isSpecialCard || group.id === 'sur_commande';

          return (
            <section
              key={group.id}
              id={`section-${group.id}`}
              className="scroll-mt-36"
            >
              {/* Category Header */}
              <div className="flex items-baseline justify-between border-b border-[#2a5a49] pb-2 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c5a059]"></span>
                  <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide text-[#f4eedd]">
                    {group.name} :
                  </h2>
                </div>
                {group.subheading && (
                  <span className="font-garamond italic text-xs sm:text-sm text-[#9dbcb0]">
                    {group.subheading}
                  </span>
                )}
              </div>

              {/* Special Presentation for "Sur commande" (Page 3 styling: Deep emerald showcase card) */}
              {isSurCommande ? (
                <div className="bg-gradient-to-br from-[#0c281e] to-[#12382c] border-2 border-[#c5a059]/60 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#c5a059]/30">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#c5a059]" />
                      <span className="font-cinzel text-sm sm:text-base font-bold uppercase tracking-widest text-[#f5eedb]">
                        Spécialités sur commande
                      </span>
                    </div>
                    <span className="text-[11px] text-[#c5a059] uppercase font-semibold bg-[#071913] px-2.5 py-0.5 rounded border border-[#c5a059]/40">
                      Sur réservation
                    </span>
                  </div>

                  <div className="space-y-4">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-[#081d15]/80 rounded-xl border border-[#285746] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#c5a059]/60 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-lg font-medium text-[#fbf7ee]">
                              {item.name}
                            </h3>
                          </div>
                          {item.description && (
                            <p className="font-garamond italic text-sm text-[#b0ccbf]">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1c4436]">
                          <div className="text-right">
                            <span className="font-cinzel text-lg sm:text-xl font-bold text-[#e8d8b4]">
                              {formatPrice(item.price)}
                            </span>
                            {item.priceUnit && (
                              <span className="block text-[10px] text-[#86a99b]">
                                {item.priceUnit}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => updateOrderQty(item.id, 1)}
                            className="flex items-center gap-1 bg-[#c5a059] hover:bg-[#d6b36e] text-[#0a2018] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow cursor-pointer active:scale-95"
                            title="Ajouter à mes notes de commande"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Ajouter</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Standard Categories: Elegant menu cards with warm parchment text & tactile touch targets */
                <div className="grid grid-cols-1 gap-3">
                  {group.items.map((item) => {
                    const quantity = tableOrder[item.id] || 0;

                    return (
                      <div
                        key={item.id}
                        className="group relative bg-[#123328] hover:bg-[#163c2f] border border-[#234e3f] hover:border-[#c5a059]/50 rounded-xl p-3.5 sm:p-4 transition-all duration-200 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* Item Details */}
                          <div className="flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-garamond text-base sm:text-lg font-semibold tracking-wide text-[#fbf7ee] group-hover:text-[#f8f1de]">
                                {item.name}
                              </h3>

                              {/* Badges */}
                              {item.tags?.includes('signature') && (
                                <span className="inline-flex items-center text-[10px] bg-[#224e3e] text-[#d9c59c] font-medium px-2 py-0.5 rounded border border-[#c5a059]/30">
                                  Signature
                                </span>
                              )}
                              {item.tags?.includes('fruits_de_mer') && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] bg-[#1a473b] text-[#9de0c9] font-medium px-2 py-0.5 rounded">
                                  <Fish className="w-2.5 h-2.5" /> Mer
                                </span>
                              )}
                              {item.tags?.includes('vegetarien') && (
                                <span className="inline-flex items-center text-[10px] bg-[#1b432e] text-[#a4d4b4] font-medium px-2 py-0.5 rounded">
                                  Végétarien
                                </span>
                              )}
                              {item.spicy && (
                                <span className="inline-flex items-center text-[10px] bg-[#3a1d1d] text-[#f5a1a1] font-medium px-1.5 py-0.5 rounded" title="Relevé">
                                  <Flame className="w-2.5 h-2.5 text-red-400" />
                                </span>
                              )}
                            </div>

                            {item.description && (
                              <p className="font-garamond italic text-xs sm:text-sm text-[#97b8ab] leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Price & Quick Add Button */}
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="text-right">
                              <span className="font-cinzel text-base sm:text-lg font-bold text-[#eedfb8] tracking-tight">
                                {formatPrice(item.price)}
                              </span>
                              {item.priceUnit && (
                                <span className="block text-[10px] text-[#7da092]">
                                  {item.priceUnit}
                                </span>
                              )}
                            </div>

                            {/* Quantity Controls / Add button */}
                            {quantity > 0 ? (
                              <div className="flex items-center bg-[#0a2018] rounded-lg border border-[#c5a059]/60 p-0.5">
                                <button
                                  onClick={() => updateOrderQty(item.id, -1)}
                                  className="p-1 hover:bg-[#1c4737] rounded text-[#d6c49e] transition-colors"
                                  title="Diminuer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-2 font-bold text-xs text-[#f5eedb]">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => updateOrderQty(item.id, 1)}
                                  className="p-1 hover:bg-[#1c4737] rounded text-[#d6c49e] transition-colors"
                                  title="Augmenter"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => updateOrderQty(item.id, 1)}
                                className="flex items-center gap-1 bg-[#1a4436] hover:bg-[#c5a059] text-[#e0cfab] hover:text-[#0b2118] px-2.5 py-1 rounded-lg text-xs font-semibold border border-[#c5a059]/40 hover:border-transparent transition-all shadow-sm cursor-pointer active:scale-95"
                                title="Ajouter à mes notes"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Commander</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </main>

      {/* ====================================================================
          FLOATING WAITER ORDER BAR (QR Code scan convenience)
          Allows diners to prepare their order before the waiter comes
          ==================================================================== */}
      {orderCount > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-40">
          <div className="bg-[#0b221a] border-2 border-[#c5a059] rounded-2xl p-3 shadow-2xl flex items-center justify-between backdrop-blur-lg">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 bg-[#c5a059] text-[#0d281e] rounded-xl font-bold">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {orderCount}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#9bbcb0] block">Ma sélection table</span>
                <span className="font-cinzel text-base font-bold text-[#f5eedb]">
                  {orderTotalDT.toFixed(1).replace('.', ',')} DT
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOrderDrawerOpen(true)}
                className="px-4 py-2 bg-[#c5a059] hover:bg-[#d6b36e] text-[#0c241c] text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
              >
                Voir mon récapitulatif
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          TABLE ORDER RECAPITULATIF MODAL / DRAWER
          ==================================================================== */}
      {isOrderDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#0f2d23] border border-[#2b5949] rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 max-h-[85vh] flex flex-col animate-in fade-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#234e3f]">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-[#c5a059]" />
                <h3 className="font-cinzel text-lg font-bold text-[#f5eedb]">
                  Ma commande à table
                </h3>
              </div>
              <button
                onClick={() => setIsOrderDrawerOpen(false)}
                className="p-1 rounded-full text-[#99b9ac] hover:text-white hover:bg-[#1a4435]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-garamond italic text-xs text-[#9dbbb0] my-2">
              Montrez cet écran à votre serveur pour lui transmettre directement vos choix.
            </p>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#1e4839] my-2 pr-1">
              {Object.entries(tableOrder).map(([itemId, qty]) => {
                const item = MENU_ITEMS.find((m) => m.id === itemId);
                if (!item) return null;
                const quantityNum = Number(qty);
                const lineTotal = typeof item.price === 'number' 
                  ? (item.price * quantityNum).toFixed(1).replace('.', ',') + ' DT' 
                  : item.price;

                return (
                  <div key={itemId} className="py-2.5 flex items-center justify-between text-sm">
                    <div className="flex-1 pr-2">
                      <p className="font-medium text-[#f6f0df]">{item.name}</p>
                      <p className="text-xs text-[#8caea0]">{formatPrice(item.price)} l&apos;unité</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-[#071912] rounded-lg border border-[#285746] p-0.5">
                        <button
                          onClick={() => updateOrderQty(item.id, -1)}
                          className="p-1 text-[#d6c49e] hover:bg-[#163c2f] rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-xs text-[#f5eedb]">{qty}</span>
                        <button
                          onClick={() => updateOrderQty(item.id, 1)}
                          className="p-1 text-[#d6c49e] hover:bg-[#163c2f] rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-cinzel font-semibold text-xs text-[#eedfb8] min-w-[50px] text-right">
                        {lineTotal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Calculation */}
            <div className="pt-3 border-t border-[#234e3f] space-y-3">
              <div className="flex items-center justify-between text-base font-bold">
                <span className="text-[#d8ebd9]">Estimation Totale :</span>
                <span className="font-cinzel text-xl text-[#c5a059]">
                  {orderTotalDT.toFixed(1).replace('.', ',')} DT
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setTableOrder({})}
                  className="flex-1 py-2 rounded-xl border border-red-800/60 bg-red-950/40 text-red-300 text-xs font-semibold hover:bg-red-900/40 transition-colors"
                >
                  Vider la sélection
                </button>
                <button
                  onClick={() => setIsOrderDrawerOpen(false)}
                  className="flex-2 py-2 rounded-xl bg-[#c5a059] text-[#0d281e] text-xs font-bold hover:bg-[#d6b36e] transition-colors"
                >
                  Continuer à parcourir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SCROLL TO TOP FLOATING BUTTON
          ==================================================================== */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 p-2.5 rounded-full bg-[#184435] text-[#d6c49e] border border-[#c5a059]/40 shadow-lg hover:bg-[#205543] transition-all cursor-pointer z-30"
          title="Haut de page"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* ====================================================================
          FOOTER WITH RESTAURANT CREDENTIALS & VIBE
          ==================================================================== */}
      <footer className="mt-16 border-t border-[#1b4436] bg-[#091b15] py-10 px-4 text-center text-xs text-[#7f9f92] space-y-4">
        <div className="max-w-md mx-auto space-y-2">
          {/* Logo Mountain icon */}
          <div className="flex justify-center mb-1">
            <svg className="w-10 h-8 text-[#c5a059]/80" viewBox="0 0 100 80" fill="currentColor">
              <polygon points="50,10 70,75 30,75" />
              <polygon points="28,30 45,75 10,75" />
              <polygon points="72,32 92,75 52,75" />
            </svg>
          </div>
          <h4 className="font-cinzel font-bold text-sm tracking-widest text-[#f5eedb] uppercase">
            The Ridge Restaurant
          </h4>
          <p className="font-garamond italic text-[#9dbcb0]">
            Tous nos plats sont élaborés sur place à partir de produits frais du marché tunisien.
          </p>
          <p className="text-[11px] text-[#6d8a7e] pt-2">
            Prix nets en Dinars Tunisiens (DT) • Service et taxes compris
          </p>
        </div>
      </footer>
    </div>
  );
}
