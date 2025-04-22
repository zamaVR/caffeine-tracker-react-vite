import { Card, Flex, Text, IconButton } from '@radix-ui/themes';
import { PlusIcon, MinusIcon } from '@radix-ui/react-icons';

const MIN_WEIGHT = 100; // lbs
const MAX_WEIGHT = 300; // lbs
const WEIGHT_STEP = 5; // lbs

interface WeightSelectorProps {
  value: number;
  onChange: (weight: number) => void;
}

export function WeightSelector({ value, onChange }: WeightSelectorProps) {
  const handleWeightChange = (change: number) => {
    const newWeight = value + change;
    if (newWeight >= MIN_WEIGHT && newWeight <= MAX_WEIGHT) {
      onChange(newWeight);
    }
  };

  return (
    <Card className="mobile-card">
      <Flex direction="column" gap="2">
        <Text as="label" size="4" weight="bold">Approximate Weight</Text>
        <Flex gap="3" align="center" justify="between">
          <IconButton 
            variant="soft" 
            onClick={() => handleWeightChange(-WEIGHT_STEP)}
            disabled={value <= MIN_WEIGHT}
            size="3"
          >
            <MinusIcon />
          </IconButton>
          
          <Text style={{ minWidth: '100px', textAlign: 'center' }}>
            {value} lbs
          </Text>

          <IconButton 
            variant="soft" 
            onClick={() => handleWeightChange(WEIGHT_STEP)}
            disabled={value >= MAX_WEIGHT}
            size="3"
          >
            <PlusIcon />
          </IconButton>
        </Flex>
      </Flex>
    </Card>
  );
} 