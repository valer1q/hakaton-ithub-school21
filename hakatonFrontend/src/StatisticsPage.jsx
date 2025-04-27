import { RingProgress, Text, Title, SimpleGrid, rem } from '@mantine/core';

export default function StatisticsPage() {
  return (
    <div style={{ padding: '20px' }}>
      <Title order={2} mb="lg" ta="center">
        Skills Statistics
      </Title>

      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing="xl"
        verticalSpacing="xl"
      >
        {/* График 1 */}
        <div>
          <Text fw={500} mb="xs" ta="center">
            Frontend Skills
          </Text>
          <RingProgress
            size={120}
            thickness={12}
            roundCaps
            sections={[
              { value: 40, color: 'cyan' },
              { value: 15, color: 'orange' },
              { value: 15, color: 'grape' },
            ]}
            label={
              <Text c="cyan" fw={700} ta="center" size="xl">
                40%
              </Text>
            }
          />
        </div>

        {/* График 2 */}
        <div>
          <Text fw={500} mb="xs" ta="center">
            Backend Skills
          </Text>
          <RingProgress
            size={120}
            thickness={12}
            roundCaps
            sections={[
              { value: 30, color: 'blue' },
              { value: 25, color: 'violet' },
            ]}
            label={
              <Text c="blue" fw={700} ta="center" size="xl">
                30%
              </Text>
            }
          />
        </div>

        {/* График 3 */}
        <div>
          <Text fw={500} mb="xs" ta="center">
            DevOps Skills
          </Text>
          <RingProgress
            size={120}
            thickness={12}
            roundCaps
            sections={[
              { value: 60, color: 'green' },
              { value: 10, color: 'yellow' },
            ]}
            label={
              <Text c="green" fw={700} ta="center" size="xl">
                60%
              </Text>
            }
          />
        </div>
      </SimpleGrid>

      <Text mt="xl" c="dimmed" ta="center">
        Last updated: {new Date().toLocaleDateString()}
      </Text>
    </div>
  );
}