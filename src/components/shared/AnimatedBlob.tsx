interface AnimatedBlobProps {
  color: string;
  position: string;
  delay?: number;
}

export default function AnimatedBlob({ color, position, delay = 0 }: AnimatedBlobProps) {
  return (
    <div
      className={`absolute ${position} w-96 h-96 ${color} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob`}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}
