import { useState } from 'react'
import { Container, Flex, Card, Theme } from '@radix-ui/themes'
import { DrinkFormDialog } from './components/DrinkFormDialog'
import { DrinkList } from './components/DrinkList'
import { SensitivitySlider } from './components/SensitivitySlider'
import { WeightSelector } from './components/WeightSelector'
import { CaffeineChart } from './components/CaffeineChart'
import { GeometricOverlay } from './components/GeometricOverlay'
import { Footer } from './components/Footer'
import type { Drink } from '@/types'

export default function App() {
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [sensitivity, setSensitivity] = useState(5) // Default to medium (5 hours)
  const [weightLbs, setWeightLbs] = useState(155) // Default weight in pounds
  const [showAddDrink, setShowAddDrink] = useState(false)

  const handleAddDrink = (drink: Drink) => {
    setDrinks(prev => [...prev, drink])
  }

  const handleDeleteDrink = (drinkId: string) => {
    setDrinks(prev => prev.filter(drink => drink.id !== drinkId))
  }

  return (
    <Theme
      appearance="light"
      accentColor="bronze"
      grayColor="mauve"
      panelBackground="translucent"
    >
      <div className="full-screen-wrapper">
        <GeometricOverlay />
        <Container size="1" p="4">
          <Card>
            <Flex direction="column" gap="4">
              <DrinkList 
                drinks={drinks} 
                onDelete={handleDeleteDrink}
                onAdd={() => setShowAddDrink(true)}
              />

              {/* Sensitivity Slider */}
              <Card variant="surface">
                <SensitivitySlider 
                  value={sensitivity}
                  onChange={setSensitivity}
                />
              </Card>

              {/* Weight Selector */}
              <WeightSelector
                value={weightLbs}
                onChange={setWeightLbs}
              />

              {/* Caffeine Chart */}
              <Card variant="surface">
                <CaffeineChart
                  drinks={drinks}
                  weightLbs={weightLbs}
                  sensitivity={sensitivity}
                />
              </Card>
            </Flex>
          </Card>

          <Footer />

          <DrinkFormDialog
            open={showAddDrink}
            onOpenChange={setShowAddDrink}
            onSubmit={handleAddDrink}
          />
        </Container>
      </div>
    </Theme>
  )
}
