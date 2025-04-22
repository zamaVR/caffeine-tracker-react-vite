import { Flex, Slider, Text } from '@radix-ui/themes';

type Props = {
  value: number;  // This will be the actual half-life in hours (3-7)
  onChange: (value: number) => void;
};

// Maps sensitivity level (1-5) to half-life in hours (3-7)
function sensitivityToHours(level: number): number {
  return level + 2; // level 1 -> 3 hours, level 5 -> 7 hours
}

// Maps half-life hours (3-7) to sensitivity level (1-5)
function hoursToSensitivity(hours: number): number {
  return hours - 2; // 3 hours -> level 1, 7 hours -> level 5
}

const sensitivityLabels = [
  'Very Tolerant',          // 3 hours
  'Somewhat Tolerant',      // 4 hours
  'Average',                // 5 hours
  'Somewhat Sensitive',     // 6 hours
  'Very Sensitive'          // 7 hours
];

export function SensitivitySlider({ value, onChange }: Props) {
  // Convert hours to sensitivity level for display
  const sensitivityLevel = hoursToSensitivity(value);

  const handleChange = (newLevel: number) => {
    // Convert sensitivity level back to hours for the parent component
    onChange(sensitivityToHours(newLevel));
  };

  return (
    <Flex direction="column" gap="2">
      <Text size="4" weight="bold">Caffeine Sensitivity</Text>
      <Slider 
        size="2"
        variant="soft"
        value={[sensitivityLevel]}
        min={1}
        max={5}
        step={1}
        onValueChange={(values) => handleChange(values[0])}
      />
      <Text size="2" align="center">
        {sensitivityLabels[sensitivityLevel - 1]}
      </Text>
    </Flex>
  );
}
