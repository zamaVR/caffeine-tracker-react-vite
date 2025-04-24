import { Flex, Text } from '@radix-ui/themes';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { timeToDecimal } from '@/utils/format';
import { getTotalCaffeineConcentration } from '@/utils/getCaffeineConcentration';
import type { Drink as AppDrink } from '@/types';

interface DataPoint {
  time: number;
  concentration: number;
}

// Constants
const CAFFEINE_SLEEP_THRESHOLD_MG = 30;
const TIME_STEP_HRS = 0.25;
const TIME_BUFFER_HRS = 0.5;
const POINTS_TO_SHOW_UNDER_THRESHOLD = 4;

// Convert decimal hours to HH:mm format
function decimalToTimeString(decimal: number, wrapHours: boolean = false): string {
  const hours = wrapHours ? Math.floor(decimal) % 24 : Math.floor(decimal);
  const minutes = Math.round((decimal - Math.floor(decimal)) * 60);
  if (minutes === 60) {
    return `${(wrapHours ? (hours + 1) % 24 : hours + 1).toString().padStart(2, '0')}:00`;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function convertDrinkToCalculatorFormat(drink: AppDrink) {
  return {
    startTime: drink.time,
    doseMg: drink.caffeineMg,
    drinkDurationHrs: drink.durationMin / 60
  };
}

function generateDataPoints(drinks: AppDrink[], weightLbs: number, sensitivity: number): DataPoint[] {
  if (drinks.length === 0) return [];

  const earliestDrinkTime = Math.min(...drinks.map(d => timeToDecimal(d.time)));
  const startTime = Math.max(0, earliestDrinkTime - TIME_BUFFER_HRS);
  
  const points: DataPoint[] = [];
  let currentTime = startTime;
  let consecutiveLowReadings = 0;
  
  while (consecutiveLowReadings < POINTS_TO_SHOW_UNDER_THRESHOLD) {
    const concentrationMgL = getTotalCaffeineConcentration({
      currentTime: decimalToTimeString(currentTime, false),
      drinks: drinks.map(d => ({
        ...convertDrinkToCalculatorFormat(d),
        startTime: d.time
      })),
      halfLifeHrs: sensitivity,
      weightLbs
    });
    
    const totalMg = concentrationMgL * (weightLbs * 0.453592 * 0.6);
    
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
  return decimalToTimeString(time, true).replace(/(\d{2}):(\d{2})/, (_, h, m) => {
    const hours = parseInt(h);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const suffix = Math.floor(time) >= 24 ? ' (next day)' : '';
    return `${displayHours}:${m} ${period}${suffix}`;
  });
}

interface CaffeineChartProps {
  drinks: AppDrink[];
  weightLbs: number;
  sensitivity: number;
  className?: string;
}

export function CaffeineChart({ 
  drinks,
  weightLbs,
  sensitivity,
  className
}: CaffeineChartProps) {
  const hasData = drinks.length > 0;
  const data = hasData ? generateDataPoints(drinks, weightLbs, sensitivity) : [];
  const maxConcentration = data.length > 0 ? Math.max(...data.map(d => d.concentration)) : 0;
  const yAxisMax = Math.ceil(maxConcentration * 1.05);

  const thirtyMgTime = findThirtyMgTime(data);
  const xAxisTicks = [...drinks.map(d => timeToDecimal(d.time))];
  if (thirtyMgTime !== undefined) {
    xAxisTicks.push(thirtyMgTime);
  }

  return (
    <Flex direction="column" gap="3" className={className} style={{ minHeight: '300px' }}>
      {hasData ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
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

          <Flex px="4">
            <Text size="2" color="gray">
              
              {thirtyMgTime && (
                <>By {formatTimeLabel(thirtyMgTime)}, your caffeine levels should be low enough that it's unlikely to affect your sleep.</>
              )}
            </Text>
          </Flex>
        </>
      ) : (
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          style={{ 
            height: '300px',
            position: 'relative'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url('/chart-example.webp') no-repeat center center`,
            backgroundSize: 'contain',
            filter: 'blur(2px)',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
          }}>
            <Text size="4" weight="bold" color="gray">
              Add at least one drink to see your curve
            </Text>
          </div>
        </Flex>
      )}
    </Flex>
  );
} 