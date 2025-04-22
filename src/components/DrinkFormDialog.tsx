import { Dialog } from '@radix-ui/themes';
import { DrinkForm } from './DrinkForm';
import type { Drink } from '@/types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (drink: Drink) => void;
};

export function DrinkFormDialog({ open, onOpenChange, onSubmit }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content size="4">
        <Dialog.Title mb="4" size="6">Add Drink</Dialog.Title>
        <DrinkForm 
          onSubmit={(drink) => {
            onSubmit(drink);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
} 