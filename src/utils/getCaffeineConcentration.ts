/**
 * Calculates caffeine plasma concentration at a given time after starting a caffeinated drink.
 * 
 * Assumptions:
 * - Caffeine is ingested linearly over drinkDuration
 * - Absorption starts after a fixed 0.75-hour lag
 * - Elimination follows exponential decay using a personalized half-life
 */

// Pharmacokinetic constants
const ABSORPTION_DELAY_HRS = 0.1; // 6 minutes absorption delay
const VOLUME_DISTRIBUTION_FACTOR = 0.6; // L/kg
const LBS_TO_KG = 0.453592; // Conversion factor from pounds to kilograms
const DEFAULT_WEIGHT_LBS = 155; // Default weight in pounds

export interface Drink {
    /** Time of day in "HH:mm" format (24hr) when the drink was started */
    startTime: string;
    /** Caffeine dose in milligrams */
    doseMg: number;
    /** Duration over which the drink is consumed, in hours */
    drinkDurationHrs: number;
}

/**
 * Converts a time string in "HH:mm" format to decimal hours
 * Handles hours >= 24 for time calculations spanning multiple days
 */
function timeToDecimal(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    if (hours < 0 || minutes < 0 || minutes >= 60) {
        throw new Error('Time must be in valid "HH:mm" format with non-negative hours');
    }
    return hours + minutes / 60;
}

export function getTotalCaffeineConcentration({
    currentTime,      // in "HH:mm" format (24hr)
    drinks,
    halfLifeHrs,
    weightLbs = DEFAULT_WEIGHT_LBS
}: {
    currentTime: string;      // in "HH:mm" format (24hr)
    drinks: Drink[];
    halfLifeHrs: number;
    weightLbs?: number;
}): number {
    // Input validation
    if (halfLifeHrs <= 0) throw new Error('halfLifeHrs must be positive');
    if (weightLbs <= 0) throw new Error('weightLbs must be positive');
    if (!Array.isArray(drinks)) throw new Error('drinks must be an array');
    
    const currentTimeDecimal = timeToDecimal(currentTime);
    
    drinks.forEach(drink => {
        if (drink.doseMg <= 0) throw new Error('drink.doseMg must be positive');
        if (drink.drinkDurationHrs <= 0) throw new Error('drink.drinkDurationHrs must be positive');
        timeToDecimal(drink.startTime); // Validate time format
    });

    const weightKg = weightLbs * LBS_TO_KG;
    const Vd = VOLUME_DISTRIBUTION_FACTOR * weightKg;
    const k = Math.log(2) / halfLifeHrs;

    return drinks.reduce((total, drink) => {
        const t = currentTimeDecimal - timeToDecimal(drink.startTime);
        const T = drink.drinkDurationHrs;
        const D = drink.doseMg;

        if (t < ABSORPTION_DELAY_HRS) return total;

        let concentration = 0;

        if (t >= ABSORPTION_DELAY_HRS && t < ABSORPTION_DELAY_HRS + T) {
            const elapsed = t - ABSORPTION_DELAY_HRS;
            concentration = (D / (T * Vd * k)) * (1 - Math.exp(-k * elapsed));
        } else if (t >= ABSORPTION_DELAY_HRS + T) {
            const elapsed = t - ABSORPTION_DELAY_HRS - T;
            concentration = (D / Vd) * Math.exp(-k * elapsed);
        }

        return total + concentration;
    }, 0);
}
  