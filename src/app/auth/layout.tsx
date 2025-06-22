import { Toaster } from 'react-hot-toast';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div>{children}</div>
      <Toaster position='top-right' />
    </>
  );
}
