// resources/js/Components/AfricaMap.jsx
//
// Extracted from AfricaProjectsSection: kolshi li khass react-simple-maps
// (li kayjib m3ah d3-geo, d3-array, topojson-client — ~100kB) daba
// f chunk mnfsel. Had l component ghadi ykon lazy-loaded, ma ghadich
// itHmml m3a l bundle principal.

import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = '/data/countries-110m.json';

const ACTIVE_COLOR = '#bf5429';
const DEFAULT_COLOR = '#1f2d2d';

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

export default function AfricaMap({ projectCountries = [] }) {
    return (
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
                                style={{
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
                                }}
                            />
                        );
                    })
                }
            </Geographies>
        </ComposableMap>
    );
}