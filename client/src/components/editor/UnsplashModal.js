"use client";

import axios from "axios";
import {
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

// Curated stock Unsplash images to fall back on if API key is not configured
const CURATED_CATEGORIES = {
  Technology: [
    {
      id: "tech-1",
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=75",
      alt: "Microchip on motherboard close up",
      author: "Johannes Plenio",
      authorLink: "https://unsplash.com/@jplenio",
    },
    {
      id: "tech-2",
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=75",
      alt: "Macbook on desk with code editor",
      author: "Christopher Gower",
      authorLink: "https://unsplash.com/@cgower",
    },
    {
      id: "tech-3",
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=75",
      alt: "Server rack security network cyber hardware",
      author: "Manuel Geissinger",
      authorLink: "https://unsplash.com/@scilip",
    },
    {
      id: "tech-4",
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=75",
      alt: "Green binary code overlay on black screen",
      author: "Markus Spiske",
      authorLink: "https://unsplash.com/@markusspiske",
    },
    {
      id: "tech-5",
      url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=75",
      alt: "Modern minimalist workspace layout",
      author: "Alexandre Debiève",
      authorLink: "https://unsplash.com/@alexandre_debieve",
    },
    {
      id: "tech-6",
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=75",
      alt: "Laptop coding showing HTML",
      author: "Emile Perron",
      authorLink: "https://unsplash.com/@emileperron",
    },
  ],
  Nature: [
    {
      id: "nature-1",
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=75",
      alt: "Mountain landscape hills background",
      author: "Kal Visuals",
      authorLink: "https://unsplash.com/@kalvisuals",
    },
    {
      id: "nature-2",
      url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=75",
      alt: "Forest path trees foliage sunrays",
      author: "Lukasz Szmigiel",
      authorLink: "https://unsplash.com/@szmigieldesign",
    },
    {
      id: "nature-3",
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=75",
      alt: "Foggy green hills scenic mist landscape",
      author: "v2osk",
      authorLink: "https://unsplash.com/@v2osk",
    },
    {
      id: "nature-4",
      url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=75",
      alt: "Aerial shot of green landscape hills mountains",
      author: "Sven-Erik Arndt",
      authorLink: "https://unsplash.com/@sven_erik",
    },
    {
      id: "nature-5",
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=75",
      alt: "Sunlight filtering through trees forest",
      author: "Sebastian Unrau",
      authorLink: "https://unsplash.com/@sebastian_unrau",
    },
  ],
  Productivity: [
    {
      id: "prod-1",
      url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=75",
      alt: "Paper calendar notebook desk glasses layout",
      author: "Boba Jovanovic",
      authorLink: "https://unsplash.com/@bobajovanovic",
    },
    {
      id: "prod-2",
      url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=75",
      alt: "To do checklist notebook pen glasses desk",
      author: "Glenn Carstens-Peters",
      authorLink: "https://unsplash.com/@glenncarstenspeters",
    },
    {
      id: "prod-3",
      url: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=75",
      alt: "Notebook and coffee cup on table layout",
      author: "Jena Backus",
      authorLink: "https://unsplash.com/@jenabackus",
    },
    {
      id: "prod-4",
      url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=75",
      alt: "Desk with charts documents computer keyboard writing analyst",
      author: "Campaign Creators",
      authorLink: "https://unsplash.com/@campaign_creators",
    },
    {
      id: "prod-5",
      url: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&auto=format&fit=crop&q=75",
      alt: "Minimal laptop desk coffee journal work",
      author: "Anete Lūsiņa",
      authorLink: "https://unsplash.com/@anetelusina",
    },
    {
      id: "prod-6",
      url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=75",
      alt: "Notebook with sticky notes wireframes brainstorming",
      author: "Kelly Sikkema",
      authorLink: "https://unsplash.com/@kellysikkema",
    },
  ],
  Design: [
    {
      id: "design-1",
      url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=75",
      alt: "UI UX mockups sketching website wireframes layout",
      author: "Hal Gatewood",
      authorLink: "https://unsplash.com/@halgatewood",
    },
    {
      id: "design-2",
      url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=75",
      alt: "Abstract colorful splash art design",
      author: "Alice Dietrich",
      authorLink: "https://unsplash.com/@alicedietrich",
    },
    {
      id: "design-3",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=75",
      alt: "Elegant modern abstract fluid art wave pattern background",
      author: "Milad Fakurian",
      authorLink: "https://unsplash.com/@fakurian",
    },
    {
      id: "design-4",
      url: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=75",
      alt: "Clean minimal designer desk tools drawing layout",
      author: "Balázs Kétyi",
      authorLink: "https://unsplash.com/@balazsketyi",
    },
  ],
  Travel: [
    {
      id: "travel-1",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=75",
      alt: "Boats docked on scenic turquoise lake hills mountains",
      author: "Pietro De Grandi",
      authorLink: "https://unsplash.com/@pietro_de_grandi",
    },
    {
      id: "travel-2",
      url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=75",
      alt: "Retro map adventure sunglasses passport travel preparation layout",
      author: "Natalie_B",
      authorLink: "https://unsplash.com/@natalie_b",
    },
    {
      id: "travel-3",
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=75",
      alt: "Wooden boat cruising down scenic river forest hills background",
      author: "Dino Reichmuth",
      authorLink: "https://unsplash.com/@dinoreichmuth",
    },
    {
      id: "travel-4",
      url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&auto=format&fit=crop&q=75",
      alt: "Van driving on highway scenic forest highway road trip",
      author: "Dino Reichmuth",
      authorLink: "https://unsplash.com/@dinoreichmuth",
    },
    {
      id: "travel-5",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=75",
      alt: "Sandy tropical beach background",
      author: "Sean Oulashin",
      authorLink: "https://unsplash.com/@oulashin",
    },
    {
      id: "travel-6",
      url: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&auto=format&fit=crop&q=75",
      alt: "Airplane wing flying in sky above clouds sunset",
      author: "Suhyeon Choi",
      authorLink: "https://unsplash.com/@suhyeon_choi",
    },
  ],
};

export default function UnsplashModal({ isOpen, onClose, onSelectImage }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Technology");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || "";
  const isKeyConfigured = !!apiKey.trim();

  // Load curated default category images on mount or when category tab changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setImages(CURATED_CATEGORIES[activeTab] || []);
      setError("");
    }
  }, [activeTab, searchQuery]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setImages(CURATED_CATEGORIES[activeTab] || []);
      setError("");
      return;
    }

    if (!isKeyConfigured) {
      // Keyless search warning & filtering fallback curated photos
      setError(
        "Unsplash API Key is not configured. Searching local curated collection instead.",
      );
      const allCurated = Object.values(CURATED_CATEGORIES).flat();
      const filtered = allCurated.filter((img) =>
        img.alt.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setImages(filtered);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "https://api.unsplash.com/search/photos",
        {
          params: {
            query: searchQuery,
            per_page: 12,
          },
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
        },
      );

      if (response.data?.results) {
        const parsedResults = response.data.results.map((img) => ({
          id: img.id,
          url: img.urls.regular,
          alt: img.alt_description || img.description || "Unsplash Photo",
          author: img.user.name,
          authorLink: img.user.links.html,
        }));
        setImages(parsedResults);
        if (parsedResults.length === 0) {
          setError("No results found for your search term.");
        }
      }
    } catch (err) {
      console.error("Unsplash Search Error:", err);
      setError(
        "Failed to fetch search results. Check your API access key or network.",
      );
      // Fallback to searching all curated items
      const allCurated = Object.values(CURATED_CATEGORIES).flat();
      const filtered = allCurated.filter((img) =>
        img.alt.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setImages(filtered);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setImages(CURATED_CATEGORIES[activeTab] || []);
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                Search Unsplash
              </h3>
              <p className="text-xs text-gray-500">
                Insert high-definition stock photos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Banner Alert if Key is missing */}
        {!isKeyConfigured && (
          <div className="bg-amber-50/80 border-b border-amber-100/60 px-6 py-3 text-xs text-amber-800 flex items-start gap-2.5 flex-shrink-0">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Demo Library Mode</p>
              <p className="text-amber-700/90 mt-0.5">
                Using built-in curated collections. To unlock unlimited search,
                add{" "}
                <code className="bg-amber-100 px-1 py-0.5 rounded text-[10px] font-mono">
                  NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
                </code>{" "}
                to your client's{" "}
                <code className="bg-amber-100 px-1 py-0.5 rounded text-[10px] font-mono">
                  .env.local
                </code>
                .
              </p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="p-6 pb-4 flex-shrink-0">
          <form onSubmit={handleSearch} className="flex gap-2 relative">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={
                  isKeyConfigured
                    ? "Search high-res photos..."
                    : "Filter curated images..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm pl-10 pr-10 border border-gray-200 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-0.5 rounded-full hover:bg-gray-150 transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 bg-black text-white hover:bg-neutral-800 active:scale-95 disabled:bg-neutral-200 disabled:text-neutral-500 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </button>
          </form>
        </div>

        {/* Category Tabs (only shown if not actively searching or key is missing) */}
        {(!searchQuery || !isKeyConfigured) && (
          <div className="px-6 pb-3 border-b border-gray-100 flex gap-1.5 overflow-x-auto flex-shrink-0 scrollbar-none">
            {Object.keys(CURATED_CATEGORIES).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab(tab);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  activeTab === tab && !searchQuery
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Error/Notice Display */}
        {error && (
          <div className="mx-6 mt-3 bg-red-50 text-red-700 border border-red-100 rounded-xl p-3 text-xs flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Image Grid Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 text-black animate-spin stroke-[1.5]" />
              <span className="text-sm text-gray-500 font-medium">
                Fetching beautiful images...
              </span>
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => onSelectImage(img.url, img.alt)}
                  className="group relative h-40 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 cursor-pointer shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300"
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Hover Overlay info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-left">
                    <span className="text-white text-[11px] font-bold truncate">
                      {img.alt}
                    </span>
                    <a
                      href={img.authorLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-300 text-[9px] mt-0.5 hover:text-white transition-colors truncate"
                    >
                      by {img.author}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
              <ImageIcon className="h-8 w-8 text-gray-300 stroke-[1.5] mb-2" />
              <p className="text-sm font-medium">No images to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
