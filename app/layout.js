export const metadata = {
  title: 'OpenAI Chat',
  description: 'Chat with GPT-4 using Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
