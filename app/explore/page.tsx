"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPinned,
  Car,
  Clock,
  Percent,
  Layers,
  Search,
  Circle,
  X,
} from "lucide-react";
import Footer from "../components/Footer";
import { fadeUp, staggerContainer, EASE_PREMIUM } from "@/app/lib/motion";

// ============================================
// HIERARCHICAL PARKING DATA MODEL
// ============================================

type Floor = {
  name: string;
  totalSpaces: number;
  occupiedSpaces: number;
};

type Location = {
  id: string;
  name: string;
  floors: Floor[];
};

const parkingLocations: Location[] = [
  {
    id: "loc-1",
    name: "Phoenix Mall",
    floors: [
      { name: "Ground Floor", totalSpaces: 40, occupiedSpaces: 12 },
      { name: "Basement 1", totalSpaces: 55, occupiedSpaces: 44 },
      { name: "Basement 2", totalSpaces: 65, occupiedSpaces: 51 },
    ],
  },
  {
    id: "loc-2",
    name: "Tech Park",
    floors: [
      { name: "Level 1", totalSpaces: 80, occupiedSpaces: 63 },
      { name: "Level 2", totalSpaces: 80, occupiedSpaces: 39 },
      { name: "Level 3", totalSpaces: 100, occupiedSpaces: 92 },
    ],
  },
  {
    id: "loc-3",
    name: "City Centre",
    floors: [
      { name: "Ground Floor", totalSpaces: 32, occupiedSpaces: 14 },
      { name: "Level 1", totalSpaces: 48, occupiedSpaces: 27 },
    ],
  },
  {
    id: "loc-4",
    name: "Orion Mall",
    floors: [
      { name: "Ground Floor", totalSpaces: 50, occupiedSpaces: 22 },
      { name: "Basement", totalSpaces: 72, occupiedSpaces: 60 },
    ],
  },
];

// Slot type
type ParkingSlot = {
  id: string;
  row: number;
  status: "occupied" | "vacant";
  isSelected: boolean;
};

// Generate parking slots for a specific floor
function generateParkingSlots(floor: Floor, locationIndex: number, floorIndex: number): ParkingSlot[] {
  const { totalSpaces, occupiedSpaces } = floor;
  const slots: ParkingSlot[] = [];

  // Calculate rows (aim for ~8-10 slots per row)
  const slotsPerRow = 8;
  const rows = Math.ceil(totalSpaces / slotsPerRow);

  // Generate prefix based on location and floor
  // P = Phoenix, T = Tech Park, C = City Centre, O = Orion
  const locationPrefix = ["P", "T", "C", "O"][locationIndex] || "P";

  // Floor indicator: G = Ground, B = Basement, L = Level
  let floorIndicator = "G";
  const floorNameLower = floor.name.toLowerCase();
  if (floorNameLower.includes("basement")) floorIndicator = "B";
  else if (floorNameLower.includes("level")) floorIndicator = "L";
  else if (floorNameLower.includes("ground")) floorIndicator = "G";

  // Seed for consistent but varied occupancy
  const seed = (locationIndex + 1) * 100 + (floorIndex + 1) * 7;

  let occupiedCount = 0;
  let slotNumber = 1;

  for (let row = 0; row < rows; row++) {
    for (let slot = 0; slot < slotsPerRow; slot++) {
      // Stop if we've reached total spaces
      if (slotNumber > totalSpaces) break;

      // Determine slot ID
      const slotId = `${locationPrefix}${floorIndicator}${slotNumber.toString().padStart(2, "0")}`;

      // Determine occupancy - distribute occupied slots throughout
      const isOccupied = occupiedCount < occupiedSpaces &&
        ((seed + row * 3 + slot) % Math.max(1, Math.floor(totalSpaces / occupiedSpaces)) < 2);

      if (isOccupied) occupiedCount++;

      slots.push({
        id: slotId,
        row,
        status: (isOccupied ? "occupied" : "vacant") as "occupied" | "vacant",
        isSelected: false,
      });

      slotNumber++;
    }
  }

  return slots;
}

// Calculate stats from floor data
function calculateStats(floor: Floor) {
  const total = floor.totalSpaces;
  const occupied = floor.occupiedSpaces;
  const vacant = total - occupied;
  const occupancyRate = Math.round((occupied / total) * 100);

  return { total, occupied, vacant, occupancyRate };
}

export default function ExplorePage() {
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);
  const [selectedFloorIndex, setSelectedFloorIndex] = useState(0);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when modal opens
  useEffect(() => {
    if (isLocationModalOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isLocationModalOpen]);

  // Get current location and floor
  const currentLocation = parkingLocations[selectedLocationIndex];
  const currentFloor = currentLocation.floors[selectedFloorIndex];

  // Generate slots and stats based on current selection
  const slots = generateParkingSlots(currentFloor, selectedLocationIndex, selectedFloorIndex);
  const stats = calculateStats(currentFloor);

  const filteredLocations = parkingLocations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationChange = (locationIndex: number) => {
    setSelectedLocationIndex(locationIndex);
    setSelectedFloorIndex(0);
    setIsLocationModalOpen(false);
    setSearchQuery("");
  };

  const handleFloorChange = (index: number) => {
    setSelectedFloorIndex(index);
  };

  const openModal = () => {
    setSearchQuery("");
    setIsLocationModalOpen(true);
  };

  const closeModal = () => {
    setIsLocationModalOpen(false);
    setSearchQuery("");
  };

  return (
    <main className="min-h-screen bg-bg0 flex flex-col">
      {/* Header */}
      <motion.header
        className="px-6 py-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE_PREMIUM }}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="ValetOS Logo"
              width={36}
              height={36}
              className="w-9 h-9"
            />
            <span className="font-bold text-lg text-bg1 tracking-wide">ValetOS</span>
          </Link>

          <Link
            href="/home"
            className="px-4 py-2 text-sm font-bold text-bg1 border border-bg1/20 rounded-full hover:bg-bg1 hover:text-bg0 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8"
          >
            {/* 1. Selected Location Card */}
            <motion.div variants={fadeUp}>
              <button
                onClick={openModal}
                className="w-full bg-white/50 border border-bg1/15 rounded-xl p-4 hover:bg-white/70 hover:border-bg1/25 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-fg0/10 flex items-center justify-center">
                    <MapPinned className="w-5 h-5 text-fg0" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-bg1">{currentLocation.name}</h3>
                    <p className="text-xs text-bg1/60">
                      {currentLocation.floors.length} floors • {currentLocation.floors.reduce((sum, f) => sum + f.totalSpaces, 0)} total spots
                    </p>
                  </div>
                  <span className="text-xs text-fg0 font-medium">Change</span>
                </div>
              </button>
            </motion.div>

            {/* 2. Floor Selector - Segmented Control */}
            <motion.div variants={fadeUp}>
              <FloorSelector
                floors={currentLocation.floors}
                selectedFloor={selectedFloorIndex}
                onFloorChange={handleFloorChange}
              />
            </motion.div>

            {/* 3. Location Header */}
            <motion.div variants={fadeUp}>
              <LocationHeader
                locationName={currentLocation.name}
                floorName={currentFloor.name}
                slotCount={slots.length}
              />
            </motion.div>

            {/* 4. Parking Dashboard */}
            <motion.div
              key={`${selectedLocationIndex}-${selectedFloorIndex}`}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col lg:flex-row gap-8"
            >
              {/* Parking Layout */}
              <div className="flex-1">
                <ParkingGrid slots={slots} />
              </div>

              {/* Stats Panel */}
              <div className="w-full lg:w-72">
                <ParkingStats stats={stats} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Location Selector Modal */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <LocationModal
            locations={filteredLocations}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onLocationSelect={handleLocationChange}
            onClose={closeModal}
            searchInputRef={searchInputRef}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

// Location Modal Component
function LocationModal({
  locations,
  searchQuery,
  onSearchChange,
  onLocationSelect,
  onClose,
  searchInputRef,
}: {
  locations: Location[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLocationSelect: (index: number) => void;
  onClose: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-bg0 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-bg1">Select Parking Location</h2>
              <p className="text-sm text-bg1/60 mt-1">Choose a location to view live parking availability.</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-bg1/10 flex items-center justify-center hover:bg-bg1/20 transition-colors"
            >
              <X className="w-4 h-4 text-bg1" />
            </button>
          </div>

          {/* Search Field */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bg1/40" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search location..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-bg1/15 rounded-xl text-bg1 placeholder-bg1/40 outline-none focus:border-fg0/40 focus:ring-2 focus:ring-fg0/10 transition-all"
            />
          </div>
        </div>

        {/* Location List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex flex-col gap-3">
            {locations.map((loc) => {
              const originalIndex = parkingLocations.findIndex(l => l.id === loc.id);
              const totalSpaces = loc.floors.reduce((sum, f) => sum + f.totalSpaces, 0);

              return (
                <button
                  key={loc.id}
                  onClick={() => onLocationSelect(originalIndex)}
                  className="w-full p-4 bg-white/50 border border-bg1/10 rounded-xl hover:bg-white hover:border-fg0/30 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-fg0/10 flex items-center justify-center group-hover:bg-fg0/20 transition-colors">
                      <MapPinned className="w-5 h-5 text-fg0" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-bg1">{loc.name}</h3>
                      <p className="text-xs text-bg1/60">{loc.floors.length} Floors • {totalSpaces} Total Spaces</p>
                    </div>
                  </div>
                </button>
              );
            })}

            {locations.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-bg1/50 text-sm">No locations found</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

// Floor Selector - Segmented Control (no dropdown)
function FloorSelector({
  floors,
  selectedFloor,
  onFloorChange,
}: {
  floors: Floor[];
  selectedFloor: number;
  onFloorChange: (index: number) => void;
}) {
  // For 4+ floors, wrap into multiple rows; otherwise use horizontal scroll
  const shouldWrap = floors.length > 4;

  if (shouldWrap) {
    // Wrap into rows of 3
    const rows: Floor[][] = [];
    for (let i = 0; i < floors.length; i += 3) {
      rows.push(floors.slice(i, i + 3));
    }

    return (
      <div className="flex flex-col gap-2">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-2">
            {row.map((floor, idx) => {
              const floorIndex = rowIdx * 3 + idx;
              const isSelected = floorIndex === selectedFloor;
              return (
                <button
                  key={floor.name}
                  onClick={() => onFloorChange(floorIndex)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? "bg-fg0 border-fg0 text-bg0"
                      : "bg-white/50 border-bg1/15 text-bg1 hover:bg-white hover:border-bg1/30"
                  }`}
                >
                  <Layers className={`w-4 h-4 ${isSelected ? "text-bg0" : "text-bg1/50"}`} />
                  <span className="truncate">{floor.name}</span>
                  <span className={`text-xs ${isSelected ? "text-bg0/70" : "text-bg1/40"}`}>
                    {floor.totalSpaces}
                  </span>
                </button>
              );
            })}
            {/* Fill empty spaces in last row */}
            {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => (
              <div key={`empty-${i}`} className="flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Horizontal scrollable segmented control
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
      {floors.map((floor, index) => {
        const isSelected = index === selectedFloor;
        return (
          <button
            key={floor.name}
            onClick={() => onFloorChange(index)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
              isSelected
                ? "bg-fg0 border-fg0 text-bg0"
                : "bg-white/50 border-bg1/15 text-bg1 hover:bg-white hover:border-bg1/30"
            }`}
          >
            <Layers className={`w-4 h-4 ${isSelected ? "text-bg0" : "text-bg1/50"}`} />
            <span>{floor.name}</span>
            <span className={`text-xs ${isSelected ? "text-bg0/70" : "text-bg1/40"}`}>
              {floor.totalSpaces}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Location Header Component
function LocationHeader({
  locationName,
  floorName,
  slotCount,
}: {
  locationName: string;
  floorName: string;
  slotCount: number;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold text-bg1">{locationName}</h2>
        <span className="text-bg1/50">•</span>
        <span className="text-base text-bg1/70">{floorName}</span>
        <span className="text-bg1/50">•</span>
        <span className="text-sm text-bg1/50">{slotCount} slots</span>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
        <span className="text-xs text-bg1/60">Live Parking Status</span>
      </div>
    </div>
  );
}

// Parking Grid Component
function ParkingGrid({ slots }: { slots: ParkingSlot[] }) {
  // Group slots by row (8 slots per row)
  const slotsPerRow = 8;
  const rows: typeof slots[] = [];

  for (let i = 0; i < slots.length; i += slotsPerRow) {
    rows.push(slots.slice(i, i + slotsPerRow));
  }

  return (
    <div className="bg-white/50 border border-bg1/10 rounded-2xl p-6">
      {rows.map((rowSlots, rowIndex) => (
        <div key={rowIndex}>
          {/* Parking Row */}
          <div className="flex flex-wrap gap-2 justify-center">
            {rowSlots.map((slot) => (
              <ParkingSlot key={slot.id} slot={slot} />
            ))}
          </div>

          {/* Drive Lane (except after last row) */}
          {rowIndex < rows.length - 1 && (
            <div className="flex items-center justify-center py-4">
              <div className="h-px bg-bg1/10 w-4/5" />
              <span className="px-3 text-xs text-bg1/40 whitespace-nowrap">
                Drive Lane
              </span>
              <div className="h-px bg-bg1/10 w-4/5" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Parking Slot Component
function ParkingSlot({ slot }: { slot: ParkingSlot }) {
  const isOccupied = slot.status === "occupied";

  return (
    <div
      className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
        isOccupied
          ? "bg-bg1/15 border border-bg1/20"
          : "bg-white border border-bg1/20 hover:border-fg0/30 hover:shadow-md"
      }`}
      title={isOccupied ? "Occupied" : "Available"}
    >
      <span
        className={`text-xs font-bold ${
          isOccupied ? "text-bg1/70" : "text-bg1"
        }`}
      >
        {slot.id}
      </span>
      <Car
        className={`w-3.5 h-3.5 ${
          isOccupied ? "text-bg1/50" : "text-bg1/30"
        }`}
      />
    </div>
  );
}

// Stats Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        accent
          ? "bg-fg0/10 border-fg0/20"
          : "bg-white/50 border-bg1/10"
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            accent ? "bg-fg0/20" : "bg-bg1/10"
          }`}
        >
          <Icon
            className={`w-4 h-4 ${accent ? "text-fg0" : "text-bg1/70"}`}
          />
        </div>
        <span className="text-xs text-bg1/60 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div
        className={`text-2xl font-bold ${accent ? "text-fg0" : "text-bg1"}`}
      >
        {value}
      </div>
    </div>
  );
}

// Stats Panel Component
function ParkingStats({ stats }: { stats: ReturnType<typeof calculateStats> }) {
  const now = new Date();
  const lastUpdated = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-3">
      <StatCard
        label="Available"
        value={stats.vacant}
        icon={Car}
      />
      <StatCard
        label="Occupied"
        value={stats.occupied}
        icon={MapPinned}
      />
      <StatCard
        label="Occupancy"
        value={`${stats.occupancyRate}%`}
        icon={Percent}
        accent
      />
      <StatCard
        label="Total Capacity"
        value={stats.total}
        icon={Layers}
      />
      <div className="p-4 bg-white/30 border border-bg1/10 rounded-xl">
        <div className="flex items-center gap-2 text-xs text-bg1/60">
          <Clock className="w-3.5 h-3.5" />
          <span>Last Updated</span>
        </div>
        <div className="text-sm font-medium text-bg1 mt-1">{lastUpdated}</div>
      </div>
    </div>
  );
}
