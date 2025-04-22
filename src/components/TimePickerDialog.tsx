import { Dialog, Button, Flex, Text, IconButton } from '@radix-ui/themes';
import { useState, useEffect } from 'react';
import { ClockIcon, ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons';

type TimeComponents = {
  hours: string;
  minutes: string;
  period: 'AM' | 'PM';
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: TimeComponents;
  onChange: (time: TimeComponents) => void;
};

export function TimePickerDialog({ open, onOpenChange, value, onChange }: Props) {
  const [time, setTime] = useState<TimeComponents>(value);

  // Reset time state when dialog opens
  useEffect(() => {
    if (open) {
      setTime(value);
    }
  }, [open, value]);

  const incrementHour = () => {
    setTime(prev => {
      const currentHour = parseInt(prev.hours);
      if (currentHour === 11) {
        return { ...prev, hours: '12' };
      } else if (currentHour === 12) {
        return { ...prev, hours: '1' };
      } else {
        return { ...prev, hours: (currentHour + 1).toString() };
      }
    });
  };

  const decrementHour = () => {
    setTime(prev => {
      const currentHour = parseInt(prev.hours);
      if (currentHour === 1) {
        return { ...prev, hours: '12' };
      } else if (currentHour === 12) {
        return { ...prev, hours: '11' };
      } else {
        return { ...prev, hours: (currentHour - 1).toString() };
      }
    });
  };

  const incrementMinute = () => {
    setTime(prev => {
      const currentMinute = parseInt(prev.minutes);
      if (currentMinute === 45) {
        return { ...prev, minutes: '00' };
      } else {
        const newMinute = currentMinute + 15;
        return { ...prev, minutes: newMinute.toString().padStart(2, '0') };
      }
    });
  };

  const decrementMinute = () => {
    setTime(prev => {
      const currentMinute = parseInt(prev.minutes);
      if (currentMinute === 0) {
        return { ...prev, minutes: '45' };
      } else {
        const newMinute = currentMinute - 15;
        return { ...prev, minutes: newMinute.toString().padStart(2, '0') };
      }
    });
  };

  const togglePeriod = () => {
    setTime(prev => ({
      ...prev,
      period: prev.period === 'AM' ? 'PM' : 'AM'
    }));
  };

  const handleSave = () => {
    onChange(time);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content size="2">
        <Dialog.Title>
          <Flex align="center" gap="2">
            <ClockIcon width="20" height="20" />
            <Text size="5">Select Time</Text>
          </Flex>
        </Dialog.Title>

        <Flex align="center" justify="center" gap="4" my="6">
          {/* Hours */}
          <Flex direction="column" align="center">
            <IconButton size="2" variant="soft" onClick={incrementHour}>
              <ChevronUpIcon width="16" height="16" />
            </IconButton>
            <Text size="6" my="2">{time.hours}</Text>
            <IconButton size="2" variant="soft" onClick={decrementHour}>
              <ChevronDownIcon width="16" height="16" />
            </IconButton>
          </Flex>

          <Text size="6">:</Text>

          {/* Minutes */}
          <Flex direction="column" align="center">
            <IconButton size="2" variant="soft" onClick={incrementMinute}>
              <ChevronUpIcon width="16" height="16" />
            </IconButton>
            <Text size="6" my="2">{time.minutes}</Text>
            <IconButton size="2" variant="soft" onClick={decrementMinute}>
              <ChevronDownIcon width="16" height="16" />
            </IconButton>
          </Flex>

          {/* AM/PM */}
          <Button 
            size="2" 
            variant="soft" 
            onClick={togglePeriod}
          >
            {time.period}
          </Button>
        </Flex>

        <Flex gap="3" justify="end">
          <Button 
            variant="soft" 
            color="gray" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
} 