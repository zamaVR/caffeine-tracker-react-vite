import { Dialog, Flex, Text } from '@radix-ui/themes'
import { useState } from 'react'

export function Footer() {
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showFAQs, setShowFAQs] = useState(false)

  return (
    <footer className="mt-8 py-4 text-center text-[#8b7355]">
      <Flex direction="column" align="center" gap="3">
        <Text className="text-sm text-[#8b7355]">
          Follow me on{' '}
          <a
            href="https://linkedin.com/in/jesse-zamazanuk/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            LinkedIn
          </a>
        </Text>

        <Flex justify="center" align="center" gap="3" className="text-sm">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setShowTerms(true); }}
            className="hover:underline"
          >
            Terms of Use
          </a>
          <Text>|</Text>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}
            className="hover:underline"
          >
            Privacy Policy
          </a>
          <Text>|</Text>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setShowFAQs(true); }}
            className="hover:underline"
          >
            FAQs
          </a>
        </Flex>
      </Flex>

      {/* Terms Dialog */}
      <Dialog.Root open={showTerms} onOpenChange={setShowTerms}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Terms of Use</Dialog.Title>
          <Dialog.Description size="2">
            I will be updating terms of use soon... for now, behave yourself.
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>

      {/* Privacy Dialog */}
      <Dialog.Root open={showPrivacy} onOpenChange={setShowPrivacy}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Privacy Policy</Dialog.Title>
          <Dialog.Description size="2">
          I will be updating the privacy policy soon... for now, behave yourself.
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>

      {/* FAQs Dialog */}
      <Dialog.Root open={showFAQs} onOpenChange={setShowFAQs}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Frequently Asked Questions</Dialog.Title>
          <Dialog.Description size="2">
            I will be updating the FAQs soon... for now, let your imagination run wild.
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>
    </footer>
  )
} 