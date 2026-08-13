import React, { useEffect, useRef, useState } from 'react';
import { ComposableMap, Geographies, Geography, useMapContext } from 'react-simple-maps';
import { merge } from 'topojson-client';

const GEO_URL = '/data/countries-110m.json';

// Morocco (504) and Western Sahara (732) are dissolved into a single shape
// so the map shows Morocco's full territory without an internal border.
const MOROCCO_MERGED_IDS = ['504', '732'];

const ACTIVE_COLOR = '#bf5429';
const DEFAULT_COLOR = '#1f2d2d';

const geographyStyle = (active) => ({
  default: {
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  hover: {
    fill: active ? '#a8461f' : '#324949',
    outline: 'none',
    cursor: active ? 'pointer' : 'default',
  },
  pressed: {
    outline: 'none',
  },
});

// <Geography> only reads `geography.svgPath` — it never computes it. Inside
// <Geographies>, that path is precomputed for us; for a feature we build by
// hand (the merged Morocco shape), we have to compute it ourselves via the
// same projection, using the path generator from map context.
const MoroccoGeography = ({ feature, active, onHover, onLeave }) => {
  const { path } = useMapContext();
  const geography = { ...feature, rsmKey: 'morocco-merged', svgPath: path(feature) };
  return (
    <Geography
      geography={geography}
      fill={active ? ACTIVE_COLOR : DEFAULT_COLOR}
      stroke="#f5f5f4"
      strokeWidth={0.6}
      style={geographyStyle(active)}
      onMouseEnter={() => onHover('Morocco')}
      onMouseLeave={onLeave}
    />
  );
};

const AFRICA_NUMERIC_TO_ISO2 = {
  '012': 'DZ', '024': 'AO', '204': 'BJ', '072': 'BW', '854': 'BF',
  '108': 'BI', '132': 'CV', '120': 'CM', '140': 'CF', '148': 'TD',
  '174': 'KM', '178': 'CG', '180': 'CD', '262': 'DJ', '818': 'EG',
  '226': 'GQ', '232': 'ER', '748': 'SZ', '231': 'ET', '266': 'GA',
  '270': 'GM', '288': 'GH', '324': 'GN', '624': 'GW', '384': 'CI',
  '404': 'KE', '426': 'LS', '430': 'LR', '434': 'LY', '450': 'MG',
  '454': 'MW', '466': 'ML', '478': 'MR', '480': 'MU', '504': 'MA',
  '508': 'MZ', '516': 'NA', '562': 'NE', '566': 'NG', '646': 'RW',
  '678': 'ST', '686': 'SN', '690': 'SC', '694': 'SL', '706': 'SO',
  '710': 'ZA', '728': 'SS', '729': 'SD', '834': 'TZ', '768': 'TG',
  '788': 'TN', '800': 'UG', '894': 'ZM', '716': 'ZW', '732': 'MA',
};

const AfricaProjectsSection = ({
  title = 'Notre présence en Afrique',
  description = 'Nous travaillons directement avec les gouvernements et la société civile à travers le continent, et dans chaque pays, nous avons un impact concret.',
  projectCountries = []
}) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const mapRef = useRef(null);
  const [moroccoFeature, setMoroccoFeature] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMapMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
  };

  useEffect(() => {
    let cancelled = false;

    fetch(GEO_URL)
      .then((res) => res.json())
      .then((topology) => {
        if (cancelled) return;
        const geometries = topology.objects.countries.geometries.filter((g) =>
          MOROCCO_MERGED_IDS.includes(g.id)
        );
        if (geometries.length === 0) return;
        const geometry = merge(topology, geometries);
        setMoroccoFeature({ type: 'Feature', geometry, properties: { name: 'Morocco' } });
      })
      .catch((err) => {
        console.error('Failed to dissolve Morocco / Western Sahara border', err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observer le titre
    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    // Observer la carte
    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background decorations - Style AreasOfFocus */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-[blob_7s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl animate-[blob_7s_ease-in-out_infinite_delay]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Header - Style AreasOfFocus */}
          <div
            ref={titleRef}
            className="lg:col-span-5 opacity-0 translate-y-8 transition-all duration-700 ease-out"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[2px] bg-gradient-to-r from-[#bf5429] to-transparent"></span>
              <span className="text-sm tracking-widest uppercase text-[#324949] font-medium flex items-center gap-2">
                <svg className="w-4 h-4 text-[#bf5429]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Notre présence
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1f2d2d] font-medium leading-tight">
              {title}
            </h2>
            <p className="mt-5 text-[#5f6967] font-light text-lg leading-relaxed">
              {description}
            </p>

            {/* Stats - Nouveau */}
            <div className="mt-8 flex items-center gap-8">
              <div>
                <div className="text-3xl font-display font-semibold text-[#bf5429]">
                  {projectCountries.length}
                </div>
                <div className="text-sm text-[#5f6967] mt-1">Pays actifs</div>
              </div>
              <div className="w-px h-12 bg-[#d6d9d8]"></div>
              <div>
                <div className="text-3xl font-display font-semibold text-[#bf5429]">
                  15+
                </div>
                <div className="text-sm text-[#5f6967] mt-1">Projets en cours</div>
              </div>
              <div className="w-px h-12 bg-[#d6d9d8]"></div>
              <div>
                <div className="text-3xl font-display font-semibold text-[#bf5429]">
                  50+
                </div>
                <div className="text-sm text-[#5f6967] mt-1">Partenaires</div>
              </div>
            </div>
          </div>

          {/* Map - Style AreasOfFocus */}
          <div
            ref={mapRef}
            className="lg:col-span-7 opacity-0 translate-y-8 transition-all duration-700 delay-200 ease-out"
          >
            <div className="relative">
              {/* Carte avec ombre et bordure style AreasOfFocus */}
              <div
                className="relative rounded-2xl p-6 border border-[#d6d9d8]/30 hover:border-[#bf5429]/50 transition-all duration-500 hover:shadow-2xl"
                onMouseMove={handleMapMouseMove}
              >
                {/* Top border accent */}
                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#bf5429] via-[#bf5429] to-transparent w-full rounded-t-2xl"></div>

                {/* Badge nombre de pays */}
                <div className="absolute -top-3 -right-3 bg-[#bf5429] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {projectCountries.length} pays
                </div>

                {hoveredCountry && (
                  <div
                    className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-[#1f2d2d] px-3 py-1.5 text-xs font-medium text-white shadow-lg"
                    style={{ left: tooltipPos.x, top: tooltipPos.y - 10 }}
                  >
                    {hoveredCountry}
                  </div>
                )}

                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{ scale: 350, center: [20, 2] }}
                  width={700}
                  height={820}
                  style={{ width: '100%', height: 'auto' }}
                >
                  <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        // Once the dissolved shape is ready, it replaces
                        // these two below. Until then, render them
                        // normally so Morocco is never left blank.
                        if (moroccoFeature && MOROCCO_MERGED_IDS.includes(geo.id)) return null;
                        const iso2 = AFRICA_NUMERIC_TO_ISO2[geo.id];
                        if (!iso2) return null;
                        const active = projectCountries.includes(iso2);
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={active ? ACTIVE_COLOR : DEFAULT_COLOR}
                            stroke="#f5f5f4"
                            strokeWidth={0.6}
                            style={geographyStyle(active)}
                            onMouseEnter={() => setHoveredCountry(geo.properties?.name || iso2)}
                            onMouseLeave={() => setHoveredCountry(null)}
                          />
                        );
                      })
                    }
                  </Geographies>

                  {moroccoFeature && (
                    <MoroccoGeography
                      feature={moroccoFeature}
                      active={projectCountries.includes('MA')}
                      onHover={setHoveredCountry}
                      onLeave={() => setHoveredCountry(null)}
                    />
                  )}
                </ComposableMap>

                {/* Légende */}
                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#d6d9d8]/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#bf5429]"></div>
                    <span className="text-xs text-[#5f6967]">Pays actifs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#1f2d2d]"></div>
                    <span className="text-xs text-[#5f6967]">Autres pays</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }
        .animate-blob-delay {
          animation: blob 7s ease-in-out infinite 1s;
        }
      `}</style>
    </section>
  );
};

export default AfricaProjectsSection;