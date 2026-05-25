import { redirect } from 'next/navigation';

export default function AssignmentsRedirect() {
  // The home dashboard (/) acts as the assignments page in VedaAI.
  redirect('/');
}
