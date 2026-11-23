'use client';

import * as React from 'react';
import { MapPin, Crosshair, Search, Loader2, AlertCircle, Trash2, Locate, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/*
 * MapPicker — interactive point picker.
 *
 * Design goals:
 *  - Uses Leaflet + OpenTopoMap raster tiles (no API key required).
 *  - Progressive enhancement: Leaflet is loaded lazily from a CDN so the report
 *    page still renders (and coordinates can be typed manually) even offline or
 *    when the CDN is blocked.
 *  - Emits a GeoJSON Point ([lng, lat]) that matches the backend contract.
 */

const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const OPENTOPOMAP_TILE_URL = 'https://tile.opentopomap.org/{z}/{x}/{y}.png';
const OPENTOPOMAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors | ' +
  '&copy; <a href="https://opentopomap.org" target="_blank" rel="noopener noreferrer">OpenTopoMap</a>';

// Leaflet is loaded as a global; we type only what we touch to avoid a hard dep.
type LatLng = { lat: number; lng: number };
type LeafletMap = {
  setView: (center: LatLng, zoom: number) => LeafletMap;
  on: (event: string, handler: (e: { latlng: LatLng }) => void) => LeafletMap;
  remove: () => void;
  invalidateSize: () => void;
};
type LeafletMarker = {
  setLatLng: (latlng: LatLng) => LeafletMarker;
  addTo: (map: LeafletMap) => LeafletMarker;
};
type LeafletTile = {
  src: string;
};
type LeafletTileEvent = {
  tile: LeafletTile;
  error?: Error;
};
type LeafletTileLayer = {
  addTo: (m: LeafletMap) => unknown;
  on: (event: string, handler: (e: LeafletTileEvent) => void) => LeafletTileLayer;
};
type LeafletNamespace = {
  map: (el: HTMLElement, options?: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, options?: Record<string, unknown>) => LeafletTileLayer;
  marker: (latlng: LatLng, options?: Record<string, unknown>) => LeafletMarker;
};

declare global {
  interface Window {
    L?: LeafletNamespace;
  }
}

let leafletPromise: Promise<LeafletNamespace> | null = null;

/** Load Leaflet JS once, returning the global namespace. CSS is imported globally in app/layout.tsx. */
function loadLeaflet(): Promise<LeafletNamespace> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Leaflet can only load in the browser'));
  }
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise<LeafletNamespace>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${LEAFLET_JS}"]`
    );
    const script = existing ?? document.createElement('script');

    const handleLoad = () => {
      if (window.L) resolve(window.L);
      else reject(new Error('Leaflet failed to initialise'));
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', () =>
      reject(new Error('Failed to load map library'))
    );

    if (!existing) {
      script.src = LEAFLET_JS;
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return leafletPromise;
}

const DEFAULT_CENTER: LatLng = { lat: 23.6850, lng: 90.3563 }; // Bangladesh
const DEFAULT_ZOOM = 7;

interface MapPickerProps {
  /** Current selected point, or null. */
  value: { lat: number; lng: number } | null;
  /** Called with a GeoJSON point when the user picks / types a location. */
  onChange: (point: { type: 'Point'; coordinates: [number, number] } | null) => void;
  /** Optional address textbox bound to the parent form. */
  address?: string;
  onAddressChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function MapPicker({
  value,
  onChange,
  address,
  onAddressChange,
  disabled = false,
  className,
}: MapPickerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<LeafletMap | null>(null);
  const markerRef = React.useRef<LeafletMarker | null>(null);
  const leafletRef = React.useRef<LeafletNamespace | null>(null);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');

  // Manual coordinate inputs (source of truth when the user types).
  const [latInput, setLatInput] = React.useState(value ? String(value.lat) : '');
  const [lngInput, setLngInput] = React.useState(value ? String(value.lng) : '');
  const [coordError, setCoordError] = React.useState<string | null>(null);

  // Initialise the map once Leaflet is available.
  React.useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current || mapRef.current) return;
        leafletRef.current = L;

        const center: LatLng = value ?? DEFAULT_CENTER;
        const initialZoom = value ? DEFAULT_ZOOM : DEFAULT_ZOOM;
        const map = L.map(containerRef.current, {
          center,
          zoom: initialZoom,
          attributionControl: true,
          maxBounds: [
            [20.5, 88.0],  // Southwest corner of Bangladesh
            [26.7, 92.7],  // Northeast corner of Bangladesh
          ],
          maxBoundsViscosity: 1.0,
        });
        const tileLayer = L.tileLayer(OPENTOPOMAP_TILE_URL, {
          attribution: OPENTOPOMAP_ATTRIBUTION,
          maxZoom: 19,
          subdomains: 'abc',
        });

        tileLayer.on('tileloadstart', (e) => {
          console.log('[OpenTopoMap] tileloadstart:', e.tile.src);
        });
        tileLayer.on('tileload', (e) => {
          console.log('[OpenTopoMap] tileload OK:', e.tile.src);
        });
        tileLayer.on('tileerror', (e) => {
          console.error('[OpenTopoMap] tileerror:', e.tile.src, e.error);
          setStatus('error');
        });
        tileLayer.on('tileunload', (e) => {
          console.log('[OpenTopoMap] tileunload:', e.tile.src);
        });

        tileLayer.addTo(map);

        map.on('click', (e) => {
          emitPoint(e.latlng.lat, e.latlng.lng);
          mapRef.current?.setView(e.latlng, DEFAULT_ZOOM);
        });

        if (value) {
          markerRef.current = L.marker(value, {
            draggable: !disabled,
          }).addTo(map);
        }

        mapRef.current = map;
        setStatus('ready');

        // Wait for browser paint before invalidating size so Leaflet calculates dimensions correctly.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            map.invalidateSize();
          });
        });
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the marker in sync with external value changes.
  React.useEffect(() => {
    const L = leafletRef.current;
    if (status !== 'ready' || !L || !mapRef.current) return;

    if (value) {
      if (markerRef.current) {
        markerRef.current.setLatLng(value);
      } else {
        markerRef.current = L.marker(value, { draggable: !disabled }).addTo(mapRef.current);
      }
      setLatInput(String(value.lat));
      setLngInput(String(value.lng));
    } else if (markerRef.current) {
      markerRef.current = null;
    }
  }, [value, status, disabled]);

  const emitPoint = React.useCallback((lat: number, lng: number) => {
    onChangeRef.current?.({ type: 'Point', coordinates: [lng, lat] });
  }, []);

  const recenter = () => {
    const target = value ?? DEFAULT_CENTER;
    mapRef.current?.setView(target, DEFAULT_ZOOM);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mapRef.current?.invalidateSize();
      });
    });
  };

  const applyManualCoordinates = () => {
    const lat = Number(latInput);
    const lng = Number(lngInput);
    if (latInput.trim() === '' || lngInput.trim() === '') {
      setCoordError('Both latitude and longitude are required.');
      return;
    }
    if (Number.isNaN(lat) || lat < -90 || lat > 90) {
      setCoordError('Latitude must be between -90 and 90.');
      return;
    }
    if (Number.isNaN(lng) || lng < -180 || lng > 180) {
      setCoordError('Longitude must be between -180 and 180.');
      return;
    }
    setCoordError(null);
    emitPoint(lat, lng);
    mapRef.current?.setView({ lat, lng }, DEFAULT_ZOOM);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mapRef.current?.invalidateSize();
      });
    });
  };

  const clearPoint = () => {
    onChange(null);
    setLatInput('');
    setLngInput('');
    setCoordError(null);
  };

  const hasPoint = !!value;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Map card */}
      <div className="overflow-hidden rounded-xl border border-input bg-muted shadow-soft">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 border-b border-input bg-card px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
            <span className="truncate text-sm font-medium text-foreground">
              {hasPoint ? 'Location selected' : 'Select a location'}
            </span>
          </div>
          <div className="flex flex-shrink-0 items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="iconSm"
              onClick={recenter}
              className="h-8 w-8"
              aria-label="Recenter map on Bangladesh"
              disabled={disabled || status !== 'ready'}
            >
              <Locate className="h-4 w-4" />
            </Button>
            {hasPoint && (
              <Button
                type="button"
                variant="softDestructive"
                size="iconSm"
                onClick={clearPoint}
                className="h-8 w-8"
                aria-label="Clear selected location"
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Map canvas */}
        <div
          className={cn(
            'relative',
            // Subtle grid backdrop shown only while the map is loading. This lives on
            // the React-owned shell, NOT on the Leaflet container: Leaflet adds the
            // `leaflet-container` class to the inner element imperatively, and toggling
            // that element's className on re-render would strip Leaflet's class. Without
            // it, Leaflet's `max-width:none` reset stops applying and Tailwind's
            // `img { max-width:100% }` collapses every tile to 0px wide (blank map).
            status === 'loading' && 'map-grid'
          )}
        >
          <div
            ref={containerRef}
            // Keep this className static so React never rewrites it after Leaflet
            // initialises (a changed className would remove `leaflet-container`).
            className="h-[260px] w-full sm:h-[320px]"
            aria-label="Map location picker"
          />

          {status === 'loading' && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[1px]">
              <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading map…
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted px-6 text-center">
              <AlertCircle className="h-6 w-6 text-warning" />
              <p className="text-sm font-medium text-foreground">Map unavailable</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                The interactive map could not load. You can still enter the
                coordinates manually below.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status line */}
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-xs',
          hasPoint ? 'bg-success/5 text-success' : 'bg-muted/50 text-muted-foreground'
        )}
      >
        {hasPoint ? (
          <Check className="h-3.5 w-3.5 flex-shrink-0" />
        ) : (
          <Crosshair className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
        )}
        <span className="text-pretty">
          {hasPoint
            ? `Pin placed at ${value!.lat.toFixed(5)}, ${value!.lng.toFixed(5)}`
            : 'Click anywhere on the map to drop a pin, or enter coordinates below.'}
        </span>
      </div>

      {/* Coordinate inputs (always available, even if the map fails) */}
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="latitude" className="text-xs font-medium text-muted-foreground">
            Latitude
          </label>
          <Input
            id="latitude"
            inputMode="decimal"
            placeholder="e.g. 23.6850"
            value={latInput}
            onChange={(e) => {
              setLatInput(e.target.value);
              setCoordError(null);
            }}
            disabled={disabled}
            aria-invalid={!!coordError}
            className={cn(coordError && 'border-danger focus-visible:ring-danger')}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="longitude" className="text-xs font-medium text-muted-foreground">
            Longitude
          </label>
          <Input
            id="longitude"
            inputMode="decimal"
            placeholder="e.g. 90.3563"
            value={lngInput}
            onChange={(e) => {
              setLngInput(e.target.value);
              setCoordError(null);
            }}
            disabled={disabled}
            aria-invalid={!!coordError}
            className={cn(coordError && 'border-danger focus-visible:ring-danger')}
          />
        </div>
      </div>

      {coordError ? (
        <p role="alert" className="flex items-center gap-1 text-xs font-medium text-danger">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {coordError}
        </p>
      ) : (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={applyManualCoordinates}
          disabled={disabled || (!latInput && !lngInput)}
          className="w-full"
        >
          <Search className="mr-2 h-4 w-4" />
          Use these coordinates
        </Button>
      )}

      {onAddressChange && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className="text-xs font-medium text-muted-foreground">
            Address / Landmark{' '}
            <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            id="address"
            placeholder="e.g. Banani Road 11, near the metro station"
            value={address ?? ''}
            onChange={(e) => onAddressChange(e.target.value)}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}