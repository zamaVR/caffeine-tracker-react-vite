import { useState, FormEvent } from 'react';
import { Box, Button, Flex, Select, Text, IconButton } from '@radix-ui/themes';
import { PlusIcon, MinusIcon, ClockIcon } from '@radix-ui/react-icons';
import { predefinedDrinks } from '@/data/predefinedDrinks';
import { TimePickerDialog } from './TimePickerDialog';
import type { Drink } from '@/types';
import { formatDuration } from '@/utils/format';

const DEFAULT_TIME = '08:00';
const MIN_DURATION = 15;
const MAX_DURATION = 480; // 8 hours in minutes
const DURATION_STEP = 15;

type TimeComponents = {
  hours: string;
  minutes: string;
  period: 'AM' | 'PM';
};

function parseTime(time24: string): TimeComponents {
  const date = new Date(`2000-01-01T${time24}`);
  const hours = date.getHours();
  return {
    hours: ((hours % 12) || 12).toString(),
    minutes: date.getMinutes().toString().padStart(2, '0'),
    period: hours >= 12 ? 'PM' : 'AM'
  };
}

function formatTime(components: TimeComponents): string {
  const hours24 = components.period === 'AM' 
    ? (components.hours === '12' ? 0 : parseInt(components.hours))
    : (components.hours === '12' ? 12 : parseInt(components.hours) + 12);
  return `${hours24.toString().padStart(2, '0')}:${components.minutes}`;
}

const DEFAULT_TIME_COMPONENTS = parseTime(DEFAULT_TIME);

type Props = {
  initialDrink?: Partial<Drink>;
  onSubmit: (drink: Drink) => void;
  onCancel?: () => void;
};

export function DrinkForm({ initialDrink = {}, onSubmit, onCancel }: Props) {
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [timeComponents, setTimeComponents] = useState<TimeComponents>(() => {
    if (initialDrink.time) {
      return parseTime(initialDrink.time);
    }
    return DEFAULT_TIME_COMPONENTS;
  });
  const [durationMin, setDurationMin] = useState(initialDrink.durationMin || MIN_DURATION);

  const handleDurationChange = (change: number) => {
    const newDuration = durationMin + change;
    if (newDuration >= MIN_DURATION && newDuration <= MAX_DURATION) {
      setDurationMin(newDuration);
    }
  };

  const handleSubmit = () => {
    const preset = predefinedDrinks.find((d) => d.id === selectedPresetId);
    if (!preset) return;

    const time24 = formatTime(timeComponents);

    const drink: Drink = {
      id: Date.now().toString(),
      label: preset.label,
      caffeineMg: preset.caffeineMg,
      time: time24,
      durationMin,
    };

    onSubmit(drink);
  };

  return (
    <Box asChild>
      <form onSubmit={(e: FormEvent) => e.preventDefault()}>
        <Flex direction="column" gap="4">
          <Flex direction="column" gap="2">
            <Text as="label" size="2" weight="bold">Drink Type</Text>
            <Select.Root value={selectedPresetId} onValueChange={setSelectedPresetId}>
              <Select.Trigger placeholder="Select a drink..." />
              <Select.Content>
                {predefinedDrinks.map((preset) => (
                  <Select.Item key={preset.id} value={preset.id}>
                    {preset.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>

          <Flex direction="column" gap="2">
            <Text as="label" size="2" weight="bold">Time of Consumption</Text>
            <Button 
              variant="soft" 
              onClick={() => setTimePickerOpen(true)}
              style={{ justifyContent: 'flex-start' }}
            >
              <Flex gap="2" align="center">
                <ClockIcon />
                <Text>{timeComponents.hours}:{timeComponents.minutes} {timeComponents.period}</Text>
              </Flex>
            </Button>
            <TimePickerDialog
              open={timePickerOpen}
              onOpenChange={setTimePickerOpen}
              value={timeComponents}
              onChange={setTimeComponents}
            />
          </Flex>

          <Flex direction="column" gap="2">
            <Text as="label" size="2" weight="bold">Duration of Consumption</Text>
            <Flex gap="3" align="center" justify="between">
              <IconButton 
                variant="soft" 
                onClick={() => handleDurationChange(-DURATION_STEP)}
                disabled={durationMin <= MIN_DURATION}
                size="3"
              >
                <MinusIcon />
              </IconButton>
              
              <Text style={{ minWidth: '100px', textAlign: 'center' }}>
                {formatDuration(durationMin)}
              </Text>

              <IconButton 
                variant="soft" 
                onClick={() => handleDurationChange(DURATION_STEP)}
                disabled={durationMin >= MAX_DURATION}
                size="3"
              >
                <PlusIcon />
              </IconButton>
            </Flex>
          </Flex>

          <Flex gap="3" mt="4">
            {onCancel && (
              <Button 
                variant="soft" 
                color="gray" 
                onClick={onCancel} 
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
            )}
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedPresetId}
              style={{ flex: 1 }}
            >
              Add
            </Button>
          </Flex>
        </Flex>
      </form>
    </Box>
  );
} 