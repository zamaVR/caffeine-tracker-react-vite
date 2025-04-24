import { Dialog, Flex, Text, Button } from '@radix-ui/themes';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { timeToDecimal } from '@/utils/format';
import { getTotalCaffeineConcentration } from '@/utils/getCaffeineConcentration';
import type { Drink as AppDrink } from '@/types';

interface DataPoint {
  time: number;
  concentration: number;
}

// Constants
const CAFFEINE_SLEEP_THRESHOLD_MG = 30; // Consider caffeine levels below this safe for sleep
const TIME_STEP_HRS = 0.25; // Display one data point every this many hours
const TIME_BUFFER_HRS = 0.5; // Add this many hours buffer before first drink start time to set x axis start
const POINTS_TO_SHOW_UNDER_THRESHOLD = 4; // Show this many data

// Convert decimal hours to HH:mm format
function decimalToTimeString(decimal: number, wrapHours: boolean = false): string {
  const hours = wrapHours ? Math.floor(decimal) % 24 : Math.floor(decimal);
  const minutes = Math.round((decimal - Math.floor(decimal)) * 60);
  // Handle case where rounding minutes results in 60
  if (minutes === 60) {
    return `${(wrapHours ? (hours + 1) % 24 : hours + 1).toString().padStart(2, '0')}:00`;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Convert app Drink type to concentration calculator Drink type
function convertDrinkToCalculatorFormat(drink: AppDrink) {
  return {
    startTime: drink.time, // Already in HH:mm format
    doseMg: drink.caffeineMg,
    drinkDurationHrs: drink.durationMin / 60
  };
}

function generateDataPoints(drinks: AppDrink[], weightLbs: number, sensitivity: number): DataPoint[] {
  if (drinks.length === 0) return [];

  // Find start time (buffer before first drink)
  const earliestDrinkTime = Math.min(...drinks.map(d => timeToDecimal(d.time)));
  const startTime = Math.max(0, earliestDrinkTime - TIME_BUFFER_HRS);
  
  // Generate points every 15 minutes
  const points: DataPoint[] = [];
  let currentTime = startTime;
  let consecutiveLowReadings = 0;
  
  // Keep generating points until we have multiple consecutive readings below 30mg
  while (consecutiveLowReadings < POINTS_TO_SHOW_UNDER_THRESHOLD) {
    // For concentration calculation, use actual elapsed decimal hours without wrapping
    const concentrationMgL = getTotalCaffeineConcentration({
      currentTime: decimalToTimeString(currentTime, false),
      drinks: drinks.map(d => {
        return {
          ...convertDrinkToCalculatorFormat(d),
          startTime: d.time
        };
      }),
      halfLifeHrs: sensitivity,
      weightLbs
    });
    
    // Convert mg/L to total mg using volume of distribution (0.6 L/kg * weight in kg)
    const totalMg = concentrationMgL * (weightLbs * 0.453592 * 0.6);
    
    // For display purposes, store the wrapped time
    points.push({ 
      time: currentTime,
      concentration: totalMg 
    });
    
    if (totalMg < CAFFEINE_SLEEP_THRESHOLD_MG) {
      consecutiveLowReadings++;
    } else {
      consecutiveLowReadings = 0;
    }
    
    currentTime += TIME_STEP_HRS;
  }
  
  return points;
}

// Find the first point where concentration crosses below 30mg while decreasing
function findThirtyMgTime(data: DataPoint[]): number | undefined {
  for (let i = 1; i < data.length; i++) {
    const prevPoint = data[i - 1];
    const currentPoint = data[i];
    
    if (currentPoint.concentration < CAFFEINE_SLEEP_THRESHOLD_MG && 
        currentPoint.concentration < prevPoint.concentration) {
      return currentPoint.time;
    }
  }
  return undefined;
}

function formatTimeLabel(time: number): string {
  // This function should still wrap hours for display
  return decimalToTimeString(time, true).replace(/(\d{2}):(\d{2})/, (_, h, m) => {
    const hours = parseInt(h);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const suffix = Math.floor(time) >= 24 ? ' (next day)' : '';
    return `${displayHours}:${m} ${period}${suffix}`;
  });
}

interface CaffeineCurveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drinks: AppDrink[];
  weightLbs: number;
  sensitivity: number;
}

export function CaffeineCurveDialog({ 
  open, 
  onOpenChange,
  drinks,
  weightLbs,
  sensitivity
}: CaffeineCurveDialogProps) {
  // Only calculate data points when dialog is open
  const data = open ? generateDataPoints(drinks, weightLbs, sensitivity) : [];
  const maxConcentration = data.length > 0 ? Math.max(...data.map(d => d.concentration)) : 0;
  const yAxisMax = Math.ceil(maxConcentration * 1.05); // Add 5% buffer

  // Find the first point where concentration crosses below 30mg while decreasing
  const thirtyMgTime = findThirtyMgTime(data);
  
  // Get drink start times and add thirtyMgTime if it exists
  const xAxisTicks = [...drinks.map(d => timeToDecimal(d.time))];
  if (thirtyMgTime !== undefined) {
    xAxisTicks.push(thirtyMgTime);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content size="4">
        <Dialog.Title>Caffeine Concentration Over Time</Dialog.Title>
        
        <Flex direction="column" gap="3" mt="4" height="300px">
          {open && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={formatTimeLabel}
                  ticks={xAxisTicks}
                />
                <YAxis 
                  domain={[0, yAxisMax]}
                  label={{ value: 'mg', angle: -90, position: 'insideLeft' }}
                  ticks={[0, 30, yAxisMax]}
                />
                <Tooltip 
                  labelFormatter={formatTimeLabel}
                  formatter={(value: number) => [`${value.toFixed(0)} mg`, 'Total Caffeine']}
                />
                <Line 
                  type="monotone" 
                  dataKey="concentration" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={false}
                />
                {drinks.map((drink, index) => (
                  <ReferenceLine
                    key={drink.id}
                    x={timeToDecimal(drink.time)}
                    stroke="#ff7300"
                    strokeDasharray="3 3"
                    label={{ value: `Drink ${index + 1}`, position: 'top' }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}

          <Flex px="20px">
            <Text size="2" color="gray">
              Based on {drinks.length} drink{drinks.length !== 1 ? 's' : ''}, {weightLbs} lbs weight, and {sensitivity} hour half-life
              {thirtyMgTime && (
                <>, your earliest bedtime should be {formatTimeLabel(thirtyMgTime)}</>
              )}
            </Text>
          </Flex>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
