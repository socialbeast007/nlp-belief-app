import './globals.css';

export const metadata = {
  title: 'NLP Belief Reframer',
  description: 'AI-driven belief transformation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
