interface ParentStatusIconProps {
  involvement: number;
}

export default function ParentStatusIcon({ involvement }: ParentStatusIconProps) {
  if (involvement >= 60) {
    return (
      <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" title="적극" />
    );
  }
  if (involvement >= 30) {
    return (
      <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500" title="보통" />
    );
  }
  return (
    <span
      className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"
      title="비협조"
    />
  );
}
