"use client";
import { usePathname } from 'next/navigation';
export function useProgram() {
  const pathname = usePathname() || '';
  const program = pathname.startsWith('/dashboard/math') || pathname.startsWith('/dashboard/admin/math') ? 'math' : 'general';
  return { program, examBasePath: program === 'math' ? '/dashboard/math/live-exams' : '/dashboard/live-exams', adminExamPath: program === 'math' ? '/dashboard/admin/math/live-exams' : '/dashboard/admin/live-exams' };
}
