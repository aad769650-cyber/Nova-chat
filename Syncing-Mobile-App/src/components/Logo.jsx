// src/components/Logo.jsx
import Svg, { Defs, LinearGradient, Stop, Circle, Path } from "react-native-svg";

export default function Logo({ size = 64 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id="novaGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#8b5cf6" />
          <Stop offset="1" stopColor="#22d3ee" />
        </LinearGradient>
      </Defs>
      <Circle cx="32" cy="32" r="32" fill="url(#novaGrad)" />
      <Path d="M32 14 L36 28 L50 32 L36 36 L32 50 L28 36 L14 32 L28 28 Z" fill="#ffffff" />
    </Svg>
  );
}
