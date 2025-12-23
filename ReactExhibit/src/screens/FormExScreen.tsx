import { useState } from "react";
import { motion } from "framer-motion";
import TransitionWrapper from "../components/TransitionWrapper";

interface ServiceOption {
  id: string;
  label: string;
  price: number;
}

interface FuelOption {
  id: string;
  label: string;
}

interface BrandOption {
  id: string;
  label: string;
}

const services: ServiceOption[] = [
  { id: "cb0", label: "Inspection", price: 2000 },
  { id: "cb1", label: "Diagnostics", price: 500 },
  { id: "cb2", label: "Tire Change", price: 700 },
  { id: "cb3", label: "Oil Change", price: 2800 },
  { id: "cb4", label: "Brake Pads", price: 2000 },
  { id: "cb5", label: "Brake Discs", price: 4000 },
];

const fuelTypes: FuelOption[] = [
  { id: "fuel0", label: "Petrol" },
  { id: "fuel1", label: "Diesel" },
  { id: "fuel2", label: "Electric" },
  { id: "fuel3", label: "Hybrid" },
  { id: "fuel4", label: "LPG/CNG" },
];

const brands: BrandOption[] = [
  { id: "brand0", label: "Skoda" },
  { id: "brand1", label: "Volkswagen" },
  { id: "brand2", label: "Audi" },
  { id: "brand3", label: "BMW" },
  { id: "brand4", label: "Mercedes" },
  { id: "brand5", label: "Toyota" },
  { id: "brand6", label: "Honda" },
  { id: "brand7", label: "Ford" },
];

const FormExScreen = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [otherWork, setOtherWork] = useState("");
  const [otherWorkCost, setOtherWorkCost] = useState(0);
  const [selectedFuel, setSelectedFuel] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [mileage, setMileage] = useState(0);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const servicesCost = services
    .filter((s) => selectedServices.includes(s.id))
    .reduce((acc, s) => acc + s.price, 0);

  const totalCost = servicesCost + otherWorkCost;

  const selectedServicesLabels = services
    .filter((s) => selectedServices.includes(s.id))
    .map((s) => s.label)
    .join(", ");

  const brandLabel = brands.find((b) => b.id === selectedBrand)?.label || "";
  const fuelLabel = fuelTypes.find((f) => f.id === selectedFuel)?.label || "";

  return (
    <TransitionWrapper>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Service</span> Order
          </h1>
          <p className="text-white/60">Interactive form with real-time calculations</p>
        </div>

        {/* Order Summary Card */}
        <motion.div
          className="glass-card mb-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-gradient-to-r from-neon-pink/20 via-neon-purple/20 to-neon-cyan/20 -m-6 mb-6 p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 text-white/80">
              <p>
                <span className="text-white/50">Services: </span>
                {selectedServicesLabels || "None selected"}
                {otherWork && ` + ${otherWork}`}
              </p>
              <p>
                <span className="text-white/50">Brand: </span>
                {brandLabel || "Not selected"}
              </p>
              <p>
                <span className="text-white/50">Fuel: </span>
                {fuelLabel || "Not selected"}
              </p>
              <p>
                <span className="text-white/50">Mileage: </span>
                {mileage > 0 ? `${mileage.toLocaleString()} km` : "Not specified"}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60">Total Cost</span>
            <span className="text-4xl font-bold text-gradient">
              {totalCost.toLocaleString()} CZK
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Services */}
          <div className="space-y-6">
            {/* Services Checkboxes */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4">Select Services</h3>
              <div className="space-y-3">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className={`
                      flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300
                      ${selectedServices.includes(service.id)
                        ? "bg-neon-purple/20 border border-neon-purple/50"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                        ${selectedServices.includes(service.id)
                          ? "bg-neon-purple border-neon-purple"
                          : "border-white/30"
                        }
                      `}>
                        {selectedServices.includes(service.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span>{service.label}</span>
                    </div>
                    <span className="text-neon-cyan font-medium">{service.price.toLocaleString()} CZK</span>
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => toggleService(service.id)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Other Work */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4">Additional Work</h3>
              <textarea
                value={otherWork}
                onChange={(e) => setOtherWork(e.target.value)}
                placeholder="Describe additional work needed..."
                className="glass-input w-full h-24 resize-none mb-4"
              />
              <div>
                <label className="block text-white/60 text-sm mb-2">Estimated Cost (CZK)</label>
                <input
                  type="number"
                  min="0"
                  value={otherWorkCost || ""}
                  onChange={(e) => setOtherWorkCost(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0"
                  className="glass-input w-full"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Vehicle Info */}
          <div className="space-y-6">
            {/* Brand Select */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4">Vehicle Brand</h3>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="glass-select w-full"
              >
                <option value="">Select brand...</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.label}</option>
                ))}
              </select>
            </div>

            {/* Fuel Type Radio Buttons */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4">Fuel Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {fuelTypes.map((fuel) => (
                  <label
                    key={fuel.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
                      ${selectedFuel === fuel.id
                        ? "bg-neon-pink/20 border border-neon-pink/50"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }
                    `}
                  >
                    <div className={`
                      w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                      ${selectedFuel === fuel.id
                        ? "border-neon-pink"
                        : "border-white/30"
                      }
                    `}>
                      {selectedFuel === fuel.id && (
                        <div className="w-2 h-2 rounded-full bg-neon-pink" />
                      )}
                    </div>
                    <span className="text-sm">{fuel.label}</span>
                    <input
                      type="radio"
                      name="fuel"
                      value={fuel.id}
                      checked={selectedFuel === fuel.id}
                      onChange={() => setSelectedFuel(fuel.id)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Mileage */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold mb-4">Mileage</h3>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={mileage || ""}
                  onChange={(e) => setMileage(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0"
                  className="glass-input flex-1 text-center text-xl"
                />
                <span className="text-white/60">km</span>
              </div>
              {/* Quick presets */}
              <div className="flex gap-2 mt-4">
                {[50000, 100000, 150000, 200000].map((km) => (
                  <button
                    key={km}
                    onClick={() => setMileage(km)}
                    className={`
                      flex-1 py-2 rounded-lg text-sm transition-all
                      ${mileage === km
                        ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                      }
                    `}
                  >
                    {(km / 1000)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button className="btn-neon w-full py-4 text-lg">
              Submit Order
            </button>
          </div>
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default FormExScreen;
