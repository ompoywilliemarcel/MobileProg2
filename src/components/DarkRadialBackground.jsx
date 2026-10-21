import { StyleSheet, View } from 'react-native';

const circles = [
  { size: 520, color: '#0A2137' },
  { size: 420, color: '#0C263E' },
  { size: 320, color: '#0F2B45' },
  { size: 220, color: '#12314B' },
  { size: 120, color: '#153650' },
];

export default function DarkRadialBackground() {
  return (
    <View pointerEvents="none" style={styles.background}>
      <View style={styles.glow}>
        {circles.map(({ size, color }) => (
          <View
            key={size}
            style={[
              styles.circle,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.goldGlow} />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glow: {
    alignItems: 'center',
    height: 520,
    left: 0,
    position: 'absolute',
    right: 0,
    top: -90,
  },
  circle: {
    position: 'absolute',
    top: 0,
  },
  goldGlow: {
    backgroundColor: 'rgba(217,180,91,0.08)',
    borderRadius: 120,
    height: 240,
    position: 'absolute',
    right: -100,
    top: 300,
    width: 240,
  },
});
