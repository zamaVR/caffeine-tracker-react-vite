import { Card, Flex, Text, IconButton, Button } from '@radix-ui/themes';
import { TrashIcon, PlusIcon } from '@radix-ui/react-icons';
import type { Drink } from '@/types';
import { formatTime, formatDuration } from '@/utils/format';

interface DrinkListProps {
  drinks: Drink[];
  onDelete: (drinkId: string) => void;
  onAdd: () => void;
}

export function DrinkList({ drinks, onDelete, onAdd }: DrinkListProps) {
  return (
    <Card className="mobile-card">
      <Flex direction="column" gap="2" className="mobile-compact">
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">Daily Drinks</Text>
          <Button 
            variant="soft" 
            onClick={onAdd}
          >
            <PlusIcon />
            Add Drink
          </Button>
        </Flex>
        {drinks.length === 0 ? (
          <Text color="gray">No drinks added yet</Text>
        ) : (
          drinks.map(drink => (
            <Card key={drink.id} variant="surface" className="mobile-card">
              <Flex gap="3" align="center">
                <Flex direction="column" gap="1" style={{ flex: 1 }}>
                  <Text size="3">{drink.label}</Text>
                  <Text size="2" color="gray">
                    At {formatTime(drink.time)} for {formatDuration(drink.durationMin)}
                  </Text>
                </Flex>
                <IconButton 
                  color="red" 
                  variant="soft" 
                  size="3"
                  onClick={() => onDelete(drink.id)}
                  style={{ alignSelf: 'center' }}
                >
                  <TrashIcon width="18" height="18" />
                </IconButton>
              </Flex>
            </Card>
          ))
        )}
      </Flex>
    </Card>
  );
}

