import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search, Clock, MapPin, Phone, Sparkles, UtensilsCrossed, Fish, Flame,
  ChefHat, Share2, Check, X, Plus, Minus, ShoppingBag, ArrowUp, Star, QrCode,
  ClipboardList, Edit3
} from 'lucide-react';

import { QRCodeSVG } from 'qrcode.react';

/* ==========================================================================
   MENU DATA
   ========================================================================== */
export interface MenuItem {
  id: string;
  name: string;
  price: number | string;
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
  { id: 'ef-1', name: 'Salade verte', price: 10, category: 'entrees_froides', description: 'Sélection de crudités fraîches, vinaigrette maison et herbes fines', tags: ['vegetarien'] },
  { id: 'ef-2', name: 'Salade méchouia', price: 12, category: 'entrees_froides', description: 'Poivrons et tomates grillés au feu de bois, ail, huile d\'olive et thon', tags: ['signature'] },
  { id: 'ef-3', name: 'Salade césar', price: 25, category: 'entrees_froides', description: 'Laitue croquante, filet de volaille rôti, copeaux de parmesan et sauce césar' },
  { id: 'ef-4', name: 'Salade fruits de mer', price: 30, category: 'entrees_froides', description: 'Généreux assortiment marin : crevettes, calamars marinés et agrumes', tags: ['fruits_de_mer', 'chef'] },
  { id: 'ec-1', name: 'Brik aux thon', price: 8, category: 'entrees_chaudes', description: 'Feuille de malsouka dorée et croustillante, œuf coulant, thon, persil et câpres', tags: ['signature'] },
  { id: 'ec-2', name: 'Brik aux chevrettes', price: 12, category: 'entrees_chaudes', description: 'Brik croustillante farcie de petites crevettes fraîches assaisonnées', tags: ['fruits_de_mer'] },
  { id: 'ec-3', name: 'Soupe de poisson', price: 15, category: 'entrees_chaudes', description: 'Soupe côtière traditionnelle mijotée aux poissons de roche et épices méditerranéennes', tags: ['fruits_de_mer'] },
  { id: 'ec-4', name: 'Chevrettes sautées à l\'ail', price: 25, category: 'entrees_chaudes', description: 'Crevettes poêlées minute à l\'huile d\'olive vierge, ail doré et piment doux', tags: ['fruits_de_mer', 'chef'] },
  { id: 'oj-1', name: 'Ojja merguez', price: 22, category: 'ojjas', description: 'Sauce tomate mijotée pimentée, œufs pochés et merguez artisanales grillées', tags: ['signature'], spicy: true },
  { id: 'oj-2', name: 'Ojja escalopes', price: 22, category: 'ojjas', description: 'Fondue de tomates, poivrons rouges, œufs et émincé d\'escalope dorée', spicy: true },
  { id: 'oj-3', name: 'Ojja fruits de mer', price: 30, category: 'ojjas', description: 'Traditionnelle poêlée relevée aux calamars, crevettes et herbes fraîches', tags: ['fruits_de_mer', 'chef'], spicy: true },
  { id: 'esc-1', name: 'Escalope grillée', price: 20, category: 'escalopes', description: 'Blanc de volaille saisi à la braise, garniture au choix' },
  { id: 'esc-2', name: 'Escalope panée', price: 23, category: 'escalopes', description: 'Escalope enrobée d\'une chapelure dorée et croustillante, quartiers de citron' },
  { id: 'esc-3', name: 'Escalope à la crème et aux champignons', price: 27, category: 'escalopes', description: 'Nappée d\'une onctueuse réduction de crème fraîche et champignons de Paris', tags: ['chef'] },
  { id: 'esc-4', name: 'Escalope à l\'italienne', price: 30, category: 'escalopes', description: 'Gratinée au four avec sauce à la crème riche, jambon savoureux et fromage fondant', tags: ['signature'] },
  { id: 'pat-1', name: 'Pâtes à la bolognaise', price: 25, category: 'pates', description: 'Mijoté classique de viande hachée, tomates san marzano, ail et basilic' },
  { id: 'pat-2', name: 'Pâtes aux fruits de mer', price: 37, category: 'pates', description: 'Crevettes royales, calamars et moules dans un jus marin parfumé', tags: ['fruits_de_mer', 'signature'] },
  { id: 'pat-3', name: 'Tagliatelles sauce pesto', price: 40, category: 'pates', description: 'Pesto frais au basilic doux, pignons de pin, huile d\'olive et parmesan râpé', tags: ['vegetarien'] },
  { id: 'pat-4', name: 'Tagliatelles aux crevettes épicées', price: 37, category: 'pates', description: 'Tagliatelles fraîches liées d\'une émulsion aux crevettes et piments doux', tags: ['fruits_de_mer'], spicy: true },
  { id: 'pat-5', name: 'Lasagnes à la bolognaise', price: 28, category: 'pates', description: 'Feuilles de pâtes superposées, béchamel veloutée, ragoût de bœuf et fromage doré au four' },
  { id: 'pat-6', name: 'Lasagnes aux fruits de mer', price: 35, category: 'pates', description: 'Création signature du chef : lasagnes garnies de fruits de mer et sauce veloutée', tags: ['fruits_de_mer', 'chef'] },
  { id: 'vr-1', name: 'Filet de bœuf grillé', price: 42, category: 'viandes_rouges', description: 'Pièce noble de bœuf sélectionnée, grillée selon votre cuisson désirée', tags: ['signature'] },
  { id: 'vr-2', name: 'Filet de bœuf à la crème et aux champignons', price: 45, category: 'viandes_rouges', description: 'Filet tendre sublimé par une sauce veloutée aux champignons sauvages', tags: ['chef'] },
  { id: 'vr-3', name: 'Filet de bœuf sauce poivre', price: 48, category: 'viandes_rouges', description: 'Sauce onctueuse montée au poivre de Madagascar concassé et cognac', tags: ['signature'] },
  { id: 'poi-1', name: 'Poisson du jour', price: 'Selon arrivage', priceUnit: 'par 100g', category: 'poissons', description: 'Pêche locale fraîche du matin, préparée entière grillée ou au four', tags: ['fruits_de_mer', 'signature'] },
  { id: 'poi-2', name: 'Daurade grillée', price: 23, category: 'poissons', description: 'Daurade entière cuite à la plancha, herbes fraîches et quartier de citron', tags: ['fruits_de_mer'] },
  { id: 'poi-3', name: 'Loup grillé', price: 27, category: 'poissons', description: 'Loup de mer royal grillé avec filet d\'huile d\'olive et fleur de sel', tags: ['fruits_de_mer'] },
  { id: 'poi-4', name: 'Calamars grillés', price: 35, category: 'poissons', description: 'Calamars frais grillés tendres et caramélisés, assaisonnement provençal', tags: ['fruits_de_mer'] },
  { id: 'poi-5', name: 'Symphonie de fruits de mer (2 pers.)', price: 120, category: 'poissons', description: 'Plateau prestigieux pour 2 personnes : poissons nobles, gambas, calamars et coquillages', tags: ['fruits_de_mer', 'chef', 'signature'] },
  { id: 'sc-1', name: 'Poisson en croûte de sel', price: 'Par gramme ', category: 'sur_commande', description: 'Grand poisson sauvage cuit à l\'étouffée sous une croûte de sel marin préservant tous les sucs', tags: ['sur_commande', 'fruits_de_mer', 'chef'] },
  { id: 'sc-2', name: 'Gigot d\'agneau au four au miel', price: 220, category: 'sur_commande', description: 'Pièce entière rôtie lentement durant 5 heures, laquée au miel de thym et amandes grillées', tags: ['sur_commande', 'chef', 'signature'] },
  { id: 'des-1', name: 'Fondant au chocolat', price: 8, category: 'desserts', description: 'Cœur coulant au chocolat noir 70%, servi tiède', tags: ['signature'] },
  { id: 'des-2', name: 'Sorbet au citron', price: 8, category: 'desserts', description: 'Sorbet artisanal rafraîchissant au citron vert et zeste confit' },
  { id: 'des-3', name: 'Cheesecake', price: 13, category: 'desserts', description: 'Gâteau crémeux new-yorkais sur lit de spéculoos croustillant et coulis de fruits' },
  { id: 'des-4', name: 'Fruits de saison', price: 25, category: 'desserts', description: 'Sélection rafraîchissante de tranches de fruits frais du marché' },
  { id: 'boi-1', name: 'Eau minérale (0,5l)', price: 2.5, category: 'boissons', description: 'Bouteille individuelle 50cl servie fraîche' },
  { id: 'boi-2', name: 'Eau minérale (1l)', price: 4, category: 'boissons', description: 'Bouteille grand format 100cl' },
  { id: 'boi-3', name: 'Eau gazeuse', price: 5, category: 'boissons', description: 'Eau minérale pétillante rafraîchissante' },
  { id: 'boi-4', name: 'Sodas', price: 5, category: 'boissons', description: 'Coca-Cola, Sprite, Fanta, Boga, Tonic' },
  { id: 'boi-5', name: 'Jus frais de saison', price: 8, category: 'boissons', description: 'Pressé minute selon les agrumes et fruits frais du jour', tags: ['signature'] }
];

function formatPrice(val: number | string): string {
  if (typeof val === 'number') {
    const str = val % 1 === 0 ? val.toString() : val.toFixed(1).replace('.', ',');
    return `${str} DT`;
  }
  return val;
}

/* ==========================================================================
   BASE64 UTF-8 HELPERS (safe pour les accents français)
   ========================================================================== */
function encodeBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

function decodeBase64Utf8(str: string): string {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/* ==========================================================================
   TYPES SERVEUR
   ========================================================================== */
interface ServerOrderItem {
  n: string;         // nom du plat
  q: number;         // quantité
  p?: number | null; // prix unitaire (optionnel)
}

interface ServerOrderData {
  d: string;         // date formatée
  i: ServerOrderItem[];
  t: number;         // total en DT
}

/* ==========================================================================
   SERVER VIEW — Vue pour le serveur (scannée depuis le QR code)
   ========================================================================== */
const ServerView: React.FC<{ orderData: ServerOrderData | null }> = ({ orderData }) => {
  const [notes, setNotes] = useState<Record<number, string>>({});

  // Charger les notes sauvegardées
  useEffect(() => {
    if (orderData?.d) {
      try {
        const saved = localStorage.getItem(`ridge_notes_${orderData.d}`);
        if (saved) setNotes(JSON.parse(saved));
      } catch {}
    }
  }, [orderData]);

  // Sauvegarder les notes automatiquement
  useEffect(() => {
    if (orderData?.d && Object.keys(notes).length > 0) {
      try {
        localStorage.setItem(`ridge_notes_${orderData.d}`, JSON.stringify(notes));
      } catch {}
    }
  }, [notes, orderData]);

  // ===== Cas invalide =====
  if (!orderData) {
    return (
      <div className="min-h-screen bg-[#071712] flex items-center justify-center p-4"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-950/40 border border-red-800/60 flex items-center justify-center">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="font-cinzel text-xl font-bold text-[#f5eedb]">Commande invalide</h2>
          <p className="text-sm text-[#89aca0]">
            Le QR code ne contient pas de commande valide. Demandez au client de régénérer le QR code.
          </p>
        </div>
      </div>
    );
  }

  const totalItems = orderData.i.reduce((sum, it) => sum + it.q, 0);
  const hasNotes = Object.values(notes).some((n) => n && n.trim().length > 0);

  return (
    <div
      className="min-h-screen bg-[#071712] text-[#f5f0e3] antialiased pb-10 selection:bg-[#d4af6a]/30"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ==== Styles partagés ==== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-garamond { font-family: 'Cormorant Garamond', serif; }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212, 175, 106, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(212, 175, 106, 0); }
        }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #d4af6a 0%, #f5e6c0 50%, #d4af6a 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ==== Barre supérieure ==== */}
      <header className="w-full border-b border-[#1a3d30]/50 bg-[#050f0b] py-2.5 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af6a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af6a]"></span>
            </span>
            <span className="font-medium text-[#e8d3a0] uppercase tracking-[0.2em] text-[10px]">
              Vue Serveur
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#89aca0]">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>{orderData.d}</span>
          </div>
        </div>
      </header>

      {/* ==== En-tête ===== */}
      <section
        className="relative overflow-hidden pt-8 pb-8 px-4"
        style={{ background: 'radial-gradient(ellipse at top, #0f3628 0%, #071712 60%, #050f0b 100%)' }}
      >
        <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center">
          <div className="mb-3 animate-pulse-glow rounded-full p-1">
            <img
              src="/logo.png"
              alt="The Ridge"
              className="w-16 h-auto object-contain drop-shadow-[0_4px_24px_rgba(212,175,106,0.35)]"
            />
          </div>

          <img
            src="/theridge.png"
            alt="The Ridge"
            className="w-48 sm:w-60 h-auto object-contain drop-shadow-[0_2px_20px_rgba(212,175,106,0.3)]"
          />

          <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-[#1a4033] to-[#235846] border border-[#d4af6a]/40 px-4 py-1.5 rounded-full shadow-lg">
            <ChefHat className="w-3.5 h-3.5 text-[#e8d3a0]" />
            <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] text-[#e8d3a0] font-semibold uppercase">
              Nouvelle Commande
            </span>
          </div>
        </div>
      </section>

      {/* ==== Contenu principal ==== */}
      <main className="max-w-3xl mx-auto px-4 space-y-5">
        {/* Résumé */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0d251c] border border-[#1f4a3b] rounded-xl p-3.5 text-center">
            <span className="text-[10px] text-[#7ea394] uppercase tracking-wider font-semibold block mb-1">
              Articles
            </span>
            <span className="font-cinzel text-2xl font-bold shimmer-text">
              {totalItems}
            </span>
          </div>
          <div className="bg-[#0d251c] border border-[#1f4a3b] rounded-xl p-3.5 text-center">
            <span className="text-[10px] text-[#7ea394] uppercase tracking-wider font-semibold block mb-1">
              Total estimé
            </span>
            <span className="font-cinzel text-2xl font-bold shimmer-text">
              {orderData.t.toFixed(1).replace('.', ',')} DT
            </span>
          </div>
        </div>

        {/* Info note */}
        <div className="bg-gradient-to-r from-[#0f2f24] to-[#163c30] border border-[#1f4a3b] rounded-xl p-3.5 flex items-start gap-2.5">
          <Edit3 className="w-4 h-4 text-[#d4af6a] shrink-0 mt-0.5" />
          <p className="font-garamond italic text-xs text-[#a8c4b8] leading-relaxed">
            Ajoutez une note sous chaque plat (ex: bien cuit, sans oignons, allergies...).
            Les notes sont sauvegardées automatiquement sur cet appareil.
          </p>
        </div>

        {/* Liste des plats avec notes */}
        <div className="space-y-3">
          {orderData.i.map((item, idx) => {
            const lineTotal = item.p != null ? item.p * item.q : null;
            return (
              <div
                key={idx}
                className="bg-[#0d251c] border border-[#1f4a3b] rounded-xl p-4 space-y-3 animate-slide-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-garamond text-lg font-semibold text-[#F2DFBD] leading-tight">
                      {item.n}
                    </h3>
                    {lineTotal != null && (
                      <p className="text-[11px] text-[#7ea394] mt-0.5 font-garamond italic">
                        {formatPrice(item.p as number)} × {item.q} ={' '}
                        <span className="text-[#ecd9ac]">
                          {lineTotal.toFixed(1).replace('.', ',')} DT
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 bg-[#050f0b] border border-[#d4af6a]/40 rounded-xl px-3 py-1.5">
                    <span className="text-[10px] text-[#7ea394] uppercase tracking-wider font-semibold">
                      Qté
                    </span>
                    <span className="font-cinzel text-lg font-bold text-[#d4af6a] leading-none">
                      {item.q}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <Edit3 className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#7ea394] pointer-events-none" />
                  <textarea
                    value={notes[idx] || ''}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [idx]: e.target.value }))}
                    placeholder="Ajouter une note pour ce plat..."
                    rows={2}
                    className="w-full bg-[#050f0b] text-[#f4eedd] placeholder-[#5d8074] text-xs pl-9 pr-3 py-2 rounded-lg border border-[#1f4a3b] focus:outline-none focus:border-[#d4af6a] focus:ring-2 focus:ring-[#d4af6a]/20 transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Total bas */}
        <div className="bg-gradient-to-r from-[#0f2f24] to-[#1a4033] border border-[#d4af6a]/30 rounded-2xl p-5 flex items-center justify-between animate-slide-up">
          <div>
            <span className="text-xs text-[#89aca0] block mb-0.5">Estimation Totale</span>
            <span className="text-[10px] text-[#7ea394] italic font-garamond">
              À confirmer en caisse
            </span>
          </div>
          <span className="font-cinzel text-2xl sm:text-3xl font-bold shimmer-text">
            {orderData.t.toFixed(1).replace('.', ',')} DT
          </span>
        </div>

        {/* Actions */}
        {hasNotes && (
          <button
            onClick={() => {
              if (confirm('Effacer toutes les notes ?')) {
                setNotes({});
                if (orderData?.d) {
                  try { localStorage.removeItem(`ridge_notes_${orderData.d}`); } catch {}
                }
              }
            }}
            className="w-full py-3 rounded-xl border border-red-800/60 bg-red-950/30 text-red-300 text-xs font-semibold hover:bg-red-900/40 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
          >
            <X className="w-3.5 h-3.5" />
            Effacer toutes les notes
          </button>
        )}

        {/* Footer */}
        <div className="pt-6 text-center space-y-1.5">
          <p className="font-garamond italic text-[10px] text-[#6d8a7e]">
            The Ridge Restaurant • Vue réservée au personnel
          </p>
        </div>
      </main>
    </div>
  );
};

/* ==========================================================================
   ANIMATION HOOKS
   ========================================================================== */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      setProgress(total > 0 ? (current / total) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return progress;
}

/* ==========================================================================
   REUSABLE ANIMATED COMPONENTS
   ========================================================================== */
const RevealWrapper: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> =
  ({ children, delay = 0, className = '' }) => {
    const { ref, isVisible } = useScrollReveal();
    return (
      <div
        ref={ref}
        className={className}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        }}
      >
        {children}
      </div>
    );
  };

/* ==========================================================================
   AUTO-SCROLL CATEGORY CAROUSEL
   ========================================================================== */
const CategoryCarousel: React.FC<{
  categories: Category[];
  selectedCategory: string;
  onSelect: (id: string) => void;
}> = ({ categories, selectedCategory, onSelect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number>();
  const scrollPosRef = useRef(0);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const hasInitializedRef = useRef(false);

  const duplicatedCategories = useMemo(
    () => [...categories, ...categories, ...categories],
    [categories]
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const speed = 0.4;

    const animate = () => {
      if (!isPaused && el) {
        scrollPosRef.current += speed;

        const oneSetWidth = el.scrollWidth / 3;

        if (scrollPosRef.current >= oneSetWidth * 2) {
          scrollPosRef.current -= oneSetWidth;
        }
        if (scrollPosRef.current <= 0) {
          scrollPosRef.current += oneSetWidth;
        }

        el.scrollLeft = scrollPosRef.current;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused]);

  const handleScroll = () => {
    if (scrollRef.current) {
      scrollPosRef.current = scrollRef.current.scrollLeft;
    }
  };

  const pauseTemporarily = () => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setIsPaused(false), 3000);
  };

  useEffect(() => {
    if (hasInitializedRef.current) return;
    const el = scrollRef.current;
    if (!el) return;

    const init = () => {
      const oneSetWidth = el.scrollWidth / 3;
      if (oneSetWidth > 0) {
        el.scrollLeft = oneSetWidth;
        scrollPosRef.current = oneSetWidth;
        hasInitializedRef.current = true;
      } else {
        setTimeout(init, 50);
      }
    };
    init();
  }, []);

  return (
    <div className="relative group/carousel">
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#071712] via-[#071712]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#071712] via-[#071712]/80 to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseEnter={pauseTemporarily}
        onMouseLeave={pauseTemporarily}
        onTouchStart={pauseTemporarily}
        onTouchEnd={pauseTemporarily}
        onWheel={pauseTemporarily}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedCategories.map((cat, idx) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={`${cat.id}-${idx}`}
              onClick={() => {
                pauseTemporarily();
                onSelect(cat.id);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#d4af6a] to-[#e8d3a0] text-[#0a1f18] font-semibold shadow-lg shadow-[#d4af6a]/30 scale-105'
                  : 'bg-[#0d251c] text-[#a8c4b8] hover:bg-[#163c30] hover:text-white border border-[#1f4a3b] hover:border-[#d4af6a]/40'
              }`}
            >
              {cat.name}
              {cat.isSpecialCard && (
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? 'bg-[#0a1f18]' : 'bg-[#d4af6a] animate-pulse'
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ==========================================================================
   MAIN APP
   ========================================================================== */
export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFilterTag, setActiveFilterTag] = useState<string>('all');
  const [tableOrder, setTableOrder] = useState<Record<string, number>>({});
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ===== État pour la vue serveur =====
  const [serverOrderData, setServerOrderData] = useState<ServerOrderData | null>(null);
  const [isServerView, setIsServerView] = useState(false);

  const scrollProgress = useScrollProgress();

  // ===== Détection de la vue serveur via l'URL =====
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'server') {
      const orderParam = params.get('order');
      if (orderParam) {
        try {
          const decoded: ServerOrderData = JSON.parse(decodeBase64Utf8(orderParam));
          setServerOrderData(decoded);
        } catch (e) {
          console.error('QR code invalide :', e);
          setServerOrderData(null);
        }
      } else {
        setServerOrderData(null);
      }
      setIsServerView(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isOrderDrawerOpen) setShowQRCode(false);
  }, [isOrderDrawerOpen]);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (activeFilterTag === 'fruits_de_mer' && !item.tags?.includes('fruits_de_mer')) return false;
      if (activeFilterTag === 'signature' && !item.tags?.includes('signature')) return false;
      if (activeFilterTag === 'sur_commande' && item.category !== 'sur_commande' && !item.tags?.includes('sur_commande')) return false;
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

  const groupedCategories = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      items: filteredItems.filter((i) => i.category === cat.id),
    })).filter((catGroup) => catGroup.items.length > 0);
  }, [filteredItems]);

  const orderCount = useMemo(() => Object.values(tableOrder).reduce((a, b) => a + b, 0), [tableOrder]);
  const orderTotalDT = useMemo(() => {
    return Object.entries(tableOrder).reduce((sum, [itemId, qty]) => {
      const it = MENU_ITEMS.find((m) => m.id === itemId);
      if (it && typeof it.price === 'number') return sum + it.price * Number(qty);
      return sum;
    }, 0);
  }, [tableOrder]);

  // ===== Texte lisible pour l'affichage sous le QR =====
  const orderTextPayload = useMemo(() => {
    if (orderCount === 0) return '';
    const lines: string[] = [];
    lines.push('=== THE RIDGE ===');
    lines.push(`Date: ${new Date().toLocaleString('fr-FR')}`);
    lines.push('-----------------');
    Object.entries(tableOrder).forEach(([itemId, qty]) => {
      const item = MENU_ITEMS.find((m) => m.id === itemId);
      if (item) lines.push(`${qty}x ${item.name}`);
    });
    lines.push('-----------------');
    lines.push(`TOTAL: ${orderTotalDT.toFixed(1).replace('.', ',')} DT`);
    lines.push(`Articles: ${orderCount}`);
    return lines.join('\n');
  }, [tableOrder, orderCount, orderTotalDT]);

  // ===== URL encodée dans le QR code (contient toute la commande) =====
  const qrValue = useMemo(() => {
    if (orderCount === 0) return '';
    const payload: ServerOrderData = {
      d: new Date().toLocaleString('fr-FR'),
      i: Object.entries(tableOrder).map(([itemId, qty]) => {
        const item = MENU_ITEMS.find((m) => m.id === itemId);
        return {
          n: item?.name || 'Article',
          q: Number(qty),
          p: item && typeof item.price === 'number' ? item.price : null,
        };
      }),
      t: orderTotalDT,
    };
    const encoded = encodeBase64Utf8(JSON.stringify(payload));
    const base = `${window.location.origin}${window.location.pathname}`;
    return `${base}?view=server&order=${encoded}`;
  }, [tableOrder, orderCount, orderTotalDT]);

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
          title: 'The Ridge Restaurant - Menu',
          text: 'Découvrez la carte de The Ridge Restaurant',
          url: window.location.href,
        });
        return;
      } catch {}
    }
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const scrollToCategory = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(`section-${catId}`);
    if (elem) {
      const offsetPosition = elem.getBoundingClientRect().top + window.pageYOffset - 150;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  /* ==========================================================================
     CONDITIONAL RENDER : Vue Serveur
     ========================================================================== */
  if (isServerView) {
    return <ServerView orderData={serverOrderData} />;
  }

  /* ==========================================================================
     RENDU PRINCIPAL (client)
     ========================================================================== */
  return (
    <div className="min-h-screen bg-[#071712] text-[#f5f0e3] antialiased pb-32 overflow-x-hidden selection:bg-[#d4af6a]/30 selection:text-[#f5f0e3]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-garamond { font-family: 'Cormorant Garamond', serif; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(212, 175, 106, 0.4); } 50% { box-shadow: 0 0 0 8px rgba(212, 175, 106, 0); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes gradient-shift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .shimmer-text { background: linear-gradient(90deg, #d4af6a 0%, #f5e6c0 50%, #d4af6a 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass { background: rgba(12, 40, 30, 0.6); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .card-glow { position: relative; transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        .card-glow::before { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px; background: linear-gradient(135deg, rgba(212, 175, 106, 0) 0%, rgba(212, 175, 106, 0.5) 50%, rgba(212, 175, 106, 0) 100%); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0; transition: opacity 0.4s; pointer-events: none; }
        .card-glow:hover::before { opacity: 1; }
        .card-glow:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(212, 175, 106, 0.15); }
        .gradient-border { background: linear-gradient(135deg, rgba(212, 175, 106, 0.4), rgba(212, 175, 106, 0.05), rgba(212, 175, 106, 0.4)); background-size: 200% 200%; animation: gradient-shift 4s ease infinite; }
      `}</style>

      {/* SCROLL PROGRESS */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-transparent">
        <div className="h-full bg-gradient-to-r from-[#d4af6a] via-[#f5e6c0] to-[#d4af6a] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%`, boxShadow: '0 0 12px rgba(212, 175, 106, 0.6)' }} />
      </div>

      {/* TOP BAR */}
      <header className={`w-full border-b border-[#1a3d30]/50 py-2.5 px-4 text-xs transition-all duration-300 ${isScrolled ? 'glass' : 'bg-[#050f0b]'}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-medium text-emerald-300 uppercase tracking-[0.2em] text-[10px]">Ouvert</span>
            <span className="text-[#5d8074] hidden sm:inline">•</span>
            <span className="text-[#9bb5aa] hidden sm:inline text-[11px]">12h00 — 23h30</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleShare}
              className="flex items-center gap-1.5 text-[#c9b585] hover:text-white transition-all duration-200 cursor-pointer text-[11px] hover:scale-105">
              {copiedLink ? (<><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copié !</span></>) : (<><Share2 className="w-3.5 h-3.5" /><span>Partager</span></>)}
            </button>
            <a href="tel:+21671000000"
              className="flex items-center gap-1 bg-gradient-to-r from-[#1a4033] to-[#235846] hover:from-[#235846] hover:to-[#2d6b55] text-[#e8d3a0] px-3 py-1 rounded-full border border-[#d4af6a]/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#d4af6a]/20">
              <Phone className="w-3 h-3" />
              <span className="text-[11px] font-medium">Réserver</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pt-12 pb-14 px-4"
        style={{ background: 'radial-gradient(ellipse at top, #0f3628 0%, #071712 60%, #050f0b 100%)' }}>
        <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-[#d4af6a]/5 blur-3xl pointer-events-none animate-float" />
        <div className="absolute bottom-10 right-1/4 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: `radial-gradient(#d4af6a 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

        <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center">
          <div className="mb-4 animate-float">
            <img src="/logo.png" alt="Logo The Ridge" className="w-28 h-auto object-contain drop-shadow-[0_4px_24px_rgba(212,175,106,0.35)]" />
          </div>
          <div className="relative inline-block mb-4 flex flex-col items-center">
            <img src="/theridge.png" alt="The Ridge" className="w-64 sm:w-80 md:w-96 h-auto object-contain drop-shadow-[0_2px_20px_rgba(212,175,106,0.3)]" />
            <div className="mt-2 inline-block bg-gradient-to-r from-[#0f2f24] via-[#1a4033] to-[#0f2f24] border border-[#d4af6a]/40 px-7 py-1 rounded-full shadow-lg shadow-black/30">
              <p className="font-cinzel text-xs sm:text-sm tracking-[0.4em] text-[#e8d3a0] font-semibold uppercase">Restaurant</p>
            </div>
          </div>
          <p className="font-garamond italic text-[#a8c4b8] text-[10px] sm:text-sm md:text-lg mt-2 mb-7 leading-relaxed whitespace-nowrap px-2">
            Gastronomie méditerranéenne &amp; spécialités terre-mer au cœur des hauteurs
          </p>
        </div>
      </section>

      {/* STICKY NAV */}
      <div className={`sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'glass border-b border-[#1a3d30]/70 shadow-2xl shadow-black/30' : 'bg-[#071712]/95 border-b border-[#1a3d30]/40'}`}>
        <div className="max-w-4xl mx-auto px-4 py-3 space-y-3">
          <div className="relative flex items-center group">
            <Search className="absolute left-3.5 w-4 h-4 text-[#7ea394] pointer-events-none transition-colors group-focus-within:text-[#d4af6a]" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un plat, ingrédient (ex: méchouia, dorade, ojja)..."
              className="w-full bg-[#0d251c] text-[#f4eedd] placeholder-[#5d8074] text-sm pl-10 pr-9 py-2.5 rounded-xl border border-[#1f4a3b] focus:outline-none focus:border-[#d4af6a] focus:ring-2 focus:ring-[#d4af6a]/20 transition-all duration-300 focus:bg-[#0f2a20]" />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 p-1 rounded-full text-[#7ea394] hover:text-white hover:bg-[#1a4033] transition-all duration-200">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-xs">
            {[
              { id: 'all', label: `Tous`, icon: null },
              { id: 'fruits_de_mer', label: 'Fruits de mer', icon: Fish },
              { id: 'signature', label: 'Spécialités', icon: Sparkles },
              { id: 'sur_commande', label: 'Sur commande', icon: Star },
            ].map(({ id, label, icon: Icon }) => {
              const active = activeFilterTag === id;
              return (
                <button key={id} onClick={() => setActiveFilterTag(active && id !== 'all' ? 'all' : id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 font-medium cursor-pointer ${active ? 'bg-gradient-to-r from-[#d4af6a] to-[#e8d3a0] text-[#0a1f18] font-semibold shadow-lg shadow-[#d4af6a]/30 scale-105' : 'bg-[#0d251c] text-[#a8c4b8] hover:bg-[#163c30] hover:text-white border border-[#1f4a3b]'}`}>
                  {Icon && <Icon className="w-3 h-3" />}
                  {label}
                </button>
              );
            })}
          </div>

          <div className="pt-1 border-t border-[#1a3d30]/50">
            <CategoryCarousel categories={CATEGORIES} selectedCategory={selectedCategory} onSelect={scrollToCategory} />
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-12">
        {searchTerm && (
          <RevealWrapper>
            <div className="bg-gradient-to-r from-[#0f2f24] to-[#163c30] border border-[#1f4a3b] rounded-xl p-3.5 flex items-center justify-between text-sm">
              <p className="text-[#d8ebd9]">Résultats pour «<span className="text-[#f5edd8] font-semibold">{searchTerm}</span>» : <span className="text-[#d4af6a] font-bold">{filteredItems.length}</span> plat(s)</p>
              <button onClick={() => setSearchTerm('')} className="text-xs text-[#9cbeaf] hover:text-white underline transition-colors">Réinitialiser</button>
            </div>
          </RevealWrapper>
        )}

        {groupedCategories.length === 0 && (
          <RevealWrapper>
            <div className="text-center py-16 px-4 bg-[#0d251d] rounded-2xl border border-[#1f4a3b] space-y-3">
              <UtensilsCrossed className="w-12 h-12 text-[#5d8074] mx-auto animate-float" />
              <h3 className="font-cinzel text-lg font-semibold text-[#f1ebd9]">Aucun plat trouvé</h3>
              <p className="text-sm text-[#89aca0] max-w-sm mx-auto">Aucun résultat ne correspond à votre recherche.</p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setActiveFilterTag('all'); }}
                className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#d4af6a] to-[#e8d3a0] text-[#0a1f18] font-semibold text-xs rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                Voir tout le menu
              </button>
            </div>
          </RevealWrapper>
        )}

        {groupedCategories.map((group, groupIndex) => {
          const isSurCommande = group.isSpecialCard || group.id === 'sur_commande';
          return (
            <RevealWrapper key={group.id} delay={groupIndex * 50}>
              <section id={`section-${group.id}`} className="scroll-mt-40">
                <div className="flex items-baseline justify-between border-b border-[#1f4a3b] pb-3 mb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#d4af6a] shadow-[0_0_12px_rgba(212,175,106,0.8)]"></span>
                    <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide text-[#f4eedd]">{group.name}</h2>
                  </div>
                  {group.subheading && <span className="font-garamond italic text-xs sm:text-sm text-[#89aca0]">{group.subheading}</span>}
                </div>

                {isSurCommande ? (
                  <div className="relative rounded-2xl p-[1px] gradient-border overflow-hidden">
                    <div className="bg-gradient-to-br from-[#0a1f18] to-[#0f2f24] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#d4af6a]/20">
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-5 h-5 text-[#d4af6a] animate-pulse" />
                          <span className="font-cinzel text-sm sm:text-base font-bold uppercase tracking-widest text-[#f5eedb]">Spécialités sur commande</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {group.items.map((item, i) => (
                          <div key={item.id} className="p-4 bg-[#071712]/80 rounded-xl border border-[#1f4a3b] flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-glow animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="space-y-1 flex-1">
                              <h3 className="font-garamond text-lg font-semibold text-[#fbf7ee]">{item.name}</h3>
                              {item.description && <p className="font-garamond italic text-sm text-[#a8c4b8]">{item.description}</p>}
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1a3d30]">
                              <div className="text-right">
                                <span className="font-cinzel text-lg sm:text-xl font-bold shimmer-text">{formatPrice(item.price)}</span>
                                {item.priceUnit && <span className="block text-[10px] text-[#7ea394]">{item.priceUnit}</span>}
                              </div>
                              <button onClick={() => updateOrderQty(item.id, 1)}
                                className="flex items-center gap-1.5 bg-gradient-to-r from-[#d4af6a] to-[#e8d3a0] hover:shadow-xl hover:shadow-[#d4af6a]/30 hover:scale-105 text-[#0a2018] px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95">
                                <Plus className="w-3.5 h-3.5" />
                                <span>Ajouter</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {group.items.map((item, i) => {
                      const quantity = tableOrder[item.id] || 0;
                      return (
                        <div key={item.id} className="group relative bg-[#0d251c] hover:bg-[#122e23] border border-[#1f4a3b] rounded-xl p-4 card-glow animate-slide-up" style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-cinzel-name text-base sm:text-lg font-bold tracking-wide text-[#F2DFBD] transition-colors group-hover:text-[#fff9e6]">{item.name}</h3>
                                {item.tags?.includes('signature') && (
                                  <span className="inline-flex items-center text-[10px] bg-gradient-to-r from-[#2a5f4d] to-[#1e4c3d] text-[#e8d3a0] font-medium px-2 py-0.5 rounded-full border border-[#d4af6a]/30">✦ Signature</span>
                                )}
                                {item.tags?.includes('fruits_de_mer') && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] bg-[#0f3a30] text-[#9de0c9] font-medium px-2 py-0.5 rounded-full"><Fish className="w-2.5 h-2.5" /> Mer</span>
                                )}
                                {item.tags?.includes('vegetarien') && (
                                  <span className="inline-flex items-center text-[10px] bg-[#0f3628] text-[#a4d4b4] font-medium px-2 py-0.5 rounded-full">Végé</span>
                                )}
                                {item.spicy && (
                                  <span className="inline-flex items-center text-[10px] bg-[#3a1d1d] text-[#f5a1a1] font-medium px-1.5 py-0.5 rounded-full"><Flame className="w-2.5 h-2.5 text-red-400" /></span>
                                )}
                              </div>
                              {item.description && <p className="font-garamond italic text-xs sm:text-sm text-[#8fb0a3] leading-relaxed">{item.description}</p>}
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <div className="text-right">
                                <span className="font-cinzel text-base sm:text-lg font-bold text-[#ecd9ac] tracking-tight">{formatPrice(item.price)}</span>
                                {item.priceUnit && <span className="block text-[10px] text-[#7ea394]">{item.priceUnit}</span>}
                              </div>
                              {quantity > 0 ? (
                                <div className="flex items-center bg-[#050f0b] rounded-xl border border-[#d4af6a]/60 p-0.5 animate-scale-in">
                                  <button onClick={() => updateOrderQty(item.id, -1)} className="p-1.5 hover:bg-[#1c4737] rounded-lg text-[#d4af6a] transition-colors active:scale-90"><Minus className="w-3.5 h-3.5" /></button>
                                  <span className="px-2.5 font-bold text-xs text-[#f5eedb] min-w-[24px] text-center">{quantity}</span>
                                  <button onClick={() => updateOrderQty(item.id, 1)} className="p-1.5 hover:bg-[#1c4737] rounded-lg text-[#d4af6a] transition-colors active:scale-90"><Plus className="w-3.5 h-3.5" /></button>
                                </div>
                              ) : (
                                <button onClick={() => updateOrderQty(item.id, 1)}
                                  className="flex items-center gap-1 bg-[#1a4033] hover:bg-gradient-to-r hover:from-[#d4af6a] hover:to-[#e8d3a0] text-[#e0cfab] hover:text-[#0b2118] px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#d4af6a]/30 hover:border-transparent transition-all duration-300 shadow-sm cursor-pointer active:scale-95">
                                  <Plus className="w-3 h-3" /><span>Commander</span>
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
            </RevealWrapper>
          );
        })}
      </main>

      {/* FLOATING ORDER BAR */}
      {orderCount > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-40 animate-slide-up">
          <div className="bg-[#0a1f18]/95 border border-[#d4af6a]/60 rounded-2xl p-3 shadow-2xl shadow-black/60 flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 bg-gradient-to-br from-[#d4af6a] to-[#e8d3a0] text-[#0d281e] rounded-xl font-bold shadow-lg animate-pulse-glow">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-scale-in">{orderCount}</span>
              </div>
              <div>
                <span className="text-xs text-[#89aca0] block">Ma sélection</span>
                <span className="font-cinzel text-base font-bold text-[#f5eedb]">{orderTotalDT.toFixed(1).replace('.', ',')} DT</span>
              </div>
            </div>
            <button onClick={() => setIsOrderDrawerOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#d4af6a] to-[#e8d3a0] hover:shadow-xl hover:shadow-[#d4af6a]/40 hover:scale-105 text-[#0c241c] text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer">
              Voir le récap
            </button>
          </div>
        </div>
      )}

      {/* ORDER DRAWER */}
      {isOrderDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-slide-up"
          onClick={() => setIsOrderDrawerOpen(false)}>
          <div className="w-full max-w-md bg-[#0d251c] border border-[#1f4a3b] rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 max-h-[85vh] flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-[#1f4a3b]">
              <div className="flex items-center gap-2.5">
                {showQRCode ? <QrCode className="w-5 h-5 text-[#d4af6a]" /> : <UtensilsCrossed className="w-5 h-5 text-[#d4af6a]" />}
                <h3 className="font-cinzel text-lg font-bold text-[#f5eedb]">{showQRCode ? 'QR Code de commande' : 'Ma commande'}</h3>
              </div>
              <button onClick={() => setIsOrderDrawerOpen(false)} className="p-1.5 rounded-full text-[#89aca0] hover:text-white hover:bg-[#1a4033] transition-all duration-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {showQRCode ? (
              <div className="flex-1 overflow-y-auto no-scrollbar py-4 flex flex-col items-center">
                <p className="font-garamond italic text-xs text-[#89aca0] text-center mb-4 px-2">
                  Présentez ce QR Code au serveur pour valider votre commande.
                </p>

                <div className="bg-white p-3 rounded-2xl shadow-2xl shadow-black/40 animate-scale-in">
                  <QRCodeSVG value={qrValue} size={220} bgColor="#ffffff" fgColor="#0a1f18" level="L" includeMargin={false} />
                </div>

                <div className="w-full mt-5 bg-[#071712] border border-[#1f4a3b] rounded-xl p-3.5">
                  <p className="text-[10px] text-[#7ea394] uppercase tracking-wider font-semibold mb-2 text-center">Détail de la commande</p>
                  <pre className="font-garamond text-xs text-[#d8ebd9] whitespace-pre-wrap leading-relaxed text-center">{orderTextPayload}</pre>
                </div>
              </div>
            ) : (
              <>
                <p className="font-garamond italic text-xs text-[#89aca0] my-3">Montrez cet écran à votre serveur pour transmettre vos choix.</p>
                <div className="flex-1 overflow-y-auto divide-y divide-[#1a3d30] my-2 pr-1 no-scrollbar">
                  {Object.entries(tableOrder).map(([itemId, qty]) => {
                    const item = MENU_ITEMS.find((m) => m.id === itemId);
                    if (!item) return null;
                    const qNum = Number(qty);
                    const lineTotal = typeof item.price === 'number'
                      ? (item.price * qNum).toFixed(1).replace('.', ',') + ' DT'
                      : item.price;
                    return (
                      <div key={itemId} className="py-3 flex items-center justify-between text-sm animate-slide-up">
                        <div className="flex-1 pr-2">
                          <p className="font-medium text-[#f6f0df]">{item.name}</p>
                          <p className="text-xs text-[#89aca0]">{formatPrice(item.price)} l&apos;unité</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-[#050f0b] rounded-lg border border-[#1f4a3b] p-0.5">
                            <button onClick={() => updateOrderQty(item.id, -1)} className="p-1 text-[#d4af6a] hover:bg-[#163c2f] rounded transition-colors active:scale-90"><Minus className="w-3 h-3" /></button>
                            <span className="px-2.5 font-bold text-xs text-[#f5eedb]">{qty}</span>
                            <button onClick={() => updateOrderQty(item.id, 1)} className="p-1 text-[#d4af6a] hover:bg-[#163c2f] rounded transition-colors active:scale-90"><Plus className="w-3 h-3" /></button>
                          </div>
                          <span className="font-cinzel font-semibold text-xs text-[#ecd9ac] min-w-[55px] text-right">{lineTotal}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div className="pt-4 border-t border-[#1f4a3b] space-y-3">
        {/* ==== Total ==== */}
        <div className="flex items-center justify-between text-base font-bold">
          <span className="text-[#d8ebd9]">Estimation Totale :</span>
          <span className="font-cinzel text-xl shimmer-text">
            {orderTotalDT.toFixed(1).replace('.', ',')} DT
          </span>
        </div>

        {/* ==== 3 boutons sur une ligne (design compact avec icône au-dessus) ==== */}
        <div className="grid grid-cols-3 gap-2">

          {/* Vider */}
          <button
            onClick={() => { setTableOrder({}); setShowQRCode(false); }}
            className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl border border-red-800/60 bg-red-950/30 text-red-300 text-[11px] font-semibold hover:bg-red-900/40 hover:border-red-700 transition-all duration-300 active:scale-95"
          >
            <X className="w-4 h-4" />
            <span>Vider</span>
          </button>

          {/* QR Code / Retour */}
          {!showQRCode ? (
            <button
              onClick={() => setShowQRCode(true)}
              disabled={orderCount === 0}
              className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-gradient-to-br from-[#1a4033] to-[#235846] border border-[#d4af6a]/50 text-[#e8d3a0] text-[11px] font-bold hover:from-[#235846] hover:to-[#2d6b55] hover:shadow-lg hover:shadow-[#d4af6a]/20 transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <QrCode className="w-4 h-4" />
              <span>QR Code</span>
            </button>
          ) : (
            <button
              onClick={() => setShowQRCode(false)}
              className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-[#1a4033] border border-[#d4af6a]/50 text-[#e8d3a0] text-[11px] font-bold hover:bg-[#235846] transition-all duration-300 active:scale-95"
            >
              <ArrowUp className="w-4 h-4 rotate-[-90deg]" />
              <span>Retour</span>
            </button>
          )}

          {/* Continuer */}
          <button
            onClick={() => setIsOrderDrawerOpen(false)}
            className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-gradient-to-br from-[#d4af6a] to-[#e8d3a0] text-[#0d281e] text-[11px] font-bold hover:shadow-lg hover:shadow-[#d4af6a]/40 transition-all duration-300 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Continuer</span>
          </button>
        </div>
      </div>
          </div>
        </div>
      )}

      {/* SCROLL TO TOP */}
      {showScrollTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-4 p-3 rounded-full bg-[#184435] text-[#d4af6a] border border-[#d4af6a]/40 shadow-lg hover:bg-[#205543] hover:scale-110 transition-all duration-300 cursor-pointer z-30 animate-scale-in"
          title="Haut de page">
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* FOOTER */}
      <footer className="mt-20 border-t border-[#1a3d30] bg-gradient-to-b from-[#050f0b] to-[#071712] py-12 px-4 text-center text-xs text-[#7f9f92] space-y-4">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex justify-center mb-2">
            <img src="/logo.png" alt="Logo The Ridge" className="w-11 h-auto object-contain opacity-70 animate-float" />
          </div>
          <img src="/theridge.png" alt="The Ridge Restaurant" className="w-25 sm:w-30 h-auto object-contain mx-auto opacity-90" />
          <p className="font-garamond italic text-[#9dbcb0] text-sm">
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