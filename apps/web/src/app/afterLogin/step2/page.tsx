import { redirect } from 'next/navigation';

export default function Step2() {
  redirect('/afterLogin/step1');
}
