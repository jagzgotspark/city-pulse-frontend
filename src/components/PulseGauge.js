function PulseGauge({ score, size = 120 }) {
  const radius = size / 2 - 10;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;

  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size / 2 + 20} style={{ overflow: 'visible' }}>
        <path
          d={`M ${10} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d={`M ${10} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fill={color}
        >
          {score}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 18}
          textAnchor="middle"
          fontSize="11"
          fill="#999"
        >
          out of 100
        </text>
      </svg>
    </div>
  );
}

export default PulseGauge;